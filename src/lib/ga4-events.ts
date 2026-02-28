/**
 * GA4 イベントトラッキングユーティリティ
 * Doc-12 §4: 行政書士マッチング関連イベント
 */

// GA4 gtag型定義
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
    }
}

/**
 * GA4カスタムイベント送信
 */
function sendGa4Event(eventName: string, params?: Record<string, string | number | boolean>) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, params)
    }
}

/**
 * 行政書士カードクリック
 */
export function trackScrivenerCardClick(scrivenerId: string, officeName: string, planType: string) {
    sendGa4Event("scrivener_card_click", {
        scrivener_id: scrivenerId,
        office_name: officeName,
        plan_type: planType,
    })
}

/**
 * 行政書士詳細ページ閲覧
 */
export function trackScrivenerDetailView(scrivenerId: string, officeName: string, prefecture: string) {
    sendGa4Event("scrivener_detail_view", {
        scrivener_id: scrivenerId,
        office_name: officeName,
        prefecture,
    })
}

/**
 * 問い合わせフォーム送信
 */
export function trackInquirySubmit(formType: "gyoseishoshi" | "general") {
    sendGa4Event("inquiry_submit", {
        form_type: formType,
    })
}

/**
 * 相談ボタンクリック
 */
export function trackConsultButtonClick(scrivenerId: string, source: "card" | "detail") {
    sendGa4Event("consult_button_click", {
        scrivener_id: scrivenerId,
        source,
    })
}

/**
 * CTA クリック（ヒーロー/フッター）
 */
export function trackCtaClick(ctaType: "hero_form" | "hero_phone" | "footer_form") {
    sendGa4Event("cta_click", {
        cta_type: ctaType,
    })
}
