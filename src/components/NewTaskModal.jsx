import { useState } from 'react'
import { createIssue } from '../api/github'
import { PRIORITY_LABELS, CATEGORY_LABELS } from '../utils/labels'
import { insertDeadlineToBody } from '../utils/deadline'

function NewTaskModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [deadline, setDeadline] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setCreating(true)
    try {
      const labels = []
      if (priority) labels.push(priority)
      if (category) labels.push(category)

      const issueBody = insertDeadlineToBody(body, deadline)
      await createIssue(title.trim(), issueBody, labels)
      onCreated()
    } catch (e) {
      alert('タスク作成に失敗しました: ' + e.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold">✏️ 新しいタスク</h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-xl px-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          {/* タイトル */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトル"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoFocus
            />
          </div>

          {/* 詳細 */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              詳細（任意）
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="詳細やメモ"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* 優先度 */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              優先度
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_LABELS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => setPriority(priority === p.name ? '' : p.name)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                    priority === p.name
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリ */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-700"
            >
              <option value="">なし</option>
              {CATEGORY_LABELS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 期限 */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              期限（任意）
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-700"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-2 pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 text-sm py-3 rounded-lg font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={creating || !title.trim()}
              className="flex-1 bg-blue-600 text-white text-sm py-3 rounded-lg font-medium disabled:opacity-50 active:bg-blue-700"
            >
              {creating ? '作成中...' : '作成する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewTaskModal
