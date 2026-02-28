import { createScrivener } from "@/actions/admin/scrivener-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PREFECTURES } from "@/lib/prefectures"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewScrivenerPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/gyoseishoshi">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        一覧に戻る
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">行政書士 新規登録</h2>
            </div>

            <form action={createScrivener} className="max-w-2xl space-y-6 rounded-lg border bg-white p-6">
                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">基本情報</h3>
                    <div>
                        <label className="text-sm font-medium">事務所名 <span className="text-red-500">*</span></label>
                        <Input name="officeName" required className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">代表者名</label>
                        <Input name="representativeName" className="mt-1" />
                    </div>
                    {/* Doc-11 §4, Doc-16 §3: 登録番号 */}
                    <div>
                        <label className="text-sm font-medium">登録番号</label>
                        <Input name="registrationNumber" placeholder="例: 第12345号" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">都道府県 <span className="text-red-500">*</span></label>
                            <Select name="prefecture" required>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREFECTURES.map((p) => (
                                        <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">市区町村</label>
                            <Input name="city" className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">住所</label>
                        <Input name="addressLine" className="mt-1" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">連絡先</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">電話番号</label>
                            <Input name="phone" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">メール</label>
                            <Input name="email" type="email" className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">ウェブサイトURL</label>
                        <Input name="websiteUrl" type="url" className="mt-1" />
                    </div>
                    {/* Doc-16 §3: 営業時間 */}
                    <div>
                        <label className="text-sm font-medium">営業時間</label>
                        <Input name="businessHours" placeholder="例: 平日 9:00〜18:00" className="mt-1" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">掲載情報</h3>
                    <div>
                        <label className="text-sm font-medium">プロフィール <span className="text-red-500">*</span></label>
                        <Textarea name="profileText" required className="mt-1 min-h-[100px]" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">得意分野（カンマ区切り）</label>
                        <Input name="specialties" placeholder="改葬許可申請,相続関連,外国人関連" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">料金目安</label>
                        <Input name="priceRangeText" placeholder="5万円〜10万円" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">プラン</label>
                            <Select name="planType" defaultValue="BASIC">
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BASIC">ベーシック</SelectItem>
                                    <SelectItem value="STANDARD">スタンダード</SelectItem>
                                    <SelectItem value="PREMIUM">プレミアム</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">優先スコア</label>
                            <Input name="priorityScore" type="number" defaultValue="0" className="mt-1" />
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full">登録する</Button>
            </form>
        </div>
    )
}
