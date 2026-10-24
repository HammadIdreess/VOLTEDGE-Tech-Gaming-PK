import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const {
      title,
      slug,
      shortDescription,
      description,
      brandId,
      categoryId,
      basePrice,
      salePrice,
      sku,
      stock,
      warrantyMonths,
      isFeatured,
      imageUrl,
      specifications,
    } = body;

    if (!title || !slug || !brandId || !categoryId || !sku || basePrice === undefined) {
      return NextResponse.json({ error: 'Please provide all required product attributes.' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Check slug and SKU uniqueness
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug: cleanSlug }, { sku: sku.trim() }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'A product with this slug or SKU already exists.' }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        shortDescription: shortDescription?.trim() || null,
        description: description?.trim() || title.trim(),
        brandId,
        categoryId,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: sku.trim(),
        stock: parseInt(stock, 10) || 0,
        warrantyMonths: parseInt(warrantyMonths, 10) || 12,
        isFeatured: Boolean(isFeatured),
        images: {
          create: [
            {
              url: imageUrl?.trim() || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
              altText: title.trim(),
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        specifications: {
          create: Array.isArray(specifications)
            ? specifications.map((s: any, idx: number) => ({
                groupName: s.groupName || 'General',
                specKey: s.specKey,
                specValue: s.specValue,
                sortOrder: idx,
              }))
            : [],
        },
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'CREATE_PRODUCT',
        entityType: 'Product',
        entityId: product.id,
        details: JSON.stringify({ title: product.title, sku: product.sku }),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id, isFeatured, isActive, stock, basePrice, salePrice } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (stock !== undefined) data.stock = parseInt(stock, 10);
    if (basePrice !== undefined) data.basePrice = parseFloat(basePrice);
    if (salePrice !== undefined) data.salePrice = salePrice ? parseFloat(salePrice) : null;

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'UPDATE_PRODUCT',
        entityType: 'Product',
        entityId: updated.id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}
