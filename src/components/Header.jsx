function Header({ onAdd, onLogout }) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold">📋 マイタスク</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onLogout}
          className="text-xs text-gray-400 px-2 py-1"
        >
          ログアウト
        </button>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white w-9 h-9 rounded-full text-xl font-bold flex items-center justify-center shadow-md active:bg-blue-700"
        >
          ＋
        </button>
      </div>
    </div>
  )
}

export default Header
