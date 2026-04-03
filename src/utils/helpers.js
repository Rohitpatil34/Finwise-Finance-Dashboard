export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatShortDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export const getMonthYear = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map(t => [t.date, t.description, t.category, t.type, t.amount])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'finwise_transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'finwise_transactions.json'
  a.click()
  URL.revokeObjectURL(url)
}

export const getMonthlyData = (transactions) => {
  const map = {}
  transactions.forEach(t => {
    const key = getMonthYear(t.date)
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0, balance: 0 }
    if (t.type === 'income') map[key].income += t.amount
    else map[key].expense += t.amount
  })
  return Object.values(map).map(m => ({ ...m, balance: m.income - m.expense }))
}

export const getCategoryData = (transactions) => {
  const map = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    if (!map[t.category]) map[t.category] = { name: t.category, value: 0 }
    map[t.category].value += t.amount
  })
  return Object.values(map).sort((a, b) => b.value - a.value)
}

export const getBalanceTrend = (transactions) => {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  let running = 0
  const seen = {}
  sorted.forEach(t => {
    if (t.type === 'income') running += t.amount
    else running -= t.amount
    const key = getMonthYear(t.date)
    seen[key] = running
  })
  return Object.entries(seen).map(([month, balance]) => ({ month, balance }))
}
