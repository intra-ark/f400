import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Only allow Admin users
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        // Validate sheets
        if (!workbook.SheetNames.includes('Lines') || !workbook.SheetNames.includes('Products & Year Data')) {
            return NextResponse.json({ error: 'Invalid Excel format. Missing required sheets.' }, { status: 400 });
        }

        const linesSheet = workbook.Sheets['Lines'];
        const productsSheet = workbook.Sheets['Products & Year Data'];

        const linesData = XLSX.utils.sheet_to_json(linesSheet);
        const productsData = XLSX.utils.sheet_to_json(productsSheet);

        // Use transaction for data integrity
        await prisma.$transaction(async (tx) => {
            // 1. Import Lines
            for (const row of linesData as any[]) {
                if (!row['Name'] || !row['Slug']) continue;

                await tx.line.upsert({
                    where: { slug: row['Slug'] },
                    update: {
                        name: row['Name'],
                        headerImageUrl: row['Header Image'] !== 'N/A' ? row['Header Image'] : null,
                    },
                    create: {
                        name: row['Name'],
                        slug: row['Slug'],
                        headerImageUrl: row['Header Image'] !== 'N/A' ? row['Header Image'] : null,
                    }
                });
            }

            // 2. Import Products and Year Data
            for (const row of productsData as any[]) {
                if (!row['Product Name'] || !row['Line'] || !row['Year']) continue;

                // Find or create line (if not exists from previous step)
                // Note: Ideally lines should be in Lines sheet, but we can try to find by name
                const line = await tx.line.findFirst({
                    where: { name: row['Line'] }
                });

                if (!line) {
                    console.warn(`Line not found for product ${row['Product Name']}: ${row['Line']}`);
                    continue;
                }

                // Find or create product
                const product = await tx.product.upsert({
                    where: {
                        name: row['Product Name']
                    },
                    update: {
                        lineId: line.id // Update line association if needed
                    },
                    create: {
                        name: row['Product Name'],
                        lineId: line.id,
                        image: null
                    }
                });

                // Create or update Year Data
                await tx.yearData.upsert({
                    where: {
                        productId_year: {
                            productId: product.id,
                            year: parseInt(row['Year'])
                        }
                    },
                    update: {
                        dt: parseFloat(row['DT']) || 0,
                        ut: parseFloat(row['UT']) || 0,
                        nva: parseFloat(row['NVA']) || 0,
                        kd: row['KD (%)'] !== 'N/A' ? parseFloat(row['KD (%)']) / 100 : null,
                        ke: row['KE (%)'] !== 'N/A' ? parseFloat(row['KE (%)']) / 100 : null,
                        ker: row['KER (%)'] !== 'N/A' ? parseFloat(row['KER (%)']) / 100 : null,
                        ksr: row['KSR (%)'] !== 'N/A' ? parseFloat(row['KSR (%)']) / 100 : null,
                        otr: parseFloat(row['OT']) || 0,
                        tsr: row['TSR'] !== 'N/A' ? row['TSR'] : null,
                    },
                    create: {
                        productId: product.id,
                        year: parseInt(row['Year']),
                        dt: parseFloat(row['DT']) || 0,
                        ut: parseFloat(row['UT']) || 0,
                        nva: parseFloat(row['NVA']) || 0,
                        kd: row['KD (%)'] !== 'N/A' ? parseFloat(row['KD (%)']) / 100 : null,
                        ke: row['KE (%)'] !== 'N/A' ? parseFloat(row['KE (%)']) / 100 : null,
                        ker: row['KER (%)'] !== 'N/A' ? parseFloat(row['KER (%)']) / 100 : null,
                        ksr: row['KSR (%)'] !== 'N/A' ? parseFloat(row['KSR (%)']) / 100 : null,
                        otr: parseFloat(row['OT']) || 0,
                        tsr: row['TSR'] !== 'N/A' ? row['TSR'] : null,
                    }
                });
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Excel data imported successfully',
            importedCounts: {
                lines: linesData.length,
                products: productsData.length,
            }
        });
    } catch (error) {
        console.error('Excel import error:', error);
        return NextResponse.json({
            error: 'Failed to import Excel',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
