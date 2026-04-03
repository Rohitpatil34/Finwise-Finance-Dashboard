import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/layout/Dashboard'
import TransactionsList from './components/transactions/TransactionsList'
import InsightsSection from './components/insights/InsightsSection'
import { Menu, X } from 'lucide-react'

function AppContent() {
  const { activeTab, darkMode } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-body flex`}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 shadow-2xl animate-slide-in-right">
            <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="font-display text-lg text-slate-900 dark:text-white">Finwise</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Page content */}
        <main className="px-4 lg:px-8 py-6 max-w-5xl">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <TransactionsList />}
          {activeTab === 'insights' && <InsightsSection />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
