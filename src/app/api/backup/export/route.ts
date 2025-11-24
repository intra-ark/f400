import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Only allow Admin users
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Export all data
        const [lines, products, yearData, users, userLines, globalSettings] = await Promise.all([
            prisma.line.findMany({ include: { assignedUsers: true } }),
            prisma.product.findMany({ include: { yearData: true } }),
            prisma.yearData.findMany(),
            prisma.user.findMany({ select: { id: true, username: true, role: true, createdAt: true, updatedAt: true } }),
            prisma.userLine.findMany(),
            prisma.globalSettings.findMany(),
        ]);

        const backup = {
            exportDate: new Date().toISOString(),
            exportedBy: session.user.name,
            version: '1.0',
            data: {
                lines,
                products,
                yearData,
                users,
                userLines,
                globalSettings,
            }
        };

        return new NextResponse(JSON.stringify(backup, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="set-sps-backup-${new Date().toISOString().split('T')[0]}.json"`,
            },
        });
    } catch (error) {
        console.error('Backup error:', error);
        return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
    }
}
