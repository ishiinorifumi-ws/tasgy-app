import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCategoryLabel } from '../utils/labels'
import { parseDeadline, getDeadlineInfo } from '../utils/deadline'
import { fetchComments } from '../api/github'
import TaskDetail from './TaskDetail'

function TaskCard({ issue, onUpdate, onClosed }) {
  // 'collapsed' | 'preview' | 'full'
  const [mode, setMode] = useState('collapsed')
  const [comments, setComments] = useState(null) // null = 未取得, [] = 取得済み(0件)
  const fetchedRef = useRef(false)

  const category = getCategoryLabel(issue)
  const deadline = parseDeadline(issue.body)
  const deadlineInfo = getDeadlineInfo(deadline)
  const loadingComments = comments === null && mode !== 'collapsed'

  // プレビュー以上になったらコメントを取得（1回のみ）
  useEffect(() => {
    if (mode === 'collapsed' || fetchedRef.current) return
    fetchedRef.current = true
    fetchComments(issue.number)
      .then(setComments)
      .catch(() => setComments([]))
  }, [mode, issue.number])

  const handleCardClick = () => {
    if (mode === 'collapsed') setMode('preview')
    else if (mode === 'preview') setMode('collapsed')
    else setMode('collapsed')
  }

  const handleShowFull = (e) => {
    e.stopPropagation()
    setMode('full')
  }

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment])
  }

  const latestComment = comments && comments.length > 0 ? comments[comments.length - 1] : null

  return (
    <div className="bg-white rounded-xl shadow-sm mb-2 overflow-hidden border border-gray-100">
      {/* カード概要 */}
      <button
        onClick={handleCardClick}
        className="w-full text-left px-4 py-3 active:bg-gray-50"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              <span className="text-gray-400 text-xs mr-1">#{issue.number}</span>
              {issue.title}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {category && (
                <span
                  className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              )}
              {deadlineInfo && (
                <span
                  className={`text-[11px] ${
                    deadlineInfo.status === 'overdue'
                      ? 'text-red-600 font-bold'
                      : deadlineInfo.status === 'soon'
                        ? 'text-orange-500 font-medium'
                        : 'text-gray-500'
                  }`}
                >
                  {deadlineInfo.text}
                </span>
              )}
            </div>
          </div>
          <span className="text-gray-300 text-sm mt-1 shrink-0">
            {mode === 'collapsed' ? '▼' : '▲'}
          </span>
        </div>
      </button>

      {/* プレビュー: 最新コメント1件 */}
      {mode === 'preview' && (
        <div className="border-t border-gray-100 px-4 py-3">
          {loadingComments ? (
            <p className="text-xs text-gray-400">読み込み中...</p>
          ) : latestComment ? (
            <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
              <span className="text-gray-400">
                {new Date(latestComment.created_at).toLocaleDateString('ja-JP', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div className="mt-1 prose prose-sm max-w-none"><Markdown remarkPlugins={[remarkGfm]}>{latestComment.body}</Markdown></div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">コメントなし</p>
          )}
          <button
            onClick={handleShowFull}
            className="mt-2 w-full text-xs text-blue-500 font-medium py-1.5 active:text-blue-700"
          >
            詳細を表示 ▼
          </button>
        </div>
      )}

      {/* 全詳細 */}
      {mode === 'full' && (
        <TaskDetail
          issue={issue}
          comments={comments || []}
          loadingComments={loadingComments}
          onCommentAdded={handleCommentAdded}
          onUpdate={onUpdate}
          onClosed={() => onClosed(issue.id)}
        />
      )}
    </div>
  )
}

export default TaskCard
