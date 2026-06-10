import Link from 'next/link'
import { constructMetadata } from '@/lib/seo'
import { getBlogSummaries } from '@/lib/blog'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { Clock, Tag } from 'lucide-react'
import { format } from 'date-fns'

export const metadata = constructMetadata({
  title: 'お墓じまい・改葬に関するお役立ちコラム',
  description: 'お墓じまいの費用相場や手続きの流れ、改葬許可証の取り方など、お墓じまいにまつわる専門情報を分かりやすく解説するコラム一覧です。',
  path: '/column',
})

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

export default function ColumnIndexPage() {
  const posts = getBlogSummaries()

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <BreadcrumbJsonLd
        items={[
          { name: 'ホーム', url: SITE_URL },
          { name: 'お役立ちコラム', url: `${SITE_URL}/column` },
        ]}
      />

      {/* Hero */}
      <div className="border-b border-neutral-100 bg-white px-6 py-12 md:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={[{ name: 'お役立ちコラム', href: '/column' }]} className="mb-6 justify-center" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">Column</p>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl text-balance">
            お墓じまい・改葬に関する<br className="md:hidden" />お役立ちコラム
          </h1>
          <p className="mx-auto mt-6 max-w-[44ch] text-[16px] leading-relaxed text-neutral-600">
            お墓じまいの費用相場や改葬の手続き方法など、よくある疑問に専門家が詳しくお答えします。
          </p>
        </div>
      </div>

      {/* List */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-12">
        <div className="grid gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/column/${post.slug}`} className="group block">
              <article className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-4">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-700">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <time dateTime={post.date}>{format(new Date(post.date), 'yyyy.MM.dd')}</time>
                  </div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-neutral-400" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-neutral-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 text-neutral-500">
              記事がまだありません。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
