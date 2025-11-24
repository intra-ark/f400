import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canUserAccessLine } from '@/lib/permissions';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId');

    try {
        const where = lineId ? { lineId: parseInt(lineId) } : {};
        const products = await prisma.product.findMany({
            where,
            include: {
                yearData: true,
            },
        });
        return NextResponse.json(products);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, image, lineId } = body;

        if (!lineId) {
            return NextResponse.json({ error: 'Line ID is required' }, { status: 400 });
        }

        const hasAccess = await canUserAccessLine(
            parseInt(session.user.id),
            parseInt(lineId),
            session.user.role
        );

        if (!hasAccess) {
            return NextResponse.json({ error: 'Access denied to this line' }, { status: 403 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                image,
                lineId: parseInt(lineId),
            },
        });

        return NextResponse.json(product);
    } catch {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
