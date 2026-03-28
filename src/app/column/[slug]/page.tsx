import { notFound } from 'next/navigation'
import { getBlogPost, getBlogSummaries } from '@/lib/blog'
import { constructMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { ArticleJsonLd } from '@/components/seo/page-json-ld'
import { AuthorJsonLd } from '@/components/seo/author-json-ld'
import { FaqJsonLd } from '@/components/seo/faq-json-ld'
import { RelatedArticles } from '@/components/blog/RelatedArticles'
import { ExpertBadge } from '@/components/seo/expert-badge'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Clock, Tag, ChevronRight, Info } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

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
  })
}

type Heading2Props = ComponentPropsWithoutRef<'h2'>
type Heading3Props = ComponentPropsWithoutRef<'h3'>
type ParagraphProps = ComponentPropsWithoutRef<'p'>
type UnorderedListProps = ComponentPropsWithoutRef<'ul'>
type OrderedListProps = ComponentPropsWithoutRef<'ol'>
type ListItemProps = ComponentPropsWithoutRef<'li'>
type AnchorProps = ComponentPropsWithoutRef<'a'>
type StrongProps = ComponentPropsWithoutRef<'strong'>
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>

// MDX Components for custom styling
const components = {
  h2: (props: Heading2Props) => <h2 className="mt-12 mb-6 text-2xl font-bold text-neutral-900 pb-2 border-b-2 border-emerald-100" {...props} />,
  h3: (props: Heading3Props) => <h3 className="mt-8 mb-4 text-xl font-bold text-neutral-800 flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-5 before:bg-emerald-500 before:rounded-full" {...props} />,
  p: (props: ParagraphProps) => <p className="mb-6 leading-relaxed text-neutral-700 text-[16px] md:text-[17px]" {...props} />,
  ul: (props: UnorderedListProps) => <ul className="mb-6 ml-6 list-disc [&>li]:mt-2 text-neutral-700" {...props} />,
  ol: (props: OrderedListProps) => <ol className="mb-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-700 font-medium" {...props} />,
  li: (props: ListItemProps) => <li className="leading-relaxed" {...props} />,
  a: (props: AnchorProps) => <a className="text-emerald-600 underline underline-offset-4 hover:text-emerald-700" {...props} />,
  strong: (props: StrongProps) => <strong className="font-bold text-neutral-900 bg-amber-50 px-1 rounded" {...props} />,
  blockquote: (props: BlockquoteProps) => (
    <blockquote className="border-l-4 border-emerald-500 bg-emerald-50/50 p-4 my-6 rounded-r-lg text-neutral-700 italic" {...props} />
  ),
  InfoBox: ({ children, title }: { children: ReactNode; title?: string }) => (
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
        keywords={metadata.tags}
      />
      <AuthorJsonLd
        pageUrl={pageUrl}
        headline={metadata.title}
        description={metadata.description}
        datePublished={metadata.date}
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
      <main className="mx-auto max-w-3xl px-6 py-12">
        <article className="prose prose-neutral md:prose-lg max-w-none">
          <MDXRemote source={content} components={components} />
        </article>

        {/* Author block */}
        <div className="mt-16 rounded-2xl bg-white p-8 border border-neutral-200 shadow-sm text-center">
          <h4 className="text-xl font-bold text-neutral-900 mb-4">この記事の執筆・監修</h4>
          <p className="font-semibold text-neutral-800 mb-2">株式会社清蓮 代表取締役 眞如理恵</p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-6 max-w-lg mx-auto">
            2008年の設立以来、お墓じまい・改葬の専門会社として全国のご家族をサポート。法令遵守と誠実な対応を理念に、書類手続きの案内から墓石撤去、海洋散骨までワンストップで支援しています。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/price"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
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
      </main>
    </div>
  )
}
