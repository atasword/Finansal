import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { TrendingUp, TrendingDown, MoveHorizontal, PiggyBank } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/currency'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'
import { tr } from 'date-fns/locale'

type RangeOption = '3' | '6' | '12'

export default function Reports() {
  const transactions = useStore((s) => s.transactions)
  const categories = useStore((s) => s.categories)
  const [months, setMonths] = useState<RangeOption>('6')

  const monthCount = parseInt(months)

  const monthlyData = useMemo(() => {
    return Array.from({ length: monthCount }, (_, i) => {
      const date = subMonths(new Date(), monthCount - 1 - i)
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      const txs = transactions.filter((t) => {
        const d = new Date(t.date)
        return d >= start && d <= end
      })
      const gelir = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const gider = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      return {
        name: format(date, 'MMM yy', { locale: tr }),
        Gelir: gelir,
        Gider: gider,
        Net: gelir - gider,
      }
    })
  }, [transactions, monthCount])

  const categoryData = useMemo(() => {
    const start = startOfMonth(subMonths(new Date(), monthCount - 1))
    const end = endOfMonth(new Date())
    const map: Record<string, number> = {}
    transactions
      .filter((t) => t.type === 'expense')
      .filter((t) => {
        const d = new Date(t.date)
        return d >= start && d <= end
      })
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] || 0) + t.amount
      })
    return Object.entries(map)
      .map(([id, total]) => {
        const cat = categories.find((c) => c.id === id)
        return { name: `${cat?.icon ?? ''} ${cat?.name ?? 'Diğer'}`, total, color: cat?.color ?? '#5F8575' }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)
  }, [transactions, categories, monthCount])

  const totalIncome = monthlyData.reduce((s, m) => s + m.Gelir, 0)
  const totalExpense = monthlyData.reduce((s, m) => s + m.Gider, 0)
  const avgMonthlyExpense = totalExpense / monthCount
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  const statCards = [
    {
      label: 'Toplam Gelir',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      gradient: 'from-emerald-500 via-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-300/40 dark:shadow-emerald-900/30',
      hoverShadow: 'hover:shadow-emerald-300/50',
      textMuted: 'text-emerald-100',
      textDim: 'text-emerald-200/80',
      sub: `${monthCount} aylık toplam`,
    },
    {
      label: 'Toplam Gider',
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      gradient: 'from-red-500 via-red-500 to-rose-600',
      shadow: 'shadow-red-300/40 dark:shadow-red-900/30',
      hoverShadow: 'hover:shadow-red-300/50',
      textMuted: 'text-red-100',
      textDim: 'text-red-200/80',
      sub: `${monthCount} aylık toplam`,
    },
    {
      label: 'Ort. Aylık Gider',
      value: formatCurrency(avgMonthlyExpense),
      icon: MoveHorizontal,
      gradient: 'from-orange-500 via-orange-500 to-amber-600',
      shadow: 'shadow-orange-300/40 dark:shadow-orange-900/30',
      hoverShadow: 'hover:shadow-orange-300/50',
      textMuted: 'text-orange-100',
      textDim: 'text-orange-200/80',
      sub: 'aylık ortalama',
    },
    {
      label: 'Tasarruf Oranı',
      value: `%${savingsRate.toFixed(1)}`,
      icon: PiggyBank,
      gradient: savingsRate >= 0 ? 'from-sage-400 via-sage-500 to-sage-600' : 'from-red-500 via-red-500 to-rose-600',
      shadow: savingsRate >= 0 ? 'shadow-sage-300/40 dark:shadow-sage-900/30' : 'shadow-red-300/40 dark:shadow-red-900/30',
      hoverShadow: savingsRate >= 0 ? 'hover:shadow-sage-300/50' : 'hover:shadow-red-300/50',
      textMuted: savingsRate >= 0 ? 'text-sage-100' : 'text-red-100',
      textDim: savingsRate >= 0 ? 'text-sage-200/80' : 'text-red-200/80',
      sub: savingsRate >= 0 ? '↑ Pozitif tasarruf' : '↓ Negatif tasarruf',
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Raporlar</h1>
        <div className="flex gap-1 bg-white dark:bg-sage-900 rounded-xl p-1 border border-gray-200 dark:border-sage-700">
          {(['3', '6', '12'] as RangeOption[]).map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50 ${
                months === m
                  ? 'bg-sage-400 text-white shadow-sm'
                  : 'text-gray-600 dark:text-sage-300 hover:bg-gray-100 dark:hover:bg-sage-800'
              }`}
            >
              {m} Ay
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient} p-4 shadow-lg ${card.shadow} hover:shadow-xl ${card.hoverShadow} transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-[10px] font-semibold uppercase tracking-widest ${card.textMuted}`}>{card.label}</p>
                  <div className="w-7 h-7 bg-white/25 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <p className="text-xl font-black text-white tracking-tight">{card.value}</p>
                <p className={`text-[10px] mt-1 ${card.textDim}`}>{card.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 dark:text-white">Gelir / Gider Karşılaştırması</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2A23" opacity={0.8} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7FB5A3' }} />
              <YAxis tick={{ fontSize: 12, fill: '#7FB5A3' }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ backgroundColor: '#111A15', border: '1px solid #1C2A23', borderRadius: '12px', color: '#f9fafb', fontSize: 13 }}
              />
              <Legend />
              <Bar dataKey="Gelir" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gider" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 dark:text-white">Net Akış Trendi</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2A23" opacity={0.8} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7FB5A3' }} />
              <YAxis tick={{ fontSize: 12, fill: '#7FB5A3' }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ backgroundColor: '#111A15', border: '1px solid #1C2A23', borderRadius: '12px', color: '#f9fafb', fontSize: 13 }}
              />
              <Line type="monotone" dataKey="Net" stroke="#5F8575" strokeWidth={2.5} dot={{ r: 4, fill: '#5F8575' }} activeDot={{ r: 6, fill: '#4C6E5F' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 dark:text-white">Kategoriye Göre Giderler</h2>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-sage-600 text-center py-8">Bu dönemde gider yok</p>
          ) : (
            <div className="space-y-3.5">
              {categoryData.map((item, i) => {
                const pct = totalExpense > 0 ? (item.total / totalExpense) * 100 : 0
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-sage-300 font-medium">{item.name}</span>
                      <span className="text-gray-500 dark:text-sage-400 tabular-nums">
                        {formatCurrency(item.total)}{' '}
                        <span className="text-gray-400 dark:text-sage-600">({pct.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-sage-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
