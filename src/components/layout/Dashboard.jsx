import SummaryCards from '../charts/SummaryCards'
import BalanceTrendChart from '../charts/BalanceTrendChart'
import MonthlyBarChart from '../charts/MonthlyBarChart'
import SpendingDonut from '../charts/SpendingDonut'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../data/transactions'
import { ArrowRight } from 'lucide-react'

function RecentTransaction({ tx }) {
  const color = CATEGORY_COLORS[tx.category] || '#6366f1'
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 dark:border-slate-800 last:border-0">
      <div className={`w-1 h-7 rounded-full flex-shrink-0 ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-body font-medium text-slate-800 dark:text-slate-200 truncate">{tx.description}</p>
        <p className="text-xs font-body text-slate-400">{formatDate(tx.date)}</p>
      </div>
      <span className={`text-xs font-mono font-semibold flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const { transactions, setActiveTab } = useApp()
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-xl text-slate-900 dark:text-white">Overview</h2>
        <p className="text-xs text-slate-400 font-body mt-0.5">Your financial snapshot at a glance</p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceTrendChart />
        <MonthlyBarChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingDonut />

        {/* Recent transactions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-xs text-slate-400 font-body mt-0.5">Latest 6 transactions</p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="flex items-center gap-1 text-xs font-body text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recent.map(tx => <RecentTransaction key={tx.id} tx={tx} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
