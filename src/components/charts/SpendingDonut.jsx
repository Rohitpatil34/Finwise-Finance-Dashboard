import { useApp } from '../../context/AppContext'
import { getCategoryData } from '../../utils/helpers'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../data/transactions'
import { PieChart as PieIcon } from 'lucide-react'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-lg">
        <p className="text-xs font-body font-semibold text-slate-900 dark:text-white mb-0.5">{payload[0].name}</p>
        <p className="text-xs font-body text-slate-500">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function SpendingDonut() {
  const { transactions } = useApp()
  const data = getCategoryData(transactions).slice(0, 7)

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
        <div className="mb-4">
          <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white">Spending Breakdown</h3>
          <p className="text-xs text-slate-400 font-body mt-0.5">By category (expenses only)</p>
        </div>
        <div className="h-40 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            <PieIcon size={18} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-xs font-body text-slate-400">No expense data to show</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
      <div className="mb-4">
        <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white">Spending Breakdown</h3>
        <p className="text-xs text-slate-400 font-body mt-0.5">By category (expenses only)</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-40 w-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {data.map((item) => {
            const total = data.reduce((s, d) => s + d.value, 0)
            const pct = ((item.value / total) * 100).toFixed(1)
            return (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#6366f1' }}
                />
                <span className="text-xs font-body text-slate-600 dark:text-slate-300 truncate flex-1">{item.name}</span>
                <span className="text-xs font-mono text-slate-400 flex-shrink-0">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}