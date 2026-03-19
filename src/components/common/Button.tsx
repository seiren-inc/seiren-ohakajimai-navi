/**
 * Button.tsx — 世界基準 共通ボタンコンポーネント（グループA：清蓮系）
 * 配置先: src/components/common/Button.tsx
 *
 * 使用方法:
 * <Button variant="primary">お問い合わせ</Button>
 * <Button variant="ghost" size="sm">詳しく見る</Button>
 */
"use client"

import { motion, useReducedMotion } from "framer-motion"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline"
type ButtonSize    = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?:    ButtonSize
  loading?: boolean
  icon?:    React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#3399CC] text-white hover:bg-[#2a7fb0] shadow-md hover:shadow-lg border-transparent",
  secondary:
    "bg-[#D98CB3] text-white hover:bg-[#c47a9f] shadow-md hover:shadow-lg border-transparent",
  ghost:
    "bg-transparent text-[#3399CC] hover:bg-[#3399CC]/10 border-transparent",
  outline:
    "bg-transparent text-[#3399CC] border-[#3399CC] hover:bg-[#3399CC] hover:text-white",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[36px]",
  md: "px-6 py-3 text-base min-h-[44px]",
  lg: "px-8 py-4 text-lg min-h-[52px]",
}

/**
 * 清蓮グループ共通ボタン
 * - useReducedMotion でOS設定を尊重
 * - タッチターゲット最小 44px
 * - ローディング状態対応
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = "primary",
      size     = "md",
      loading  = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const prefersReduced = useReducedMotion()

    return (
      <motion.button
        ref={ref}
        whileHover={prefersReduced ? {} : { scale: 1.02, y: -1 }}
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        transition={
          prefersReduced
            ? {}
            : { type: "spring", stiffness: 400, damping: 25 }
        }
        disabled={disabled || loading}
        className={cn(
          // ベーススタイル
          "relative inline-flex items-center justify-center gap-2",
          "rounded-2xl border font-medium",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399CC] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-pointer select-none",
          // バリアント・サイズ
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {/* ローディングスピナー */}
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {/* アイコン */}
        {!loading && icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </motion.button>
    )
  },
)
Button.displayName = "Button"
