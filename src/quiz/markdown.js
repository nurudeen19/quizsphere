import { marked } from 'marked'
import DOMPurify from 'dompurify'

export function renderMarkdown(text) {
  if (!text) return ''
  // Parse markdown and sanitize HTML output
  return DOMPurify.sanitize(marked.parse(text))
}
