import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, year, dt, ut, nva, kd, ke, ker, ksr, otr, tsr } = body;

        const yearData = await prisma.yearData.upsert({
            where: {
                productId_year: {
                    productId: productId,
                    year: year,
                },
            },
            update: {
                dt, ut, nva, kd, ke, ker, ksr, otr, tsr,
            },
            create: {
                productId: productId,
                year: year,
                dt, ut, nva, kd, ke, ker, ksr, otr, tsr,
            },
        });

        return NextResponse.json(yearData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save year data' }, { status: 500 });
    }
}
