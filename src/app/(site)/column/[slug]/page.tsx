import { notFound } from 'next/navigation'
import { getBlogPost, getBlogSummaries } from '@/lib/blog'
import { constructMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { ArticleJsonLd } from '@/components/seo/page-json-ld'
import { FaqJsonLd } from '@/components/seo/faq-json-ld'
import { CANONICAL_AUTHOR } from '@/lib/authors'
import { RelatedArticles } from '@/components/blog/RelatedArticles'
import { ExpertBadge } from '@/components/seo/expert-badge'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Clock, Tag, ChevronRight, Info } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import type React from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

export async function generateStaticParams() {
  const posts = getBlogSummaries()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return constructMetadata({ title: '記事が見つかりません', path: `/column/${slug}` })

  return constructMetadata({
    title: `${post.metadata.title}｜お墓じまい・改葬に関するお役立ちコラム`,
    description: post.metadata.description,
    path: `/column/${slug}`,
    ogType: 'article',
    publishedTime: post.metadata.date,
    modifiedTime: post.metadata.updatedAt || post.metadata.date,
  })
}

// MDX Components for custom styling
const components = {
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <h2 className="mt-12 mb-6 text-2xl font-bold text-neutral-900 pb-2 border-b-2 border-emerald-100" {...props} />,
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => <h3 className="mt-8 mb-4 text-xl font-bold text-neutral-800 flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-5 before:bg-emerald-500 before:rounded-full" {...props} />,
  p: (props: React.ComponentPropsWithoutRef<'p'>) => <p className="mb-6 leading-relaxed text-neutral-700 text-[16px] md:text-[17px]" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => <ul className="mb-6 ml-6 list-disc [&>li]:mt-2 text-neutral-700" {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => <ol className="mb-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-700 font-medium" {...props} />,
  li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="leading-relaxed" {...props} />,
  a: (props: React.ComponentPropsWithoutRef<'a'>) => <a className="text-emerald-600 underline underline-offset-4 hover:text-emerald-700" {...props} />,
  strong: (props: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold text-neutral-900 bg-amber-50 px-1 rounded" {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-emerald-500 bg-emerald-50/50 p-4 my-6 rounded-r-lg text-neutral-700 italic" {...props} />
  ),
  InfoBox: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div className="my-8 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 overflow-hidden">
      {title && <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-3"><Info className="w-5 h-5" />{title}</h4>}
      <div className="text-neutral-700 text-sm leading-relaxed">{children}</div>
    </div>
  ),
  ExpertBadge: ({ name, qualification, officeName, comment, profileUrl }: {
    name: string
    qualification: string
    officeName?: string
    comment?: string
    profileUrl?: string
  }) => (
    <ExpertBadge
      name={name}
      qualification={qualification}
      officeName={officeName}
      comment={comment}
      profileUrl={profileUrl}
    />
  ),
  SeirenCTA: () => (
    <div className="not-prose my-8 rounded-xl border border-[var(--seiren-border)] bg-[var(--seiren-cta-soft)] p-6">
      <p className="mb-1 text-base font-bold text-[var(--seiren-main)]">
        お墓じまい・改葬のご相談は清蓮へ
      </p>
      <p className="mb-4 text-sm leading-relaxed text-[var(--seiren-body)]">
        墓石撤去・閉眼供養・遺骨の取り出し・粉骨・洗骨から次の納骨先選びまで、お墓じまい全体の流れを整理してご案内します。横浜を拠点に全国対応。まずは無料相談からどうぞ。
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 rounded-full bg-seiren-cta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-seiren-cta-hover"
      >
        清蓮にお墓じまいを無料相談する
        <ChevronRight className="h-4 w-4" />
      </Link>
      <p className="mt-3 text-xs text-[var(--seiren-sub)]">
        改葬許可申請の書類作成に不安がある方は、
        <Link href="/gyoseishoshi" className="underline hover:no-underline">行政書士に相談する</Link>
        こともできます。
      </p>
    </div>
  ),
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const { metadata, content } = post
  const pageUrl = `${SITE_URL}/column/${metadata.slug}`

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <BreadcrumbJsonLd
        items={[
          { name: 'ホーム', url: SITE_URL },
          { name: 'お役立ちコラム', url: `${SITE_URL}/column` },
          { name: metadata.title, url: pageUrl },
        ]}
      />
      <ArticleJsonLd
        headline={metadata.title}
        description={metadata.description}
        url={pageUrl}
        datePublished={metadata.date}
        dateModified={metadata.updatedAt || metadata.date}
        keywords={metadata.tags}
        author={metadata.author}
      />
      {metadata.faqs && metadata.faqs.length > 0 && (
        <FaqJsonLd faqs={metadata.faqs} />
      )}

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white px-6 py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[
              { name: 'お役立ちコラム', href: '/column' },
              { name: metadata.title, href: `/column/${metadata.slug}` }
            ]}
            className="mb-6"
          />

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-6">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 border border-emerald-100">
              {metadata.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <time dateTime={metadata.date}>
                公開日: {format(new Date(metadata.date), 'yyyy年MM月dd日')}
              </time>
              {metadata.updatedAt && (
                <time dateTime={metadata.updatedAt} className="ml-2 pl-2 border-l border-neutral-300">
                  更新日: {format(new Date(metadata.updatedAt), 'yyyy年MM月dd日')}
                </time>
              )}
            </div>
          </div>

          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-neutral-900 mb-6">
            {metadata.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-neutral-400" />
            {metadata.tags.map((tag) => (
              <span key={tag} className="text-sm text-neutral-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <article className="prose prose-neutral md:prose-lg max-w-none">
          <MDXRemote source={content} components={components} />
        </article>

        {/* Author block — 既定は CANONICAL_AUTHOR、frontmatter の author で上書き可（JSON-LD と同一ソース） */}
        <div className="mt-16 rounded-2xl bg-white p-8 border border-neutral-200 shadow-sm text-center">
          <h4 className="text-xl font-bold text-neutral-900 mb-4">この記事の執筆・監修</h4>
          <p className="font-semibold text-neutral-800 mb-2">
            {`${CANONICAL_AUTHOR.company} ${metadata.author?.jobTitle ?? CANONICAL_AUTHOR.jobTitle} ${metadata.author?.name ?? CANONICAL_AUTHOR.name}`}
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-6 max-w-lg mx-auto">
            {metadata.author?.bio ?? CANONICAL_AUTHOR.bio}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/price"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-seiren-cta px-6 py-3 font-semibold text-white transition-colors hover:bg-seiren-cta-hover"
            >
              料金プランを見る <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              無料相談してみる
            </Link>
          </div>
        </div>

        {/* 関連記事 */}
        <RelatedArticles currentSlug={metadata.slug} tags={metadata.tags} />
      </div>
    </div>
  )
}
