import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Only allow Admin users
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const backup = await request.json();

        if (!backup.data) {
            return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 });
        }

        // Use transaction for data integrity
        await prisma.$transaction(async (tx) => {
            // Clear existing data (except users to preserve authentication)
            await tx.yearData.deleteMany({});
            await tx.product.deleteMany({});
            await tx.userLine.deleteMany({});
            await tx.line.deleteMany({});
            await tx.globalSettings.deleteMany({});

            // Import new data
            if (backup.data.globalSettings?.length > 0) {
                await tx.globalSettings.createMany({ data: backup.data.globalSettings });
            }

            if (backup.data.lines?.length > 0) {
                const linesData = backup.data.lines.map((line: any) => ({
                    id: line.id,
                    name: line.name,
                    slug: line.slug,
                    headerImageUrl: line.headerImageUrl,
                    createdAt: line.createdAt,
                    updatedAt: line.updatedAt,
                }));
                await tx.line.createMany({ data: linesData });
            }

            if (backup.data.products?.length > 0) {
                const productsData = backup.data.products.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    lineId: product.lineId,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                }));
                await tx.product.createMany({ data: productsData });
            }

            if (backup.data.yearData?.length > 0) {
                await tx.yearData.createMany({ data: backup.data.yearData });
            }

            if (backup.data.userLines?.length > 0) {
                await tx.userLine.createMany({ data: backup.data.userLines });
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Database restored successfully',
            importedCounts: {
                lines: backup.data.lines?.length || 0,
                products: backup.data.products?.length || 0,
                yearData: backup.data.yearData?.length || 0,
                userLines: backup.data.userLines?.length || 0,
            }
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({
            error: 'Failed to import backup',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
