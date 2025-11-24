
import { prisma } from '../src/lib/prisma';
import { canUserAccessLine } from '../src/lib/permissions';

async function main() {
    console.log('--- Users ---');
    const users = await prisma.user.findMany({ include: { assignedLines: true } });
    users.forEach(u => {
        console.log(`ID: ${u.id}, Username: ${u.username}, Role: ${u.role}, Assigned Lines: ${u.assignedLines.map(al => al.lineId).join(', ')}`);
    });

    console.log('\n--- Lines ---');
    const lines = await prisma.line.findMany();
    lines.forEach(l => {
        console.log(`ID: ${l.id}, Name: ${l.name}`);
    });

    console.log('\n--- Permission Check ---');
    // Test for the first non-admin user and first line
    const regularUser = users.find(u => u.role !== 'ADMIN');
    if (regularUser) {
        // Try to find a line assigned to the user
        const assignedLine = regularUser.assignedLines[0];
        const lineId = assignedLine ? assignedLine.lineId : lines[0]?.id;

        if (lineId) {
            console.log(`Checking access for User ${regularUser.username} (ID: ${regularUser.id}) to Line ID: ${lineId}`);
            const hasAccess = await canUserAccessLine(regularUser.id, lineId, regularUser.role);
            console.log(`Result: ${hasAccess}`);

            // Double check via raw query
            const assignment = await prisma.userLine.findFirst({
                where: {
                    userId: regularUser.id,
                    lineId: lineId
                }
            });
            console.log(`Direct UserLine check: ${assignment ? 'Found' : 'Not Found'}`);

            // Check products for this line
            console.log(`\n--- Products for Line ${lineId} ---`);
            const products = await prisma.product.findMany({
                where: { lineId: lineId }
            });
            console.log(`Found ${products.length} products.`);
            products.forEach(p => {
                console.log(`Product ID: ${p.id}, Name: ${p.name}, LineID: ${p.lineId}`);
            });
        }
    } else {
        console.log('No regular user found to test.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
