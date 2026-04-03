import { useApp } from '../../context/AppContext'
import { getMonthlyData } from '../../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import { BarChart3 } from 'lucide-react'

function EmptyChart({ message }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        <BarChart3 size={18} className="text-slate-300 dark:text-slate-600" />
      </div>
      <p className="text-xs font-body text-slate-400">{message}</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-lg">
        <p className="text-xs text-slate-400 font-body mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-xs font-body mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-500 capitalize">{p.name}:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function MonthlyBarChart() {
  const { transactions } = useApp()
  const data = getMonthlyData(transactions)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
      <div className="mb-4">
        <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white">Monthly Overview</h3>
        <p className="text-xs text-slate-400 font-body mt-0.5">Income vs expenses by month</p>
      </div>
      {data.length === 0 ? (
        <EmptyChart message="No data yet — add some transactions" />
      ) : (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: 'DM Mono', fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="income" maxBarSize={28} />
            <Bar dataKey="expense" fill="#6366f1" radius={[4, 4, 0, 0]} name="expense" maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs font-body text-slate-500">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
          Income
        </div>
        <div className="flex items-center gap-1.5 text-xs font-body text-slate-500">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
          Expense
        </div>
      </div>
    </div>
  )
}
