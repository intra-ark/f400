import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
