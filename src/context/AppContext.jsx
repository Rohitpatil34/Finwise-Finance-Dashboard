import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/transactions'

const AppContext = createContext(null)

const STORAGE_KEY = 'finwise_transactions'
const THEME_KEY = 'finwise_theme'
const ROLE_KEY = 'finwise_role'

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark'
    } catch {
      return false
    }
  })

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem(ROLE_KEY) || 'viewer'
    } catch {
      return 'viewer'
    }
  })

  const [activeTab, setActiveTab] = useState('dashboard')
  const [filters, setFilters] = useState({ search: '', type: 'all', category: 'all', dateFrom: '', dateTo: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role)
  }, [role])

  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: Date.now().toString() }
    setTransactions(prev => [newTx, ...prev])
  }, [])

  const editTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }, [])

  const resetData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS)
  }, [])

  const filteredTransactions = transactions.filter(tx => {
    if (filters.search && !tx.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.type !== 'all' && tx.type !== filters.type) return false
    if (filters.category !== 'all' && tx.category !== filters.category) return false
    if (filters.dateFrom && tx.date < filters.dateFrom) return false
    if (filters.dateTo && tx.date > filters.dateTo) return false
    return true
  }).sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1
    if (sortConfig.key === 'amount') return (a.amount - b.amount) * dir
    if (sortConfig.key === 'date') return a.date.localeCompare(b.date) * dir
    return a[sortConfig.key].localeCompare(b[sortConfig.key]) * dir
  })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <AppContext.Provider value={{
      transactions, filteredTransactions,
      addTransaction, editTransaction, deleteTransaction, resetData,
      darkMode, setDarkMode,
      role, setRole,
      activeTab, setActiveTab,
      filters, setFilters,
      sortConfig, setSortConfig,
      totalIncome, totalExpense, balance,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
