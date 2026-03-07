"use client"

import { useChat } from "@ai-sdk/react"

import { useState } from "react"
import { Bot, Send, User, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function RagChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  
  // クライアントサイドでのみ一意のIDを生成し、サーバー側のHydration不一致を防ぐ
  const [sessionId] = useState(() => 
    typeof window !== 'undefined' ? Math.random().toString(36).substring(7) : "anonymous"
  )

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { sessionId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error(err)
      alert("チャットの接続でエラーが発生しました。")
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as any // Vercel AI SDK 3.x の一部環境での型不整合をバイパス

  // サジェストの質問
  const suggestions = [
    "東京都の改葬の手続きは？",
    "お墓じまいの料金はいくらですか？",
    "行政書士に依頼できますか？"
  ]

  const handleSuggestion = (text: string) => {
    const fakeEvent = {
        preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>
    
    // inputにテキストを入れて送信
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => handleSubmit(fakeEvent), 50)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
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
                        onClick={() => handleSuggestion(text)}
                        className="text-xs bg-white border border-primary/20 text-primary px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {messages.map((m: any) => (
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
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {m.toolInvocations?.map((tool: any, index: number) => {
                        if (tool.state === 'call') return <div key={index} className="text-xs text-muted-foreground flex items-center gap-1 animate-pulse">データベースを検索中...</div>
                        return null
                      })}
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
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
            </div>

            <div className="p-3 bg-white border-t">
              <form onSubmit={handleSubmit} className="flex flex-row gap-2 relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
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
                <span className="text-[10px] text-muted-foreground">AIは事実と異なる回答をすることがあります。</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
