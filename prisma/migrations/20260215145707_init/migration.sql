-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('OK', 'NEEDS_REVIEW', 'BROKEN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CemeteryType" AS ENUM ('TEMPLE', 'PUBLIC', 'PRIVATE', 'COMMUNITY', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ConsiderationPeriod" AS ENUM ('IMMEDIATE', 'WITHIN_HALF_YEAR', 'WITHIN_YEAR', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "DestinationType" AS ENUM ('NEW_GRAVE', 'NOUKOTSUDO', 'TREE_BURIAL', 'SCATTERING', 'HOME', 'OTHER');

-- CreateEnum
CREATE TYPE "BoneServiceType" AS ENUM ('POWDER', 'WASH', 'BOTH', 'NONE');

-- CreateEnum
CREATE TYPE "ContainerType" AS ENUM ('SEALED_BAG', 'URN', 'ORIGINAL_BOX', 'BONE_BAG', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('OK', 'REDIRECT', 'CLIENT_ERROR', 'SERVER_ERROR', 'TIMEOUT', 'DNS_ERROR', 'UNKNOWN_ERROR');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "supabase_user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalities" (
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
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "link_status" "LinkStatus" NOT NULL DEFAULT 'UNKNOWN',
    "last_checked_at" TIMESTAMP(3),
    "notes" TEXT,
    "seo_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name_kana" TEXT NOT NULL,
    "first_name_kana" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address_detail" TEXT,
    "cemetery_type" "CemeteryType" NOT NULL,
    "consideration_period" "ConsiderationPeriod" NOT NULL,
    "content" TEXT NOT NULL,
    "destination_type" "DestinationType",
    "bone_service_type" "BoneServiceType",
    "container_type" "ContainerType",
    "ritan_consultation" BOOLEAN,
    "memo" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "municipality_id" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "http_status" INTEGER,
    "result" "AuditResult" NOT NULL,
    "error_message" TEXT,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_supabase_user_id_key" ON "admin_users"("supabase_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_jis_code_key" ON "municipalities"("jis_code");

-- CreateIndex
CREATE INDEX "municipalities_prefecture_code_idx" ON "municipalities"("prefecture_code");

-- CreateIndex
CREATE INDEX "municipalities_prefecture_slug_municipality_slug_idx" ON "municipalities"("prefecture_slug", "municipality_slug");

-- CreateIndex
CREATE INDEX "audit_logs_municipality_id_idx" ON "audit_logs"("municipality_id");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
