import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, ReceiptText } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/currency'
import { startOfMonth, startOfYear, startOfWeek } from 'date-fns'

type Period = 'week' | 'month' | 'year' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  week: 'Bu Hafta',
  month: 'Bu Ay',
  year: 'Bu Yıl',
  all: 'Tümü',
}

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions)
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)
  const isLoading = useStore((s) => s.isLoading)
  const [period, setPeriod] = useState<Period>('month')

  const filtered = useMemo(() => {
    if (period === 'all') return transactions
    const now = new Date()
    const start =
      period === 'week' ? startOfWeek(now, { weekStartsOn: 1 })
      : period === 'month' ? startOfMonth(now)
      : startOfYear(now)
    return transactions.filter((t) => new Date(t.date) >= start)
  }, [transactions, period])

  const totalIncome = useMemo(() => filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [filtered])
  const totalExpense = useMemo(() => filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [filtered])
  const net = totalIncome - totalExpense

  const pieData = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount
    })
    return Object.entries(map)
      .map(([id, value]) => {
        const cat = categories.find((c) => c.id === id)
        return { name: `${cat?.icon ?? ''} ${cat?.name ?? 'Diğer'}`, value, color: cat?.color ?? '#5F8575' }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [filtered, categories])

  const recentTx = useMemo(() => transactions.slice(0, 5), [transactions])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-sage-800/40 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Özet</h1>
          <p className="text-sm text-gray-500 dark:text-sage-400 mt-1">Finansal durumunuza genel bakış</p>
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-sage-900/60 p-1 rounded-xl">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50 ${
                period === p
                  ? 'bg-white dark:bg-sage-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-sage-400 hover:text-gray-700 dark:hover:text-sage-200'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-sage-400 font-medium mb-1">Toplam Gelir</p>
                <p className="text-2xl font-bold text-emerald-500 tabular-nums">
                  {formatCurrency(totalIncome, settings.currency)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-sage-500">
                {filtered.filter((t) => t.type === 'income').length} işlem
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-sage-400 font-medium mb-1">Toplam Gider</p>
                <p className="text-2xl font-bold text-red-500 tabular-nums">
                  {formatCurrency(totalExpense, settings.currency)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <ArrowDownRight className="w-3 h-3 text-red-500" />
              <span className="text-xs text-gray-500 dark:text-sage-500">
                {filtered.filter((t) => t.type === 'expense').length} işlem
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-sage-400 font-medium mb-1">Net Bakiye</p>
                <p className={`text-2xl font-bold tabular-nums ${net >= 0 ? 'text-sage-400' : 'text-red-500'}`}>
                  {formatCurrency(net, settings.currency)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-xs text-gray-500 dark:text-sage-500">
                {filtered.length} toplam işlem
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 dark:text-white">Gider Dağılımı</h2>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-sage-600 text-sm">
                Bu dönemde gider yok
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, settings.currency)}
                      contentStyle={{ background: '#111A15', border: 'none', borderRadius: '12px', color: '#f9fafb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 min-w-0 w-full sm:w-auto">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-gray-600 dark:text-sage-300 truncate flex-1">{d.name}</span>
                      <span className="text-gray-900 dark:text-white font-medium tabular-nums">
                        {formatCurrency(d.value, settings.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 dark:text-white">Son İşlemler</h2>
          </CardHeader>
          <CardContent>
            {recentTx.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-sage-600 text-sm">
                Henüz işlem yok
              </div>
            ) : (
              <div className="space-y-2">
                {recentTx.map((tx) => {
                  const cat = categories.find((c) => c.id === tx.categoryId)
                  return (
                    <div key={tx.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-sage-800/50 transition-colors">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: `${cat?.color ?? '#5F8575'}22` }}
                      >
                        {cat?.icon
                          ? <span className="text-sm leading-none">{cat.icon}</span>
                          : <ReceiptText size={14} className="text-sage-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {tx.description || cat?.name || 'İşlem'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-sage-500">
                          {new Date(tx.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold tabular-nums ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
