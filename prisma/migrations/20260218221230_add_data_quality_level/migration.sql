-- AlterTable
ALTER TABLE "municipalities" ADD COLUMN     "data_quality_level" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "municipalities_archive" ADD COLUMN     "data_quality_level" INTEGER NOT NULL DEFAULT 0;
