-- DropIndex (単独インデックスを複合インデックスに統合)
DROP INDEX IF EXISTS "administrative_scriveners_is_approved_is_active_idx";
DROP INDEX IF EXISTS "administrative_scriveners_payment_status_idx";

-- CreateIndex (isApproved + isActive + paymentStatus 複合インデックス)
CREATE INDEX IF NOT EXISTS "administrative_scriveners_is_approved_is_active_payment_sta_idx" ON "administrative_scriveners"("is_approved", "is_active", "payment_status");
