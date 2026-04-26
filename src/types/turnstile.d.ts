interface TurnstileOptions {
    sitekey: string
    callback?: (token: string) => void
    'expired-callback'?: () => void
    'error-callback'?: () => void
    theme?: 'light' | 'dark' | 'auto'
    size?: 'normal' | 'compact'
    language?: string
}

interface Turnstile {
    render: (container: HTMLElement | string, options: TurnstileOptions) => string
    reset: (widgetId?: string) => void
    remove: (widgetId?: string) => void
    getResponse: (widgetId?: string) => string | undefined
}

declare global {
    interface Window {
        turnstile?: Turnstile
        onTurnstileLoad?: () => void
    }
}

export {}
