import { useState, useEffect, useCallback } from 'react'
import { fetchIssues } from './api/github'
import { getPriorityKey } from './utils/labels'
import TokenInput from './components/TokenInput'
import Header from './components/Header'
import TabBar from './components/TabBar'
import FilterSort from './components/FilterSort'
import TaskCard from './components/TaskCard'
import NewTaskModal from './components/NewTaskModal'

function App() {
  const [token, setToken] = useState(localStorage.getItem('github_token'))
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('urgent')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  const [showNewTask, setShowNewTask] = useState(false)

  const loadIssues = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchIssues()
      setIssues(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) loadIssues()
  }, [token, loadIssues])

  const handleTokenSet = (newToken) => {
    localStorage.setItem('github_token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('github_token')
    setToken(null)
    setIssues([])
  }

  if (!token) {
    return <TokenInput onTokenSet={handleTokenSet} />
  }

  // タブでフィルター
  const filteredByTab = issues.filter((issue) => getPriorityKey(issue) === activeTab)

  // カテゴリフィルター
  const filteredByCategory =
    categoryFilter === 'all'
      ? filteredByTab
      : filteredByTab.filter((issue) =>
          issue.labels.some((l) => l.name === categoryFilter)
        )

  // ソート
  const sorted = [...filteredByCategory].sort((a, b) => {
    switch (sortBy) {
      case 'deadline': {
        const deadlineRegex = /📅\s*期限[:：]\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2})/
        const aMatch = a.body?.match(deadlineRegex)
        const bMatch = b.body?.match(deadlineRegex)
        const aDate = aMatch ? new Date(aMatch[1].replace(/\//g, '-')) : new Date('9999-12-31')
        const bDate = bMatch ? new Date(bMatch[1].replace(/\//g, '-')) : new Date('9999-12-31')
        return aDate - bDate
      }
      case 'category': {
        const aLabels = a.labels.map((l) => l.name).join(',')
        const bLabels = b.labels.map((l) => l.name).join(',')
        return aLabels.localeCompare(bLabels, 'ja')
      }
      case 'created':
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  // 各タブのカウント
  const tabCounts = {}
  for (const issue of issues) {
    const key = getPriorityKey(issue)
    tabCounts[key] = (tabCounts[key] || 0) + 1
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <Header onAdd={() => setShowNewTask(true)} onLogout={handleLogout} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />
      <FilterSort
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="px-3 pb-20">
        {loading && (
          <div className="text-center py-8 text-gray-500">読み込み中...</div>
        )}
        {error && (
          <div className="text-center py-8 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-8 text-gray-400">タスクがありません</div>
        )}
        {sorted.map((issue) => (
          <TaskCard key={issue.id} issue={issue} onUpdate={loadIssues} onClosed={(id) => setIssues((prev) => prev.filter((i) => i.id !== id))} />
        ))}
      </div>

      {showNewTask && (
        <NewTaskModal
          onClose={() => setShowNewTask(false)}
          onCreated={() => {
            setShowNewTask(false)
            loadIssues()
          }}
        />
      )}
    </div>
  )
}

export default App
