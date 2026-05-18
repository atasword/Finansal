import { useState, useMemo } from 'react'
import { Plus, Search, TrendingUp, TrendingDown, SlidersHorizontal } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Card, CardContent } from '@/components/ui/Card'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import Button from '@/components/ui/Button'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { formatCurrency } from '@/utils/currency'
import type { TransactionType } from '@/types'

export default function Transactions() {
  const transactions = useStore((s) => s.transactions)
  const categories = useStore((s) => s.categories)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== 'all' && t.type !== typeFilter) return false
        if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false
        if (search) {
          const cat = categories.find((c) => c.id === t.categoryId)
          const lower = search.toLowerCase()
          return (
            t.description?.toLowerCase().includes(lower) ||
            cat?.name.toLowerCase().includes(lower) ||
            String(t.amount).includes(lower)
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, search, typeFilter, categoryFilter, categories])

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">İşlemler</h1>
        <LiquidButton
          size="sm"
          onClick={() => setShowForm(true)}
          className="hidden md:inline-flex text-sage-600 dark:text-sage-200 font-semibold"
        >
          <Plus className="w-4 h-4" /> İşlem Ekle
        </LiquidButton>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 p-4 shadow-lg shadow-emerald-300/40 dark:shadow-emerald-900/30 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-300 hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-widest">Görüntülenen Gelir</p>
              <p className="text-xl font-black text-white tracking-tight mt-1">{formatCurrency(totalIncome)}</p>
              <p className="text-[10px] text-emerald-200/80 mt-0.5">{filtered.filter((t) => t.type === 'income').length} işlem</p>
            </div>
            <div className="w-9 h-9 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-500 via-red-500 to-rose-600 p-4 shadow-lg shadow-red-300/40 dark:shadow-red-900/30 hover:shadow-xl hover:shadow-red-300/50 transition-all duration-300 hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-red-100 uppercase tracking-widest">Görüntülenen Gider</p>
              <p className="text-xl font-black text-white tracking-tight mt-1">{formatCurrency(totalExpense)}</p>
              <p className="text-[10px] text-red-200/80 mt-0.5">{filtered.filter((t) => t.type === 'expense').length} işlem</p>
            </div>
            <div className="w-9 h-9 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center p-4 bg-white/80 dark:bg-sage-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-sage-800/60">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 dark:text-sage-500 flex-shrink-0" />
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-sage-500" />
          <input
            type="text"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-sage-700 rounded-xl bg-gray-50 dark:bg-sage-800/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 dark:focus:border-sage-400 hover:border-gray-300 dark:hover:border-sage-600 transition-all duration-150"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-sage-700 rounded-xl bg-gray-50 dark:bg-sage-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 dark:focus:border-sage-400 transition-all duration-150 cursor-pointer"
        >
          <option value="all">Tüm Türler</option>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-sage-700 rounded-xl bg-gray-50 dark:bg-sage-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 dark:focus:border-sage-400 transition-all duration-150 cursor-pointer"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>

        {(search || typeFilter !== 'all' || categoryFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all') }}
            className="px-3 py-2 text-xs font-medium text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Temizle
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400 dark:text-sage-500 font-medium">{filtered.length} işlem</span>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-sage-800 flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-gray-400 dark:text-sage-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-sage-400">İşlem bulunamadı</p>
              <p className="text-xs text-gray-400 dark:text-sage-600 mt-1">Filtreleri değiştirmeyi deneyin</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-sage-800/60">
              {filtered.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}
