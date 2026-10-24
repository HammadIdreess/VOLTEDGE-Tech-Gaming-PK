import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { isValidPakistaniPhone } from '@/lib/format';
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

interface CheckoutItemPayload {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingProvince,
      shippingCity,
      shippingArea,
      shippingAddress,
      shippingPostalCode,
      deliveryNotes,
      paymentMethod,
      couponCode,
      items,
    } = body;

    // 1. Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingProvince ||
      !shippingCity ||
      !shippingArea ||
      !shippingAddress ||
      !paymentMethod ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: 'Please fill in all required delivery and payment fields.' }, { status: 400 });
    }

    if (!isValidPakistaniPhone(customerPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Pakistani phone number (e.g. 03001234567 or +923001234567)' },
        { status: 400 }
      );
    }

    // 2. Fetch products and calculate server-authoritative totals
    const checkoutItems: Array<{
      productId: string;
      productTitle: string;
      variantId?: string | null;
      variantName?: string | null;
      sku: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    let calculatedSubtotal = 0;

    for (const item of items as CheckoutItemPayload[]) {
      if (!item.productId || item.quantity <= 0) continue;

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product not found or currently unavailable.` }, { status: 400 });
      }

      let unitPrice = product.salePrice ?? product.basePrice;
      let sku = product.sku;
      let variantName: string | null = null;
      let availableStock = product.stock;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ error: `Selected product variant is invalid.` }, { status: 400 });
        }
        unitPrice += variant.priceAdjustment;
        sku = variant.sku;
        variantName = variant.name;
        availableStock = variant.stock;
      }

      if (item.quantity > availableStock) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.title}". Available: ${availableStock}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      checkoutItems.push({
        productId: product.id,
        productTitle: product.title,
        variantId: item.variantId ?? null,
        variantName,
        sku,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    if (checkoutItems.length === 0) {
      return NextResponse.json({ error: 'Your cart contains no valid items.' }, { status: 400 });
    }

    // 3. Shipping calculation
    const shippingFee = calculatedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;

    // 4. Coupon validation and calculation
    let calculatedDiscount = 0;
    let validCouponId: string | null = null;

    if (couponCode && typeof couponCode === 'string') {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isNotExpired = !coupon.endDate || now <= coupon.endDate;
        const isStarted = !coupon.startDate || now >= coupon.startDate;
        const isUnderLimit = !coupon.usageLimit || coupon.timesUsed < coupon.usageLimit;
        const meetsMin = !coupon.minOrderAmount || calculatedSubtotal >= coupon.minOrderAmount;

        if (isNotExpired && isStarted && isUnderLimit && meetsMin) {
          validCouponId = coupon.id;
          if (coupon.discountType === 'PERCENTAGE') {
            calculatedDiscount = (calculatedSubtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
              calculatedDiscount = coupon.maxDiscountAmount;
            }
          } else {
            calculatedDiscount = coupon.discountValue;
          }
          calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
        }
      }
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + shippingFee);

    // 5. Generate human-readable Order Number: VE-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VE-${dateStr}-${randomSuffix}`;

    // 6. Ensure user account or guest customer
    let userId = session?.userId;
    if (!userId) {
      // Find existing customer by email or create guest customer account
      const normalizedEmail = customerEmail.trim().toLowerCase();
      let customer = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!customer) {
        customer = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: customerName.trim(),
            passwordHash: 'GUEST_CHECKOUT',
            phone: customerPhone.trim(),
            role: 'CUSTOMER',
          },
        });
      }
      userId = customer.id;
    }

    // 7. Execute transactional database creation and stock deduction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: customerPhone.trim(),
          shippingProvince,
          shippingCity,
          shippingArea,
          shippingAddress,
          shippingPostalCode: shippingPostalCode?.trim() || null,
          deliveryNotes: deliveryNotes?.trim() || null,
          subtotal: calculatedSubtotal,
          discountAmount: calculatedDiscount,
          shippingFee,
          taxAmount: 0,
          totalAmount: calculatedTotal,
          status: 'PENDING_CONFIRMATION',
          paymentStatus: paymentMethod === 'ONLINE_CARD' ? 'PAID' : 'PENDING',
          paymentMethod,
          couponCode: validCouponId ? couponCode.trim().toUpperCase() : null,
          items: {
            create: checkoutItems.map((ci) => ({
              productId: ci.productId,
              variantId: ci.variantId,
              productTitle: ci.productTitle,
              variantName: ci.variantName,
              sku: ci.sku,
              unitPrice: ci.unitPrice,
              quantity: ci.quantity,
              totalPrice: ci.totalPrice,
            })),
          },
          statusHistory: {
            create: {
              status: 'PENDING_CONFIRMATION',
              notes: `Order placed via ${paymentMethod.replace(/_/g, ' ')}.`,
            },
          },
          payments: {
            create: {
              amount: calculatedTotal,
              currency: 'PKR',
              provider: paymentMethod,
              status: paymentMethod === 'ONLINE_CARD' ? 'PAID' : 'PENDING',
              receivedAt: paymentMethod === 'ONLINE_CARD' ? new Date() : null,
            },
          },
        },
      });

      // Deduct stock and record inventory movement
      for (const item of checkoutItems) {
        if (item.variantId) {
          const variant = await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
          await tx.inventoryMovement.create({
            data: {
              variantId: item.variantId,
              productId: item.productId,
              quantityDelta: -item.quantity,
              resultingStock: variant.stock,
              movementType: 'PURCHASE_DEDUCTION',
              reason: `Order ${orderNumber} placed`,
              referenceOrderId: newOrder.id,
            },
          });
        } else {
          const prod = await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              quantityDelta: -item.quantity,
              resultingStock: prod.stock,
              movementType: 'PURCHASE_DEDUCTION',
              reason: `Order ${orderNumber} placed`,
              referenceOrderId: newOrder.id,
            },
          });
        }
      }

      // Record coupon redemption if applicable
      if (validCouponId) {
        await tx.coupon.update({
          where: { id: validCouponId },
          data: { timesUsed: { increment: 1 } },
        });

        await tx.couponRedemption.create({
          data: {
            couponId: validCouponId,
            userId,
            orderId: newOrder.id,
            discountAmount: calculatedDiscount,
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error('Checkout processing error:', error);
    return NextResponse.json({ error: 'Failed to process order. Please check your items and try again.' }, { status: 500 });
  }
}
