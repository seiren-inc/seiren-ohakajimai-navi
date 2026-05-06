
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const unknowns = await prisma.municipality.findMany({
    where: { linkStatus: 'UNKNOWN' },
    take: 10,
    select: { jisCode: true, prefectureName: true, name: true, url: true, pdfUrl: true }
  });
  console.log('=== UNKNOWN Samples ===');
  unknowns.forEach(u => console.log(`${u.prefectureName} ${u.name}: URL=${u.url}, PDF=${u.pdfUrl}`));

  const needsReview = await prisma.municipality.findMany({
    where: { linkStatus: 'NEEDS_REVIEW' },
    take: 10,
    select: { jisCode: true, prefectureName: true, name: true, url: true, pdfUrl: true }
  });
  console.log('\n=== NEEDS_REVIEW Samples ===');
  needsReview.forEach(u => console.log(`${u.prefectureName} ${u.name}: URL=${u.url}, PDF=${u.pdfUrl}`));
}
main().finally(() => prisma.$disconnect());
