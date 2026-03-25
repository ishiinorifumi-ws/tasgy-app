import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { closeIssue, setLabels } from '../api/github'
import { PRIORITY_LABELS } from '../utils/labels'
import CommentForm from './CommentForm'

const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || ''
const REPO_NAME = import.meta.env.VITE_REPO_NAME || ''

function TaskDetail({ issue, comments, loadingComments, onCommentAdded, onUpdate }) {
  const [operating, setOperating] = useState(false)

  // 優先度ラベルを変更
  const handlePriorityChange = async (newPriorityName) => {
    setOperating(true)
    try {
      const currentLabels = issue.labels.map((l) => l.name)
      const withoutPriority = currentLabels.filter(
        (name) => !PRIORITY_LABELS.some((p) => p.name === name)
      )
      await setLabels(issue.number, [...withoutPriority, newPriorityName])
      onUpdate()
    } catch (e) {
      alert('ラベル変更に失敗しました: ' + e.message)
    } finally {
      setOperating(false)
    }
  }

  // Issue を Close
  const handleClose = async () => {
    if (!confirm('このタスクを完了にしますか？')) return
    setOperating(true)
    try {
      await closeIssue(issue.number)
      onUpdate()
    } catch (e) {
      alert('完了処理に失敗しました: ' + e.message)
    } finally {
      setOperating(false)
    }
  }

  // 現在の優先度ラベル
  const currentPriority = issue.labels.find((l) =>
    PRIORITY_LABELS.some((p) => p.name === l.name)
  )

  return (
    <div className="border-t border-gray-100 px-4 pb-4">
      {/* Issue 本文 */}
      {issue.body && (
        <div className="py-3 text-xs text-gray-600 leading-relaxed prose prose-sm max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{issue.body}</Markdown>
        </div>
      )}

      {/* コメント */}
      <div className="border-t border-gray-50 pt-3">
        <p className="text-xs font-medium text-gray-500 mb-2">
          💬 コメント ({comments.length}件)
        </p>
        {loadingComments ? (
          <p className="text-xs text-gray-400">読み込み中...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-gray-400">コメントなし</p>
        ) : (
          <div className="space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600"
              >
                <span className="text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="mt-1 prose prose-sm max-w-none"><Markdown remarkPlugins={[remarkGfm]}>{comment.body}</Markdown></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* メモ追記 */}
      <CommentForm issueNumber={issue.number} onCommentAdded={onCommentAdded} />

      {/* 優先度変更ボタン */}
      <div className="border-t border-gray-50 pt-3 mt-3">
        <p className="text-xs text-gray-500 mb-2">優先度変更:</p>
        <div className="flex flex-wrap gap-1.5">
          {PRIORITY_LABELS.map((p) => {
            const isCurrent = currentPriority?.name === p.name
            return (
              <button
                key={p.name}
                onClick={() => handlePriorityChange(p.name)}
                disabled={isCurrent || operating}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                  isCurrent
                    ? 'border-gray-300 bg-gray-100 text-gray-400'
                    : 'border-gray-200 bg-white text-gray-700 active:bg-gray-50'
                } disabled:opacity-50`}
              >
                {p.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleClose}
          disabled={operating}
          className="flex-1 bg-green-600 text-white text-xs py-2.5 rounded-lg font-medium active:bg-green-700 disabled:opacity-50"
        >
          ✅ 完了にする
        </button>
        <a
          href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-100 text-gray-600 text-xs py-2.5 rounded-lg font-medium text-center active:bg-gray-200"
        >
          🔗 GitHubで開く
        </a>
      </div>
    </div>
  )
}

export default TaskDetail
