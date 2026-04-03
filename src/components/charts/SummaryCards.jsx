import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/helpers'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function StatCard({ title, amount, icon: Icon, variant, change, delay = 0 }) {
  const variants = {
    balance: {
      bg: 'bg-indigo-600',
      text: 'text-white',
      sub: 'text-indigo-200',
      icon: 'bg-white/20 text-white',
      badge: 'bg-white/20 text-white',
    },
    income: {
      bg: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-white',
      sub: 'text-slate-400',
      icon: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500',
      badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      bg: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-white',
      sub: 'text-slate-400',
      icon: 'bg-red-50 dark:bg-red-950/40 text-red-500',
      badge: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    },
  }

  const v = variants[variant]

  return (
    <div
      className={`
        ${v.bg} rounded-2xl p-5 border border-slate-100 dark:border-slate-800
        shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up
        ${variant === 'balance' ? 'shadow-indigo-100 dark:shadow-indigo-950/30' : ''}
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${v.icon} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-body font-medium px-2 py-1 rounded-lg ${v.badge}`}>
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className={`text-xs font-body font-medium ${v.sub} mb-1 uppercase tracking-wide`}>{title}</p>
      <p className={`text-2xl font-display font-bold ${v.text} leading-tight`}>
        {formatCurrency(amount)}
      </p>
    </div>
  )
}

export default function SummaryCards() {
  const { balance, totalIncome, totalExpense } = useApp()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Balance"
        amount={balance}
        icon={Wallet}
        variant="balance"
        delay={0}
      />
      <StatCard
        title="Total Income"
        amount={totalIncome}
        icon={TrendingUp}
        variant="income"
        change={12}
        delay={100}
      />
      <StatCard
        title="Total Expenses"
        amount={totalExpense}
        icon={TrendingDown}
        variant="expense"
        change={-5}
        delay={200}
      />
    </div>
  )
}
