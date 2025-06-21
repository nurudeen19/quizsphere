import { marked } from 'marked'

export function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(text)
}
