import { useApp } from '../../context/AppContext'
import { getBalanceTrend } from '../../utils/helpers'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import { TrendingUp } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-lg">
        <p className="text-xs text-slate-400 font-body mb-1">{label}</p>
        <p className="text-sm font-body font-semibold text-indigo-600 dark:text-indigo-400">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

function EmptyChart({ icon: Icon, message }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        <Icon size={18} className="text-slate-300 dark:text-slate-600" />
      </div>
      <p className="text-xs font-body text-slate-400">{message}</p>
    </div>
  )
}

export default function BalanceTrendChart() {
  const { transactions } = useApp()
  const data = getBalanceTrend(transactions)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
      <div className="mb-4">
        <h3 className="text-sm font-body font-semibold text-slate-900 dark:text-white">Balance Trend</h3>
        <p className="text-xs text-slate-400 font-body mt-0.5">Running balance over time</p>
      </div>
      {data.length === 0 ? (
        <EmptyChart icon={TrendingUp} message="No transaction data to display" />
      ) : (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:[stroke:#1e293b]" />
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  )
}
