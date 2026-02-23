-- CreateEnum
CREATE TYPE "LinkCheckStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "RecoveryCandidateStatus" AS ENUM ('PENDING', 'APPLIED', 'REJECTED');

-- CreateTable
CREATE TABLE "link_check_runs" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "status" "LinkCheckStatus" NOT NULL DEFAULT 'RUNNING',
    "total_checked" INTEGER NOT NULL DEFAULT 0,
    "broken_count" INTEGER NOT NULL DEFAULT 0,
    "fixed_count" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "link_check_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_candidates" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jis_code" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "prev_url" TEXT,
    "prev_pdf_url" TEXT,
    "new_url" TEXT,
    "new_pdf_url" TEXT,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL,
    "status" "RecoveryCandidateStatus" NOT NULL DEFAULT 'PENDING',
    "run_id" TEXT,

    CONSTRAINT "recovery_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recovery_candidates_jis_code_idx" ON "recovery_candidates"("jis_code");

-- CreateIndex
CREATE INDEX "recovery_candidates_status_idx" ON "recovery_candidates"("status");

-- CreateIndex
CREATE INDEX "recovery_candidates_run_id_idx" ON "recovery_candidates"("run_id");
