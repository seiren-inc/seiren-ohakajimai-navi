"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function RagChatbot() {
  // ページ読み込みから 3 秒後にチャットウィジェットを DOM にマウント
  // フックは条件分岐の前にすべて宣言（React Hooks ルール遵守）
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() =>
    typeof window !== "undefined" ? Math.random().toString(36).substring(7) : "anonymous"
  )
  const bottomRef = useRef<HTMLDivElement>(null)

  // 3 秒遅延マウント：FCP / LCP に影響しない（メインスレッドをブロックしない）
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const suggestions = [
    "東京都の改葬の手続きは？",
    "お墓じまいの料金はいくらですか？",
    "行政書士に依頼できますか？",
  ]

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, sessionId }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      // ストリーミングレスポンスを読み込む
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""
      const assistantId = (Date.now() + 1).toString()

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          // Vercel AI SDK のストリーム形式をパース
          const lines = chunk.split("\n")
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const jsonStr = line.slice(2)
                const parsed = JSON.parse(jsonStr)
                assistantContent += parsed
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                )
              } catch {
                // パースエラーは無視
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "申し訳ありません、エラーが発生しました。しばらくしてから再度お試しください。",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!mounted) return null

  return (
    <>
      <div
        className="fixed z-50"
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
        }}
      >
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        ) : (
          <div className="flex flex-col w-[350px] sm:w-[400px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2 font-semibold">
                <Bot className="h-5 w-5" />
                お墓じまい ナビ AI案内
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
                  <Bot className="h-12 w-12 text-slate-300" />
                  <div className="text-sm">
                    <p>こんにちは！お墓じまいについて</p>
                    <p>知りたいことを教えてください。</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {suggestions.map((text, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(text)}
                        className="text-xs bg-white border border-primary/20 text-primary px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("flex gap-2 max-w-[85%]", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn("flex items-center justify-center h-8 w-8 rounded-full shrink-0",
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-blue-100 text-blue-600"
                    )}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={cn("p-3 rounded-2xl text-sm whitespace-pre-wrap break-words",
                      m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-white border text-slate-700 rounded-tl-sm shadow-sm"
                    )}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-3 bg-white border rounded-2xl rounded-tl-sm flex gap-1 items-center h-10 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce delay-75" />
                      <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white border-t">
              <form onSubmit={handleSubmit} className="flex flex-row gap-2 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="質問を入力..."
                  disabled={isLoading}
                  className="pr-10 bg-slate-50 focus-visible:ring-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 top-1 h-8 w-8 bg-transparent text-primary hover:bg-primary/10 shadow-none"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="text-center mt-2">
                <span className="text-xs text-muted-foreground">AIは事実と異なる回答をすることがあります。</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
