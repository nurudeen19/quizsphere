import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * Configure marked with security-focused options
 */
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
  sanitize: false // We'll use DOMPurify instead
})

/**
 * Custom renderer for marked to handle code blocks and links
 */
const renderer = new marked.Renderer()

// Override link rendering to add security attributes
renderer.link = (href, title, text) => {
  const titleAttr = title ? ` title="${title}"` : ''
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
}

// Override code block rendering for better styling
renderer.code = (code, language) => {
  const validLanguage = language && language.match(/^[a-zA-Z0-9_+-]*$/) ? language : ''
  return `<pre class="code-block"><code class="language-${validLanguage}">${code}</code></pre>`
}

// Override inline code rendering
renderer.codespan = (code) => {
  return `<code class="inline-code">${code}</code>`
}

marked.use({ renderer })

/**
 * Configure DOMPurify with allowed tags and attributes
 */
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote',
    'a',
    'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'title', 'alt', 'src',
    'class', 'id'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
}

/**
 * Render markdown text to safe HTML
 * @param {string} text - The markdown text to render
 * @returns {string} - Safe HTML string
 */
export function renderMarkdown(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  try {
    // Parse markdown to HTML
    const html = marked.parse(text.trim())
    
    // Sanitize the HTML
    return DOMPurify.sanitize(html, purifyConfig)
  } catch (error) {
    console.error('Error rendering markdown:', error)
    
    // Fallback: return escaped text
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  }
}

/**
 * Render markdown text to plain text (strips all HTML)
 * @param {string} text - The markdown text to render
 * @returns {string} - Plain text string
 */
export function renderMarkdownToText(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  try {
    // Parse markdown to HTML
    const html = marked.parse(text.trim())
    
    // Strip all HTML tags
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  } catch (error) {
    console.error('Error rendering markdown to text:', error)
    return text
  }
}

/**
 * Check if text contains markdown formatting
 * @param {string} text - The text to check
 * @returns {boolean} - True if text appears to contain markdown
 */
export function hasMarkdownFormatting(text) {
  if (!text || typeof text !== 'string') {
    return false
  }
  
  // Simple patterns to detect markdown
  const markdownPatterns = [
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
    /`.*`/, // Code
    /#{1,6}\s/, // Headers
    /^\s*[-*+]\s/m, // Lists
    /^\s*\d+\.\s/m, // Numbered lists
    /\[.*\]\(.*\)/, // Links
    /```/, // Code blocks
    /^>/m // Blockquotes
  ]
  
  return markdownPatterns.some(pattern => pattern.test(text))
}

export default {
  renderMarkdown,
  renderMarkdownToText,
  hasMarkdownFormatting
}
