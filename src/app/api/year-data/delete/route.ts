import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canUserAccessLine } from '@/lib/permissions';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, year } = await request.json();

        if (!productId || !year) {
            return NextResponse.json({ error: 'Missing productId or year' }, { status: 400 });
        }

        // Fetch product to get lineId
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            select: { lineId: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.lineId) {
            const hasAccess = await canUserAccessLine(
                parseInt(session.user.id),
                product.lineId,
                session.user.role
            );

            if (!hasAccess) {
                return NextResponse.json({ error: 'Access denied to this line' }, { status: 403 });
            }
        } else if (session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Delete the yearData record
        await prisma.yearData.deleteMany({
            where: {
                productId: parseInt(productId),
                year: parseInt(year)
            }
        });

        return NextResponse.json({ message: 'Product removed from year' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
