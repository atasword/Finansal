import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle, Package } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Card, CardContent } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { Input, Select } from '@/components/ui/Input'
import { formatCurrency } from '@/utils/currency'
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import type { Budget as BudgetType, BudgetPeriod } from '@/types'

interface FormState {
  categoryId: string
  amount: string
  period: BudgetPeriod
  startDate: string
}

const EMPTY: FormState = {
  categoryId: '',
  amount: '',
  period: 'monthly',
  startDate: new Date().toISOString().slice(0, 10),
}

export default function Budget() {
  const budgets = useStore((s) => s.budgets)
  const categories = useStore((s) => s.categories)
  const transactions = useStore((s) => s.transactions)
  const addBudget = useStore((s) => s.addBudget)
  const updateBudget = useStore((s) => s.updateBudget)
  const deleteBudget = useStore((s) => s.deleteBudget)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BudgetType | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const getSpent = (budget: BudgetType) => {
    const now = new Date()
    const start = budget.period === 'monthly' ? startOfMonth(now) : startOfYear(now)
    const end = budget.period === 'monthly' ? endOfMonth(now) : endOfYear(now)
    return transactions
      .filter((t) => t.type === 'expense' && t.categoryId === budget.categoryId)
      .filter((t) => { const d = new Date(t.date); return d >= start && d <= end })
      .reduce((s, t) => s + t.amount, 0)
  }

  const open = (b?: BudgetType) => {
    if (b) {
      setEditing(b)
      setForm({ categoryId: b.categoryId, amount: String(b.amount), period: b.period, startDate: b.startDate })
    } else {
      setEditing(null)
      setForm(EMPTY)
    }
    setShowForm(true)
  }

  const close = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const save = () => {
    if (!form.categoryId || !form.amount) return
    const data = { categoryId: form.categoryId, amount: parseFloat(form.amount), period: form.period, startDate: form.startDate }
    if (editing) { updateBudget(editing.id, data) } else { addBudget(data) }
    close()
  }

  const remove = (id: string) => {
    if (confirm('Bu bütçeyi silmek istediğinizden emin misiniz?')) deleteBudget(id)
  }

  const budgetStats = useMemo(() => {
    return budgets.map((b) => ({ ...b, spent: getSpent(b) }))
  }, [budgets, transactions])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bütçe</h1>
        <LiquidButton
          size="sm"
          onClick={() => open()}
          className="text-sage-600 dark:text-sage-200 font-semibold"
        >
          <Plus className="w-4 h-4" /> Bütçe Ekle
        </LiquidButton>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 dark:bg-sage-900/20 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-sage-500" />
            </div>
            <p className="text-gray-500 dark:text-sage-400 text-sm">Henüz bütçe yok.</p>
            <p className="text-gray-400 dark:text-sage-600 text-xs mt-1">Harcama kategorileri için bütçe belirleyin.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {budgetStats.map(({ spent, ...budget }) => {
            const cat = categories.find((c) => c.id === budget.categoryId)
            const pct = Math.min((spent / budget.amount) * 100, 100)
            const over = spent > budget.amount
            const warn = !over && pct > 80
            const color = cat?.color ?? '#5F8575'

            return (
              <Card key={budget.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ backgroundColor: color + '18', boxShadow: `0 0 0 1px ${color}22` }}
                      >
                        {cat?.icon
                          ? <span className="text-base leading-none">{cat.icon}</span>
                          : <Package size={16} className="text-sage-400" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{cat?.name ?? 'Bilinmiyor'}</p>
                        <p className="text-xs text-gray-400 dark:text-sage-500 mt-0.5">{budget.period === 'monthly' ? 'Aylık bütçe' : 'Yıllık bütçe'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {over ? (
                        <AlertTriangle size={14} className="text-red-500 mr-1" />
                      ) : !warn ? (
                        <CheckCircle size={14} className="text-emerald-500 mr-1" />
                      ) : null}
                      <button
                        onClick={() => open(budget)}
                        aria-label="Düzenle"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-sage-600 dark:hover:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => remove(budget.id)}
                        aria-label="Sil"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className={`text-sm font-semibold ${over ? 'text-red-600 dark:text-red-400' : warn ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-sage-300'}`}>
                        {formatCurrency(spent)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-sage-500">/ {formatCurrency(budget.amount)} · %{pct.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-sage-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: over
                            ? 'linear-gradient(90deg, #ef4444, #f97316)'
                            : warn
                            ? 'linear-gradient(90deg, #eab308, #f97316)'
                            : `linear-gradient(90deg, ${color}, ${color}cc)`,
                        }}
                      />
                    </div>
                    <p className={`text-xs ${over ? 'text-red-500' : warn ? 'text-amber-500' : 'text-gray-400 dark:text-sage-500'}`}>
                      {over
                        ? `${formatCurrency(spent - budget.amount)} bütçe aşıldı`
                        : `${formatCurrency(budget.amount - spent)} kaldı`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={showForm} onClose={close} title={editing ? 'Bütçe Düzenle' : 'Yeni Bütçe'}>
        <div className="space-y-4">
          <Select
            label="Kategori"
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          >
            <option value="">Kategori seçin</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </Select>

          <Input
            label="Bütçe Tutarı (₺)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0,00"
          />

          <Select
            label="Dönem"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value as BudgetPeriod }))}
          >
            <option value="monthly">Aylık</option>
            <option value="yearly">Yıllık</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={close} className="flex-1">İptal</Button>
            <Button onClick={save} className="flex-1">Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
