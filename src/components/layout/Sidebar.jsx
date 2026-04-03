import { useApp } from '../../context/AppContext'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Sun, Moon, ChevronDown, Wallet, ShieldCheck, Eye, RotateCcw } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
]

export default function Sidebar({ mobile = false, onClose }) {
  const { activeTab, setActiveTab, darkMode, setDarkMode, role, setRole, resetData } = useApp()

  const handleNav = (id) => {
    setActiveTab(id)
    onClose?.()
  }

  return (
    <aside className={`
      flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
      ${mobile ? 'w-full' : 'w-64'}
    `}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl text-slate-900 dark:text-white leading-none">Finwise</h1>
            <p className="text-xs text-slate-400 font-body mt-0.5">Finance Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNav(id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200
              ${activeTab === id
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <Icon className={`w-4.5 h-4.5 ${activeTab === id ? 'text-indigo-600 dark:text-indigo-400' : ''}`} size={18} />
            {label}
            {activeTab === id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Controls */}
      <div className="px-4 pb-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        {/* Role switcher */}
        <div>
          <p className="text-xs text-slate-400 font-body mb-1.5 px-1">Role</p>
          <div className="relative">
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-body px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className={`mt-1.5 flex items-center gap-1.5 px-1 text-xs font-body ${role === 'admin' ? 'text-indigo-500' : 'text-slate-400'}`}>
            {role === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
            {role === 'admin' ? 'Can add / edit / delete' : 'Read-only access'}
          </div>
        </div>

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-body text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          <span className="flex items-center gap-2">
            {darkMode ? <Moon size={15} className="text-indigo-400" /> : <Sun size={15} className="text-amber-500" />}
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div className={`w-8 h-4.5 rounded-full relative transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-200 ${darkMode ? 'left-4' : 'left-0.5'}`} />
          </div>
        </button>

        {/* Reset */}
        <button
          onClick={() => { if (confirm('Reset all data to defaults?')) resetData() }}
          className="w-full flex items-center gap-2 text-xs font-body text-slate-400 hover:text-red-500 transition-colors px-1 py-1"
        >
          <RotateCcw size={12} />
          Reset to sample data
        </button>
      </div>
    </aside>
  )
}
