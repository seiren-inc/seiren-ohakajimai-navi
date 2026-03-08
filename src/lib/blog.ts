import fs from 'fs'
import path from 'path'

const blogDir = path.join(process.cwd(), 'src/content/blog')

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogMetadata {
  title: string
  description: string
  date: string
  category: string
  slug: string
  tags: string[]
  faqs?: BlogFaq[]
}

/**
 * gray-matter の代替: 正規表現でYAML frontmatterをパースする
 * gray-matterがpnpm-lock.yamlに存在しないためカスタム実装に置き換え
 */
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
  const match = content.match(fmRegex)
  if (!match) return { data: {}, content }

  const yamlStr = match[1]
  const body = match[2]
  const data: Record<string, unknown> = {}

  // 行単位でYAMLをパース（flat keyのみ対応）
  let i = 0
  const lines = yamlStr.split('\n')
  while (i < lines.length) {
    const line = lines[i]
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) { i++; continue }

    const key = line.slice(0, colonIdx).trim()
    const rest = line.slice(colonIdx + 1).trim()

    // 配列: - item 形式
    if (rest === '' && i + 1 < lines.length && lines[i + 1].trim().startsWith('-')) {
      const arr: unknown[] = []
      i++
      // オブジェクト配列（faqs）の簡易パース
      let currentObj: Record<string, string> | null = null
      while (i < lines.length && (lines[i].trim().startsWith('-') || (currentObj && lines[i].match(/^\s{2,}\w/)))) {
        const l = lines[i].trim()
        if (l.startsWith('-')) {
          if (currentObj) arr.push(currentObj)
          currentObj = null
          const inner = l.slice(1).trim()
          if (inner.includes(':')) {
            currentObj = {}
            const ci = inner.indexOf(':')
            currentObj[inner.slice(0, ci).trim()] = inner.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
          } else if (inner) {
            arr.push(inner.replace(/^["']|["']$/g, ''))
            currentObj = null
          }
        } else if (currentObj) {
          const ci = l.indexOf(':')
          if (ci !== -1) {
            currentObj[l.slice(0, ci).trim()] = l.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
          }
        }
        i++
      }
      if (currentObj) arr.push(currentObj)
      data[key] = arr
      continue
    }

    // スカラー値
    data[key] = rest
      .replace(/^["']|["']$/g, '') // クォート除去
      .replace(/\[(.+)\]/, (_, inner) =>
        inner ? inner.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, '')) : []
      ) as unknown

    // インラインYAML配列 ["a", "b"]
    if (rest.startsWith('[')) {
      const arrMatch = rest.match(/\[([^\]]*)\]/)
      if (arrMatch) {
        data[key] = arrMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean)
      }
    }
    i++
  }

  return { data, content: body }
}

export function getBlogSummaries(): BlogMetadata[] {
  if (!fs.existsSync(blogDir)) return []
  const files = fs.readdirSync(blogDir)
  const summaries = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(blogDir, file)
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data } = parseFrontmatter(raw)
      const slug = (data.slug as string) || file.replace(/\.mdx$/, '')
      return {
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        category: data.category as string,
        slug,
        tags: (data.tags as string[]) || [],
        faqs: data.faqs as BlogFaq[] | undefined,
      } satisfies BlogMetadata
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return summaries
}

export function getBlogPost(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = parseFrontmatter(raw)
  const meta: BlogMetadata = {
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: data.category as string,
    slug: (data.slug as string) || slug,
    tags: (data.tags as string[]) || [],
    faqs: data.faqs as BlogFaq[] | undefined,
  }
  return { metadata: meta, content }
}
