import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.globalSettings.findFirst();
        if (!settings) {
            settings = await prisma.globalSettings.create({
                data: { headerImageUrl: '/F400i.png' },
            });
        }
        return NextResponse.json(settings);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { headerImageUrl } = await request.json();

        let settings = await prisma.globalSettings.findFirst();
        if (settings) {
            settings = await prisma.globalSettings.update({
                where: { id: settings.id },
                data: { headerImageUrl },
            });
        } else {
            settings = await prisma.globalSettings.create({
                data: { headerImageUrl },
            });
        }

        return NextResponse.json(settings);
    } catch {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
