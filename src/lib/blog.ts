import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

export function getBlogSummaries(): BlogMetadata[] {
  if (!fs.existsSync(blogDir)) return []
  const files = fs.readdirSync(blogDir)
  const summaries = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(blogDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(content)
      return {
        ...data,
        slug: file.replace(/\.mdx$/, ''),
      } as BlogMetadata
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return summaries
}

export function getBlogPost(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  return {
    metadata: { ...data, slug } as BlogMetadata,
    content,
  }
}
