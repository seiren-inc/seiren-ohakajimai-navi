-- ============================================================
-- 20260216000000_create_scrivener_tables
-- Baseline: administrative_scriveners と関連テーブル・enum を追加
--
-- 【適用方法】
--   実 DB にはすでに適用済みのため、以下で登録すること:
--   npx prisma migrate resolve --applied 20260216000000_create_scrivener_tables
--
-- 【後続対応】
--   このファイル適用後、inquiries テーブルの nullable 差分
--   (last_name_kana, first_name_kana, postal_code, prefecture,
--    city, cemetery_type, consideration_period が init では NOT NULL、
--    schema では nullable) は別途 follow-up migration で解消する。
--   migrate status 実行後に drift を確認してから対応すること。
-- ============================================================

-- CreateEnum
CREATE TYPE "ScrivenerPlanType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('ACCOUNT_CREATED', 'PROFILE_INPUT', 'PAYMENT_COMPLETED', 'APPROVED_ACTIVE');

-- CreateEnum
CREATE TYPE "SimulationLogType" AS ENUM ('AI_ESTIMATION', 'PRICING_SIMULATION');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('OHaka', 'GYoseishoshi');

-- CreateTable: administrative_scriveners
-- NOTE: municipality_id は 20260417093027 で追加されるため含めない
CREATE TABLE "administrative_scriveners" (
    "id" TEXT NOT NULL,
    "office_name" TEXT NOT NULL,
    "representative_name" TEXT,
    "registration_number" TEXT,
    "prefecture" TEXT NOT NULL,
    "city" TEXT,
    "address_line" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website_url" TEXT,
    "price_range_text" TEXT,
    "specialties" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "profile_text" TEXT NOT NULL,
    "business_hours" TEXT,
    "plan_type" "ScrivenerPlanType" NOT NULL DEFAULT 'BASIC',
    "priority_score" INTEGER NOT NULL DEFAULT 0,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "complaint_flag" BOOLEAN NOT NULL DEFAULT false,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "contract_start_date" TIMESTAMP(3),
    "contract_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3),
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "admin_memo" TEXT,
    "auth_user_id" TEXT,
    "onboarding_step" "OnboardingStep" NOT NULL DEFAULT 'ACCOUNT_CREATED',

    CONSTRAINT "administrative_scriveners_pkey" PRIMARY KEY ("id")
);

-- CreateTable: simulation_logs
CREATE TABLE "simulation_logs" (
    "id" TEXT NOT NULL,
    "type" "SimulationLogType" NOT NULL,
    "input_params" JSONB NOT NULL,
    "result_amount" INTEGER NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: scrivener_audit_logs
CREATE TABLE "scrivener_audit_logs" (
    "id" TEXT NOT NULL,
    "scrivener_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "before_value" JSONB,
    "after_value" JSONB,
    "admin_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scrivener_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex: administrative_scriveners
CREATE UNIQUE INDEX "administrative_scriveners_stripe_subscription_id_key"
    ON "administrative_scriveners"("stripe_subscription_id");

CREATE UNIQUE INDEX "administrative_scriveners_auth_user_id_key"
    ON "administrative_scriveners"("auth_user_id");

-- CreateIndex: administrative_scriveners (通常インデックス)
CREATE INDEX "administrative_scriveners_prefecture_is_approved_is_active_idx"
    ON "administrative_scriveners"("prefecture", "is_approved", "is_active");

CREATE INDEX "administrative_scriveners_plan_type_priority_score_idx"
    ON "administrative_scriveners"("plan_type", "priority_score");

-- CreateIndex: 20260414001557 が DROP する元インデックス 2 本
-- 20260414 は DROP INDEX IF EXISTS で書かれているため存在しなくても通るが、
-- 実 DB の歴史を忠実に再現するために作成する
CREATE INDEX "administrative_scriveners_is_approved_is_active_idx"
    ON "administrative_scriveners"("is_approved", "is_active");

CREATE INDEX "administrative_scriveners_payment_status_idx"
    ON "administrative_scriveners"("payment_status");

-- CreateIndex: simulation_logs
CREATE INDEX "simulation_logs_type_created_at_idx"
    ON "simulation_logs"("type", "created_at");

-- CreateIndex: scrivener_audit_logs
CREATE INDEX "scrivener_audit_logs_scrivener_id_idx"
    ON "scrivener_audit_logs"("scrivener_id");

CREATE INDEX "scrivener_audit_logs_created_at_idx"
    ON "scrivener_audit_logs"("created_at");

-- AddForeignKey: scrivener_audit_logs → administrative_scriveners
ALTER TABLE "scrivener_audit_logs"
    ADD CONSTRAINT "scrivener_audit_logs_scrivener_id_fkey"
    FOREIGN KEY ("scrivener_id")
    REFERENCES "administrative_scriveners"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: inquiries に scrivener 関連カラムを追加
-- inquiry_type: InquiryType enum, NOT NULL with default
-- preferred_contact: nullable TEXT
-- scrivener_id: nullable FK
ALTER TABLE "inquiries"
    ADD COLUMN "inquiry_type" "InquiryType" NOT NULL DEFAULT 'OHaka',
    ADD COLUMN "preferred_contact" TEXT,
    ADD COLUMN "scrivener_id" TEXT;

-- CreateIndex: inquiries (追加カラム分)
CREATE INDEX "inquiries_inquiry_type_status_created_at_idx"
    ON "inquiries"("inquiry_type", "status", "created_at");

CREATE INDEX "inquiries_scrivener_id_idx"
    ON "inquiries"("scrivener_id");

-- AddForeignKey: inquiries → administrative_scriveners
ALTER TABLE "inquiries"
    ADD CONSTRAINT "inquiries_scrivener_id_fkey"
    FOREIGN KEY ("scrivener_id")
    REFERENCES "administrative_scriveners"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex: municipalities_link_status_idx
-- schema の @@index([linkStatus]) が init migration に含まれていないため追加
CREATE INDEX "municipalities_link_status_idx"
    ON "municipalities"("link_status");
