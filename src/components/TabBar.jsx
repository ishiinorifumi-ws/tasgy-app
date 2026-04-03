import { TABS } from '../utils/labels'

const TAB_COLORS = {
  urgent: 'border-red-500 text-red-600',
  'this-week': 'border-yellow-500 text-yellow-700',
  'next-week': 'border-blue-500 text-blue-600',
  waiting: 'border-pink-300 text-pink-500',
}

function TabBar({ activeTab, onTabChange, counts }) {
  return (
    <div className="flex bg-white border-b border-gray-200 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        const count = counts[tab.key] || 0
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 min-w-0 px-2 py-3 text-xs font-medium border-b-2 transition-colors ${
              isActive
                ? TAB_COLORS[tab.key]
                : 'border-transparent text-gray-400'
            }`}
          >
            <span className="block truncate">{tab.name}</span>
            {count > 0 && (
              <span className="text-[10px] opacity-70">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default TabBar
