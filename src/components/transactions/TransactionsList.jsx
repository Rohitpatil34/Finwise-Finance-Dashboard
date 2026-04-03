import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/transactions'
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from '../../utils/helpers'
import TransactionModal from './TransactionModal'
import { Search, Filter, ArrowUpDown, Plus, Pencil, Trash2, Download, ChevronDown } from 'lucide-react'

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#6366f1'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-body px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '18', color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {category}
    </span>
  )
}

export default function TransactionsList() {
  const { filteredTransactions, filters, setFilters, sortConfig, setSortConfig, role, deleteTransaction } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleEdit = (tx) => {
    setEditTx(tx)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this transaction?')) deleteTransaction(id)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditTx(null)
  }

  const SortBtn = ({ label, k }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-1 text-xs font-body font-medium transition-colors ${sortConfig.key === k ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
    >
      {label}
      <ArrowUpDown size={11} />
    </button>
  )

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-slate-900 dark:text-white">Transactions</h2>
          <p className="text-xs text-slate-400 font-body mt-0.5">{filteredTransactions.length} records</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-body text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Download size={14} />
              Export
              <ChevronDown size={12} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 overflow-hidden animate-scale-in">
                <button
                  onClick={() => { exportToCSV(filteredTransactions); setExportOpen(false) }}
                  className="w-full px-4 py-2.5 text-left text-sm font-body text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => { exportToJSON(filteredTransactions); setExportOpen(false) }}
                  className="w-full px-4 py-2.5 text-left text-sm font-body text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>

          {/* Add (admin only) */}
          {role === 'admin' && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-body font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-body text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-body font-medium transition-all ${showFilters ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Filter size={14} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 animate-slide-up">
            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-body text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-body text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-body text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="From date"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-body text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="To date"
            />
          </div>
        )}
      </div>

      {/* Sort row */}
      <div className="flex items-center gap-4 px-1">
        <span className="text-xs text-slate-400 font-body">Sort by:</span>
        <SortBtn label="Date" k="date" />
        <SortBtn label="Amount" k="amount" />
        <SortBtn label="Category" k="category" />
      </div>

      {/* Transactions list */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center">
            <p className="text-slate-400 font-body text-sm">No transactions found</p>
            <p className="text-slate-300 dark:text-slate-600 font-body text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTransactions.map((tx, i) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 group animate-slide-up"
              style={{ animationDelay: `${Math.min(i * 20, 300)}ms`, animationFillMode: 'both' }}
            >
              {/* Type indicator */}
              <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-body font-medium text-slate-900 dark:text-white truncate">{tx.description}</p>
                  <CategoryBadge category={tx.category} />
                </div>
                <p className="text-xs font-body text-slate-400 mt-0.5">{formatDate(tx.date)}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-mono font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>

              {/* Actions (admin only) */}
              {role === 'admin' && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleEdit(tx)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <TransactionModal isOpen={modalOpen} onClose={handleModalClose} editTx={editTx} />
    </div>
  )
}
