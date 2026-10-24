import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { productId, quantityDelta, reason } = await req.json();

    if (!productId || quantityDelta === undefined || !reason) {
      return NextResponse.json({ error: 'Product ID, delta, and reason are required.' }, { status: 400 });
    }

    const delta = parseInt(quantityDelta, 10);
    if (isNaN(delta) || delta === 0) {
      return NextResponse.json({ error: 'Quantity adjustment must be a non-zero integer.' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const newStock = product.stock + delta;
    if (newStock < 0) {
      return NextResponse.json({ error: `Cannot reduce stock below 0. Current stock is ${product.stock}.` }, { status: 400 });
    }

    const [updatedProduct, movement] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      }),
      prisma.inventoryMovement.create({
        data: {
          productId,
          quantityDelta: delta,
          resultingStock: newStock,
          movementType: 'MANUAL_ADJUSTMENT',
          reason: reason.trim(),
          adminUserId: admin.userId,
        },
      }),
    ]);

    return NextResponse.json({ success: true, product: updatedProduct, movement });
  } catch (error: any) {
    console.error('Inventory adjustment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to adjust inventory' }, { status: 500 });
  }
}
