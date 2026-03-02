/**
 * GA4 (Google Analytics 4) トラッキングユーティリティ
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// 型定義
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: ControlParams | EventParams | CustomParams
    ) => void;
    dataLayer: Record<string, any>[];
  }
}

interface ControlParams {
  groups?: string | string[];
  send_to?: string | string[];
  event_callback?: () => void;
  event_timeout?: number;
}

interface EventParams {
  checkout_option?: string;
  checkout_step?: number;
  content_id?: string;
  content_type?: string;
  coupon?: string;
  currency?: string;
  description?: string;
  fatal?: boolean;
  items?: any[];
  method?: string;
  number?: string;
  promotions?: any[];
  screen_name?: string;
  search_term?: string;
  shipping?: number;
  tax?: number;
  transaction_id?: string;
  value?: number;
  event_label?: string;
  event_category?: string;
}

interface CustomParams {
  [key: string]: any;
}

/**
 * ページビューの記録
 */
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/**
 * イベントの記録
 */
export const event = (
  action: string,
  { event_category, event_label, value, ...rest }: EventParams & CustomParams = {}
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
    ...rest,
  });
};

/**
 * フォーム送信イベント（リード獲得）
 */
export const trackFormSubmit = (formName: string) => {
  event('generate_lead', {
    event_category: 'engagement',
    event_label: formName,
  });
};

/**
 * 診断完了イベント
 */
export const trackDiagnosisComplete = (result: string) => {
  event('diagnosis_complete', {
    event_category: 'tool',
    event_label: result,
  });
};

/**
 * 見積りシミュレーション実行イベント
 */
export const trackSimulation = (totalAmount: number) => {
  event('calculate_estimation', {
    event_category: 'tool',
    value: totalAmount,
  });
};
