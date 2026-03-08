/**
 * 外部パッケージ不要の軽量Markdown→HTMLコンバーター
 * next-mdx-remote・remark・rehypeが pnpm-lock.yaml に存在しないため自前実装
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseInline(text: string): string {
  return text
    // Bold **text** or __text__
    .replace(/\*\*(.+?)\*\*|__(.+?)__/g, (_, a, b) => `<strong class="font-bold text-neutral-900 bg-amber-50 px-1 rounded">${a ?? b}</strong>`)
    // Italic *text* or _text_
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    // Code `text`
    .replace(/`([^`]+?)`/g, '<code class="bg-neutral-100 text-emerald-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 underline underline-offset-4 hover:text-emerald-700">$1</a>')
}

export function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const html: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // コードブロック
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      html.push(`<pre class="my-6 overflow-x-auto rounded-xl bg-neutral-900 p-5 text-sm text-neutral-100 font-mono leading-relaxed"><code>${codeLines.join('\n')}</code></pre>`)
      i++
      continue
    }

    // 見出し
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = parseInline(headingMatch[2])
      const classes: Record<number, string> = {
        1: 'mt-12 mb-6 text-3xl font-bold text-neutral-900',
        2: 'mt-12 mb-6 text-2xl font-bold text-neutral-900 pb-2 border-b-2 border-emerald-100',
        3: 'mt-8 mb-4 text-xl font-bold text-neutral-800',
        4: 'mt-6 mb-3 text-lg font-bold text-neutral-800',
      }
      html.push(`<h${level} class="${classes[level] ?? ''}">${text}</h${level}>`)
      i++
      continue
    }

    // 水平線
    if (/^-{3,}|^\*{3,}/.test(line.trim())) {
      html.push('<hr class="my-8 border-neutral-200" />')
      i++
      continue
    }

    // blockquote
    if (line.startsWith('>')) {
      const bqLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        bqLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      html.push(`<blockquote class="border-l-4 border-emerald-500 bg-emerald-50/50 p-4 my-6 rounded-r-lg text-neutral-700 italic">${bqLines.map(parseInline).join(' ')}</blockquote>`)
      continue
    }

    // 表（table）
    if (line.match(/^\|.+\|/) && i + 1 < lines.length && lines[i + 1].match(/^\|[-| :]+\|/)) {
      const headers = line.split('|').filter((_, idx) => idx > 0 && idx < line.split('|').length - 1)
      i += 2 // ヘッダー行 + セパレーター行をスキップ
      const rows: string[][] = []
      while (i < lines.length && lines[i].match(/^\|.+\|/)) {
        rows.push(lines[i].split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1))
        i++
      }
      html.push(
        `<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm">` +
          `<thead><tr>${headers.map((h) => `<th class="border border-neutral-200 bg-neutral-50 px-4 py-2 text-left font-semibold text-neutral-800">${parseInline(h.trim())}</th>`).join('')}</tr></thead>` +
          `<tbody>${rows.map((row, ri) => `<tr class="${ri % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}">${row.map((cell) => `<td class="border border-neutral-200 px-4 py-2 text-neutral-700">${parseInline(cell.trim())}</td>`).join('')}</tr>`).join('')}</tbody>` +
          `</table></div>`
      )
      continue
    }

    // 箇条書きリスト (- / * / ✅ / ⚠️ など)
    if (line.match(/^[-*] /) || line.match(/^[✅⚠️❌📄] /)) {
      const items: string[] = []
      while (i < lines.length && (lines[i].match(/^[-*] /) || lines[i].match(/^[✅⚠️❌📄] /))) {
        items.push(`<li class="leading-relaxed">${parseInline(lines[i].replace(/^[-*✅⚠️❌📄] /, ''))}</li>`)
        i++
      }
      html.push(`<ul class="mb-6 ml-6 list-disc [&>li]:mt-2 text-neutral-700">${items.join('')}</ul>`)
      continue
    }

    // 番号付きリスト
    if (line.match(/^\d+\. /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(`<li class="leading-relaxed">${parseInline(lines[i].replace(/^\d+\. /, ''))}</li>`)
        i++
      }
      html.push(`<ol class="mb-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-700 font-medium">${items.join('')}</ol>`)
      continue
    }

    // チェックリスト [ ] / [x]
    if (line.match(/^- \[[ x]\] /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^- \[[ x]\] /)) {
        const checked = lines[i].includes('[x]')
        const text = lines[i].replace(/^- \[[ x]\] /, '')
        items.push(`<li class="flex items-start gap-2 leading-relaxed"><span class="${checked ? 'text-emerald-600' : 'text-neutral-300'}">${checked ? '☑' : '☐'}</span><span>${parseInline(text)}</span></li>`)
        i++
      }
      html.push(`<ul class="mb-6 ml-2 space-y-1 text-neutral-700">${items.join('')}</ul>`)
      continue
    }

    // 空行
    if (line.trim() === '') {
      i++
      continue
    }

    // 段落
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].match(/^[-*] /) && !lines[i].match(/^\d+\. /) && !lines[i].startsWith('>') && !lines[i].match(/^\|/)) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      html.push(`<p class="mb-6 leading-relaxed text-neutral-700 text-[16px] md:text-[17px]">${parseInline(paraLines.join(' '))}</p>`)
    }
  }

  return html.join('\n')
}
