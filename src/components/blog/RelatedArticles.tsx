import Link from 'next/link'
import { getBlogSummaries } from '@/lib/blog'

interface RelatedArticlesProps {
  currentSlug: string
  tags: string[]
  maxItems?: number
}

/**
 * コラム記事の関連記事リンクコンポーネント
 * 同じタグを持つ記事を最大maxItems件表示する
 */
export function RelatedArticles({ currentSlug, tags, maxItems = 4 }: RelatedArticlesProps) {
  const allPosts = getBlogSummaries()

  // 同じタグを1つ以上持つ記事を関連記事として抽出（現在の記事は除外）
  const related = allPosts
    .filter((post) => {
      if (post.slug === currentSlug) return false
      return post.tags.some((tag) => tags.includes(tag))
    })
    .slice(0, maxItems)

  if (related.length === 0) return null

  return (
    <aside className="mt-16 border-t border-neutral-200 pt-12">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">関連コラム</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {related.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/column/${post.slug}`}
              className="group flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
            >
              <span className="inline-flex w-fit rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                {post.category}
              </span>
              <span className="text-sm font-semibold text-neutral-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
