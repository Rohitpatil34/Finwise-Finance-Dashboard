import { useApp } from '../../context/AppContext'
import { getCategoryData, getMonthlyData, formatCurrency } from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../data/transactions'
import { TrendingUp, TrendingDown, Award, AlertTriangle, BarChart3, PiggyBank } from 'lucide-react'

function InsightCard({ icon: Icon, title, value, sub, accent = 'indigo', delay = 0 }) {
  const accents = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/50' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/50' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/50' },
    red: { bg: 'bg-red-50 dark:bg-red-950/30', icon: 'text-red-600 dark:text-red-400', border: 'border-red-100 dark:border-red-900/50' },
    violet: { bg: 'bg-violet-50 dark:bg-violet-950/30', icon: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/50' },
  }
  const a = accents[accent]

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className={`w-10 h-10 rounded-xl ${a.bg} ${a.border} border flex items-center justify-center mb-3`}>
        <Icon size={18} className={a.icon} />
      </div>
      <p className="text-xs font-body text-slate-400 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-lg font-display font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
      {sub && <p className="text-xs font-body text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function InsightsSection() {
  const { transactions } = useApp()

  const categoryData = getCategoryData(transactions)
  const monthlyData = getMonthlyData(transactions)

  const topCategory = categoryData[0]
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const savings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0

  const lastMonth = monthlyData[monthlyData.length - 1]
  const prevMonth = monthlyData[monthlyData.length - 2]
  const monthlyChange = prevMonth ? (((lastMonth?.expense - prevMonth?.expense) / prevMonth?.expense) * 100).toFixed(1) : null

  const avgMonthlyExpense = monthlyData.length ? (totalExpenses / monthlyData.length).toFixed(0) : 0
  const avgMonthlyIncome = monthlyData.length ? (totalIncome / monthlyData.length).toFixed(0) : 0

  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  const largestExpense = expenseTransactions.length > 0
    ? expenseTransactions.sort((a, b) => b.amount - a.amount)[0]
    : null

  if (transactions.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div>
          <h2 className="font-display text-xl text-slate-900 dark:text-white">Insights</h2>
          <p className="text-xs text-slate-400 font-body mt-0.5">Smart observations from your financial data</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <BarChart3 size={20} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-sm font-body font-medium text-slate-500 dark:text-slate-400">No data to analyse yet</p>
          <p className="text-xs font-body text-slate-400 mt-1">Add some transactions to see insights here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-xl text-slate-900 dark:text-white">Insights</h2>
        <p className="text-xs text-slate-400 font-body mt-0.5">Smart observations from your financial data</p>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {topCategory && (
          <InsightCard
            icon={Award}
            title="Top Spending Category"
            value={topCategory.name}
            sub={`${formatCurrency(topCategory.value)} total spent`}
            accent="indigo"
            delay={0}
          />
        )}
        <InsightCard
          icon={PiggyBank}
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub={`${formatCurrency(savings)} saved overall`}
          accent="emerald"
          delay={100}
        />
        {monthlyChange !== null && (
          <InsightCard
            icon={parseFloat(monthlyChange) > 0 ? TrendingUp : TrendingDown}
            title="Expense Trend"
            value={`${monthlyChange > 0 ? '+' : ''}${monthlyChange}%`}
            sub="vs previous month"
            accent={parseFloat(monthlyChange) > 0 ? 'red' : 'emerald'}
            delay={200}
          />
        )}
        <InsightCard
          icon={BarChart3}
          title="Avg Monthly Expense"
          value={formatCurrency(Number(avgMonthlyExpense))}
          sub="across all months"
          accent="amber"
          delay={300}
        />
        <InsightCard
          icon={TrendingUp}
          title="Avg Monthly Income"
          value={formatCurrency(Number(avgMonthlyIncome))}
          sub="across all months"
          accent="violet"
          delay={400}
        />
        <InsightCard
          icon={AlertTriangle}
          title="Largest Single Expense"
          value={largestExpense ? formatCurrency(largestExpense.amount) : '—'}
          sub={largestExpense?.description || 'No expenses recorded'}
          accent="red"
          delay={500}
        />
      </div>

      {/* Category breakdown table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
        <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white mb-4">Spending by Category</h3>
        <div className="space-y-3">
          {categoryData.map((item, i) => {
            const pct = ((item.value / totalExpenses) * 100).toFixed(1)
            const color = CATEGORY_COLORS[item.name] || '#6366f1'
            return (
              <div key={item.name} className="animate-slide-up" style={{ animationDelay: `${500 + i * 40}ms`, animationFillMode: 'both' }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-body text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">{pct}%</span>
                    <span className="text-xs font-mono font-medium text-slate-900 dark:text-white w-24 text-right">{formatCurrency(item.value)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly comparison table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
        <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white mb-4">Monthly Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">Month</th>
                <th className="text-right text-slate-400 font-medium pb-2 pr-4">Income</th>
                <th className="text-right text-slate-400 font-medium pb-2 pr-4">Expenses</th>
                <th className="text-right text-slate-400 font-medium pb-2">Net</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m, i) => (
                <tr key={m.month} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                  <td className="py-2 pr-4 text-slate-700 dark:text-slate-300 font-medium">{m.month}</td>
                  <td className="py-2 pr-4 text-right text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(m.income)}</td>
                  <td className="py-2 pr-4 text-right text-slate-900 dark:text-white font-mono">{formatCurrency(m.expense)}</td>
                  <td className={`py-2 text-right font-mono font-semibold ${m.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {m.balance >= 0 ? '+' : ''}{formatCurrency(m.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
