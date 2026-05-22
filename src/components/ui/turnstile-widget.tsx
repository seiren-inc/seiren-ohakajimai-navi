'use client'

import { useRef, useEffect } from "react"
import Script from "next/script"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

type Props = {
  onSuccess: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

/**
 * Cloudflare Turnstile ウィジェット（再利用可能コンポーネント）
 * CLAUDE.md Non-Negotiable: すべての公開フォームに必須
 *
 * 使用方法:
 * const [token, setToken] = useState('')
 * <TurnstileWidget onSuccess={setToken} onExpire={() => setToken('')} />
 * // submit 時に formData.append("cf-turnstile-response", token)
 */
export function TurnstileWidget({ onSuccess, onExpire, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const renderWidget = (): void => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: onSuccess,
      'expired-callback': () => { onExpire?.() },
      'error-callback': () => { onError?.() },
      theme: 'light',
      language: 'ja',
    })
  }

  useEffect(() => {
    if (window.turnstile) renderWidget()
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={renderWidget}
      />
      <div ref={containerRef} className="my-2" />
    </>
  )
}
