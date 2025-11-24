import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

/**
 * Check if user is an admin
 */
export function isAdmin(session: Session | null): boolean {
    return session?.user?.role === 'ADMIN';
}

/**
 * Check if user can edit a specific line
 * Admins can edit all lines, regular users only their assigned lines.
 */
export async function canUserAccessLine(
    userId: number,
    lineId: number,
    userRole: string
): Promise<boolean> {
    // Admins can edit all lines
    if (userRole === 'ADMIN') {
        return true;
    }
    // Regular users can edit only assigned lines via relation filter
    const line = await prisma.line.findFirst({
        where: {
            id: lineId,
            assignedUsers: {
                some: { userId }
            }
        }
    });
    return line !== null;
}

/**
 * Get all lines accessible (viewable) by a user
 * All users can view all lines; admins also can edit all.
 */
export async function getUserLines() {
    // Return all lines for any user
    return await prisma.line.findMany({
        orderBy: { id: 'asc' },
    });
}

/**
 * Get all lines with assignment status for a specific user
 */
export async function getUserLinesWithAssignment(userId: number) {
    const lines = await prisma.line.findMany({
        orderBy: { id: 'asc' },
        include: {
            assignedUsers: {
                where: { userId },
                select: { userId: true }
            }
        }
    });

    return lines.map(line => ({
        ...line,
        isAssigned: line.assignedUsers.length > 0
    }));
}

/**
 * Get line IDs accessible by a user (viewable)
 */
export async function getUserLineIds(): Promise<number[]> {
    const lines = await getUserLines();
    return lines.map(line => line.id);
}
