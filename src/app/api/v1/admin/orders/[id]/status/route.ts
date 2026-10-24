import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { status, paymentStatus, notes, trackingNumber, courierName } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // Handle cancellation restock if order cancelled
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        if (item.variantId) {
          const v = await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
          await prisma.inventoryMovement.create({
            data: {
              variantId: item.variantId,
              productId: item.productId,
              quantityDelta: item.quantity,
              resultingStock: v.stock,
              movementType: 'ORDER_CANCEL_RESTOCK',
              reason: `Order ${order.orderNumber} cancelled by admin`,
              referenceOrderId: order.id,
              adminUserId: admin.userId,
            },
          });
        } else {
          const p = await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
          await prisma.inventoryMovement.create({
            data: {
              productId: item.productId,
              quantityDelta: item.quantity,
              resultingStock: p.stock,
              movementType: 'ORDER_CANCEL_RESTOCK',
              reason: `Order ${order.orderNumber} cancelled by admin`,
              referenceOrderId: order.id,
              adminUserId: admin.userId,
            },
          });
        }
      }
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // Record history
    if (status && status !== order.status) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status,
          notes: notes || `Status updated to ${status} by administrator ${admin.name}.`,
          changedByUserId: admin.userId,
        },
      });
    }

    // Record shipment tracking if provided
    if (trackingNumber) {
      await prisma.shipment.create({
        data: {
          orderId: order.id,
          courierName: courierName || 'TCS Express',
          trackingNumber: trackingNumber.trim(),
          shippedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Order status update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order status' }, { status: 500 });
  }
}
