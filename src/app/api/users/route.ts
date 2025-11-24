import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, role: true, createdAt: true }
        });
        return NextResponse.json(users);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });

        return NextResponse.json({ id: user.id, username: user.username });
    } catch {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { id, password, role } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Fetch the target user to check their username
        const targetUser = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // SUPER USER PROTECTION: "Ahmet Mersin" cannot have their role changed by anyone
        if (targetUser.username.toLowerCase() === 'ahmet mersin' && role !== undefined) {
            return NextResponse.json({
                error: 'Cannot modify Super User role'
            }, { status: 403 });
        }

        // Build update data
        const updateData: { password?: string; role?: string } = {};

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (role !== undefined) {
            // Validate role
            if (role !== 'ADMIN' && role !== 'USER') {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            updateData.role = role;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

