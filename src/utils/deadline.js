// Issue本文から期限を抽出する
// 形式: 📅 期限: YYYY-MM-DD または 📅 期限: YYYY/MM/DD
const DEADLINE_REGEX = /📅\s*期限[:：]\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2})/

export function parseDeadline(body) {
  if (!body) return null
  const match = body.match(DEADLINE_REGEX)
  if (!match) return null
  const dateStr = match[1].replace(/\//g, '-')
  const date = new Date(dateStr + 'T00:00:00')
  return isNaN(date.getTime()) ? null : date
}

// 期限の表示テキストとステータスを返す
export function getDeadlineInfo(deadline) {
  if (!deadline) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

  const month = deadline.getMonth() + 1
  const day = deadline.getDate()
  const label = `${month}/${day}`

  if (diffDays < 0) {
    return { label: `${label}`, status: 'overdue', text: `🔥 ${label}（${Math.abs(diffDays)}日超過）` }
  }
  if (diffDays <= 3) {
    return { label: `${label}`, status: 'soon', text: `⚠️ ${label}（あと${diffDays}日）` }
  }
  return { label: `${label}`, status: 'normal', text: `📅 ${label}` }
}

// 期限テキストを Issue 本文に挿入する
export function insertDeadlineToBody(body, dateStr) {
  if (!dateStr) return body || ''
  const deadlineLine = `📅 期限: ${dateStr}`
  if (!body || body.trim() === '') return deadlineLine
  return `${deadlineLine}\n\n${body}`
}
