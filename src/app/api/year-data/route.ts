import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canUserAccessLine } from '@/lib/permissions';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, year, dt, ut, nva, kd, ke, ker, ksr, otr, tsr } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        if (!year || isNaN(parseInt(year))) {
            return NextResponse.json({ error: 'Valid Year is required' }, { status: 400 });
        }

        // Fetch product to get lineId
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            select: { lineId: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (!product.lineId) {
            // If product has no line, maybe only admin can edit? 
            // For now, let's assume if it has no line, regular users can't access it via line permissions.
            if (session.user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
        } else {
            const hasAccess = await canUserAccessLine(
                parseInt(session.user.id),
                product.lineId,
                session.user.role
            );

            if (!hasAccess) {
                return NextResponse.json({ error: 'Access denied to this line' }, { status: 403 });
            }
        }

        const yearData = await prisma.yearData.upsert({
            where: {
                productId_year: {
                    productId: parseInt(productId),
                    year: parseInt(year),
                },
            },
            update: {
                dt, ut, nva, kd, ke, ker, ksr, otr, tsr,
            },
            create: {
                productId: parseInt(productId),
                year: parseInt(year),
                dt, ut, nva, kd, ke, ker, ksr, otr, tsr,
            },
        });

        return NextResponse.json(yearData);
    } catch (_error) {
        console.error('Error saving year data:', _error);
        return NextResponse.json({ error: 'Failed to save year data' }, { status: 500 });
    }
}
