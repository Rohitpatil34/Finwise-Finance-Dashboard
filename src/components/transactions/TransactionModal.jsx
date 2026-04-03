import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../data/transactions'
import { X } from 'lucide-react'

export default function TransactionModal({ isOpen, onClose, editTx = null }) {
  const { addTransaction, editTransaction } = useApp()
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editTx) {
      setForm({ description: editTx.description, amount: editTx.amount, category: editTx.category, type: editTx.type, date: editTx.date })
    } else {
      setForm({ description: '', amount: '', category: 'Food & Dining', type: 'expense', date: new Date().toISOString().split('T')[0] })
    }
    setErrors({})
  }, [editTx, isOpen])

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = { ...form, amount: Number(form.amount) }
    if (editTx) editTransaction(editTx.id, payload)
    else addTransaction(payload)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-display text-lg text-slate-900 dark:text-white">
            {editTx ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Type */}
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-body font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Monthly salary, Grocery..."
              className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.description ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-3 py-2.5 text-sm font-body text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-body font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.amount ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-3 py-2.5 text-sm font-body font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="text-xs font-body font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-body text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-body font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.date ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-3 py-2.5 text-sm font-body text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-body font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-body font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30">
            {editTx ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
