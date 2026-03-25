// 優先度ラベル定義
export const PRIORITY_LABELS = [
  { name: '🔴 緊急', key: 'urgent', color: '#d73a4a' },
  { name: '🟡 今週', key: 'this-week', color: '#fbca04' },
  { name: '🔵 次週以降', key: 'next-week', color: '#0075ca' },
  { name: '👀 確認待ち', key: 'waiting', color: '#f9d0c4' },
]

// カテゴリラベル定義
export const CATEGORY_LABELS = [
  { name: '🏢 経理総務', color: '#0e8a16' },
  { name: '👥 採用労務', color: '#d876e3' },
  { name: '🔒 情シス', color: '#006b75' },
  { name: '💼 人事制度', color: '#5319e7' },
  { name: '🌐 コーポレート', color: '#c5def5' },
]

// ステータスラベル
export const STATUS_LABELS = [
  { name: '👀 確認待ち', color: '#f9d0c4' },
  { name: '⏸️ 保留', color: '#e4e669' },
]

// タブ定義（優先度 + 確認待ち + ラベルなし）
export const TABS = [
  { name: '🔴 緊急', key: 'urgent', labelName: '🔴 緊急' },
  { name: '🟡 今週', key: 'this-week', labelName: '🟡 今週' },
  { name: '🔵 次週', key: 'next-week', labelName: '🔵 次週以降' },
  { name: '👀 待ち', key: 'waiting', labelName: '👀 確認待ち' },
]

// Issue のラベルから優先度キーを返す
export function getPriorityKey(issue) {
  const labelNames = issue.labels.map((l) => l.name)
  for (const p of PRIORITY_LABELS) {
    if (labelNames.includes(p.name)) return p.key
  }
  // 確認待ちチェック
  if (labelNames.includes('👀 確認待ち')) return 'waiting'
  // ラベルなし → 今週扱い
  return 'this-week'
}

// Issue のラベルからカテゴリラベルを返す
export function getCategoryLabel(issue) {
  const labelNames = issue.labels.map((l) => l.name)
  return CATEGORY_LABELS.find((c) => labelNames.includes(c.name)) || null
}

// Issue のラベルから優先度ラベル名を返す
export function getPriorityLabel(issue) {
  const labelNames = issue.labels.map((l) => l.name)
  return PRIORITY_LABELS.find((p) => labelNames.includes(p.name)) || null
}

// 優先度の順序（ソート用）
const PRIORITY_ORDER = { urgent: 0, 'this-week': 1, 'next-week': 2, waiting: 3 }

export function getPriorityOrder(issue) {
  return PRIORITY_ORDER[getPriorityKey(issue)] ?? 1
}

// カテゴリの順序（ソート用）
export function getCategoryOrder(issue) {
  const cat = getCategoryLabel(issue)
  if (!cat) return 999
  return CATEGORY_LABELS.findIndex((c) => c.name === cat.name)
}
