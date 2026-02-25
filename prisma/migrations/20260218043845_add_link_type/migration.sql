/*
  Warnings:

  - A unique constraint covering the columns `[prefecture_code,municipality_slug]` on the table `municipalities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('GUIDE', 'PDF', 'E_APPLY', 'REGULATION', 'OTHER');

-- AlterTable
ALTER TABLE "municipalities" ADD COLUMN     "has_domain_warning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link_type" "LinkType" NOT NULL DEFAULT 'GUIDE',
ADD COLUMN     "sub_links" JSONB;

-- CreateTable
CREATE TABLE "municipalities_archive" (
    "id" TEXT NOT NULL,
    "jis_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefecture_code" TEXT NOT NULL,
    "prefecture_name" TEXT NOT NULL,
    "prefecture_slug" TEXT NOT NULL,
    "municipality_slug" TEXT NOT NULL,
    "region" TEXT,
    "url" TEXT,
    "pdf_url" TEXT,
    "is_published" BOOLEAN NOT NULL,
    "link_status" "LinkStatus" NOT NULL,
    "last_checked_at" TIMESTAMP(3),
    "notes" TEXT,
    "seo_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "has_domain_warning" BOOLEAN NOT NULL,
    "link_type" "LinkType" NOT NULL,
    "sub_links" JSONB,
    "archived_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "municipalities_archive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_logs" (
    "id" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "file_type" TEXT,
    "total_count" INTEGER NOT NULL,
    "success_count" INTEGER NOT NULL,
    "failed_count" INTEGER NOT NULL,
    "error_log" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_prefecture_code_municipality_slug_key" ON "municipalities"("prefecture_code", "municipality_slug");

-- AddForeignKey
ALTER TABLE "import_logs" ADD CONSTRAINT "import_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
