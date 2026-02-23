/**
 * 運用通知用ユーティリティ
 * 
 * 閾値超過やシステムエラーなどの重要なイベントを運用者に通知します。
 * 現時点では Console 出力のみですが、環境変数の設定により Slack 等への拡張が可能です。
 */

export interface NotificationPayload {
    title: string;
    message: string;
    level: "INFO" | "WARNING" | "CRITICAL";
    metadata?: Record<string, any>;
    url?: string;
}

/**
 * 重要（CRITICAL）な通知を送信します。
 * CIの失敗や、大量のリンク切れ検知などで使用します。
 */
export async function notifyCritical(summary: string, detailsUrl?: string) {
    const payload: NotificationPayload = {
        title: "🚨 CRITICAL OPERATIONAL ALERT",
        message: summary,
        level: "CRITICAL",
        url: detailsUrl,
        metadata: {
            timestamp: new Date().toISOString(),
        }
    };

    await dispatchNotification(payload);
}

/**
 * 警告（WARNING）レベルの通知を送信します。
 */
export async function notifyWarning(summary: string) {
    const payload: NotificationPayload = {
        title: "⚠️ Operational Warning",
        message: summary,
        level: "WARNING",
        metadata: {
            timestamp: new Date().toISOString(),
        }
    };

    await dispatchNotification(payload);
}

/**
 * 通知の実際の配送処理
 */
async function dispatchNotification(payload: NotificationPayload) {
    // 1. Console 出力 (常に実行)
    const logPrefix = `[NOTIFY:${payload.level}]`;
    console.error(`${logPrefix} ${payload.title}: ${payload.message}`);
    if (payload.url) console.error(`${logPrefix} Details: ${payload.url}`);
    if (payload.metadata) console.error(`${logPrefix} Metadata:`, JSON.stringify(payload.metadata));

    // 2. Slack Webhook (環境変数 SLACK_WEBHOOK_URL があれば送信)
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `${payload.level === "CRITICAL" ? "🔴" : "🟡"} *${payload.title}*\n${payload.message}${payload.url ? `\n<${payload.url}|View Details>` : ""}`,
                }),
            });
        } catch (err) {
            console.error(`${logPrefix} Failed to send Slack notification:`, err);
        }
    }
}
