-- AlterTable: inquiries に municipality_id を追加
ALTER TABLE "inquiries" ADD COLUMN "municipality_id" TEXT;

-- AlterTable: administrative_scriveners に municipality_id を追加
ALTER TABLE "administrative_scriveners" ADD COLUMN "municipality_id" TEXT;

-- CreateIndex: inquiries_municipality_id_idx
CREATE INDEX "inquiries_municipality_id_idx" ON "inquiries"("municipality_id");

-- CreateIndex: administrative_scriveners_municipality_id_idx
CREATE INDEX "administrative_scriveners_municipality_id_idx" ON "administrative_scriveners"("municipality_id");

-- AddForeignKey: inquiries → municipalities
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: administrative_scriveners → municipalities
ALTER TABLE "administrative_scriveners" ADD CONSTRAINT "administrative_scriveners_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
