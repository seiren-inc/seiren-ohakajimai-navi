
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.municipality.count();
    const published = await prisma.municipality.count({ where: { isPublished: true } });
    const byStatus = await prisma.municipality.groupBy({
        by: ['linkStatus'],
        _count: true
    });
    const hasSubLinks = await prisma.municipality.count({
        where: { subLinks: { not: null } }
    });

    console.log('=== DB Verification Summary ===');
    console.log(`- Total Records: ${count}`);
    console.log(`- isPublished=true: ${published}`);
    console.log(`- Records with subLinks: ${hasSubLinks}`);
    console.log('- Status Distribution:');
    byStatus.forEach(s => {
        console.log(`  - ${s.linkStatus}: ${s._count}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
