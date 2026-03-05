'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Inquiry } from '@prisma/client'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { BellRing, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
    initialInquiries: Inquiry[]
    scrivenerId: string
}

export function ScrivenerRealtimeInquiries({ initialInquiries, scrivenerId }: Props) {
    const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)

    // Supabase client instance
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        // Realtime Subscription
        const channel = supabase.channel(`scrivener_inquiries_${scrivenerId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'inquiries',
                    filter: `scrivener_id=eq.${scrivenerId}`
                },
                (payload) => {
                    const newInquiry = payload.new as Inquiry
                    // Add new inquiry to the top of the list
                    setInquiries((prev) => [newInquiry, ...prev])
                    
                    // Show realtime notification
                    toast.success('新しい見積り依頼が届きました！', {
                        description: `${newInquiry.lastName} ${newInquiry.firstName} 様 (${newInquiry.email || 'メールなし'})`,
                        icon: <BellRing className="w-5 h-5 text-indigo-500" />
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [scrivenerId, supabase])

    return (
        <Card className="border-indigo-100 shadow-sm">
            <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center text-xl text-slate-800">
                            <Mail className="mr-2 h-5 w-5 text-indigo-500" />
                            最近の問い合わせ（リード）
                        </CardTitle>
                        <CardDescription>
                            見積り依頼や相談がリアルタイムに表示されます
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 pointer-events-none">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        リアルタイム受信中
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {inquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        まだ問い合わせはありません。
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                        {inquiries.map((inq) => (
                            <div key={inq.id} className="p-6 transition-colors hover:bg-slate-50/50">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-slate-900">{inq.lastName} {inq.firstName} 様</div>
                                        <div className="text-sm text-slate-600">
                                            {inq.email && <span className="mr-3">📧 {inq.email}</span>}
                                            {inq.phone && <span>📞 {inq.phone}</span>}
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {format(new Date(inq.createdAt), 'yyyy/MM/dd HH:mm')}
                                    </div>
                                </div>
                                {inq.content && (
                                    <div className="mt-4 rounded-md bg-slate-100/50 p-3 text-sm text-slate-700">
                                        {inq.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
