import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.globalSettings.findFirst();
    if (settings) {
        await prisma.globalSettings.update({
            where: { id: settings.id },
            data: { headerImageUrl: '/schneider_f400_diagram.png' },
        });
        console.log('Updated header image URL');
    } else {
        await prisma.globalSettings.create({
            data: { headerImageUrl: '/schneider_f400_diagram.png' },
        });
        console.log('Created header image URL');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
