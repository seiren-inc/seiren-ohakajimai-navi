/**
 * 内部AI監査バッチ: 共有ロジックモジュール
 *
 * このモジュールは以下の2箇所から参照される:
 *   - scripts/run_ai_audit.ts  （ローカル手動実行 / audit:ai）
 *   - src/app/api/audit/route.ts （Vercel Cron による定期自動実行）
 *
 * 実行環境固有の処理（dotenv / fs / process.exit / NextResponse 等）は
 * 各ファイルに残す。ここには「何をチェックするか」だけを集約する。
 *
 * T6-02: 入力はDBデータに限定
 * T6-03: 出力は違反一覧と修正候補に限定
 */

import { z } from 'zod'

// ─── 型定義 ────────────────────────────────────────────────────────────────

export type AuditTarget = {
  jisCode: string
  name: string
  url: string | null
  pdfUrl: string | null
  linkStatus: string
  hasDomainWarning: boolean
}

export type AuditViolation = {
  jisCode: string
  municipalityName: string
  issueType: 'URL_MISMATCH' | 'LINK_STATUS_CONTRADICTION' | 'SUSPICIOUS_DOMAIN' | 'OTHER'
  description: string
  suggestedAction: string
}

// ─── Zod スキーマ ──────────────────────────────────────────────────────────

/**
 * AI への generateObject 呼び出しで使用するスキーマ。
 * スクリプト・API ルートの両方で同一スキーマを使うことで、
 * 出力フォーマットの乖離を防ぐ。
 */
export const AuditResultSchema = z.object({
  violations: z
    .array(
      z.object({
        jisCode: z.string(),
        municipalityName: z.string(),
        issueType: z.enum([
          'URL_MISMATCH',
          'LINK_STATUS_CONTRADICTION',
          'SUSPICIOUS_DOMAIN',
          'OTHER',
        ]),
        description: z
          .string()
          .describe('矛盾や異常の具体的な理由（事実のみ）'),
        suggestedAction: z
          .string()
          .describe(
            "T6-03: 修正候補（例: 'linkStatusをPDF_ONLYに変更する', 'pdfUrlとurlを入れ替える'）",
          ),
      }),
    )
    .describe('異常が検知された自治体のリスト。異常がない場合は空配列。'),
})

// ─── プロンプトビルダー ────────────────────────────────────────────────────

/**
 * AI 監査プロンプトを生成する。
 * targets は DB から取得したサンプルデータ（最大50件推奨）。
 *
 * T6-02: AI に渡す情報はDBデータに限定する。
 * T6-03: 出力フォーマットは AuditResultSchema に拘束する。
 */
export function buildAuditPrompt(targets: AuditTarget[]): string {
  return `
あなたはデータベースの監査AIです。
以下の自治体レコード（JSON）を確認し、論理的な矛盾や異常を検知してください。
新しい情報やURLを「生成」することは禁止です。与えられたデータ内の矛盾のみを指摘してください（T6-02, T6-03）。

【主なチェック観点】
1. url と pdfUrl に同じ値が入っていないか。
2. linkStatusが "OK" なのに、url が空でないか。
3. url がPDFファイルらしきもの (.pdf 等) を指しているのに、pdfUrl に入っていない（またはlinkStatusがPDF_ONLYでない）など、疑わしい状態はないか。
4. hasDomainWarning が true なのに linkStatus が "OK" になっているなどの矛盾。

【データ】
${JSON.stringify(targets, null, 2)}
`
}
