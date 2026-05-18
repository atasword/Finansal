import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Transaction, Category, Budget, AppSettings } from '@/types'

const DEFAULT_CATEGORIES_TEMPLATE = [
  { name: 'Maaş', type: 'income' as const, icon: '💼', color: '#10B981' },
  { name: 'Freelance', type: 'income' as const, icon: '💻', color: '#6366F1' },
  { name: 'Yatırım Geliri', type: 'income' as const, icon: '📈', color: '#F59E0B' },
  { name: 'Kira Geliri', type: 'income' as const, icon: '🏠', color: '#8B5CF6' },
  { name: 'Diğer Gelir', type: 'income' as const, icon: '💰', color: '#14B8A6' },
  { name: 'Yiyecek', type: 'expense' as const, icon: '🍔', color: '#EF4444' },
  { name: 'Ulaşım', type: 'expense' as const, icon: '🚗', color: '#F97316' },
  { name: 'Kira', type: 'expense' as const, icon: '🏢', color: '#EC4899' },
  { name: 'Fatura', type: 'expense' as const, icon: '⚡', color: '#EAB308' },
  { name: 'Eğlence', type: 'expense' as const, icon: '🎮', color: '#A855F7' },
  { name: 'Sağlık', type: 'expense' as const, icon: '🏥', color: '#06B6D4' },
  { name: 'Eğitim', type: 'expense' as const, icon: '📚', color: '#3B82F6' },
  { name: 'Alışveriş', type: 'expense' as const, icon: '🛒', color: '#F43F5E' },
  { name: 'Diğer Gider', type: 'expense' as const, icon: '📦', color: '#6B7280' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTransaction(row: any): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    categoryId: row.category_id,
    date: row.date,
    description: row.description ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    isRecurring: row.is_recurring ?? undefined,
    recurringPeriod: row.recurring_period ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
    isDefault: row.is_default,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBudget(row: any): Budget {
  return {
    id: row.id,
    categoryId: row.category_id,
    amount: Number(row.amount),
    period: row.period,
    startDate: row.start_date,
  }
}

async function seedDefaultCategories(userId: string): Promise<Category[]> {
  const rows = DEFAULT_CATEGORIES_TEMPLATE.map((c) => ({
    id: crypto.randomUUID(),
    user_id: userId,
    name: c.name,
    type: c.type,
    icon: c.icon,
    color: c.color,
    is_default: true,
  }))
  const { data, error } = await supabase.from('categories').insert(rows).select()
  if (error) throw error
  return (data ?? []).map(mapCategory)
}

interface StoreState {
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  settings: AppSettings
  isLoading: boolean
  userId: string | null

  loadUserData: (userId: string) => Promise<void>
  resetStore: () => void

  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  addCategory: (c: Omit<Category, 'id' | 'isDefault'>) => Promise<void>
  updateCategory: (id: string, c: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  addBudget: (b: Omit<Budget, 'id'>) => Promise<void>
  updateBudget: (id: string, b: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>

  updateSettings: (s: Partial<AppSettings>) => void
}

export const useStore = create<StoreState>()((set, get) => ({
  transactions: [],
  categories: [],
  budgets: [],
  settings: { currency: 'TRY', darkMode: 'dark' },
  isLoading: false,
  userId: null,

  loadUserData: async (userId) => {
    set({ isLoading: true, userId })
    try {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('name')

      let categories: Category[] = (catData ?? []).map(mapCategory)
      if (categories.length === 0) {
        categories = await seedDefaultCategories(userId)
      }

      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)

      set({
        categories,
        transactions: (txData ?? []).map(mapTransaction),
        budgets: (budgetData ?? []).map(mapBudget),
        isLoading: false,
      })
    } catch (err) {
      console.error('loadUserData error:', err)
      set({ isLoading: false })
    }
  },

  resetStore: () => set({
    transactions: [],
    categories: [],
    budgets: [],
    isLoading: false,
    userId: null,
  }),

  addTransaction: async (t) => {
    const userId = get().userId
    if (!userId) return
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const newTx: Transaction = { ...t, id, createdAt: now, updatedAt: now }
    set((s) => ({ transactions: [newTx, ...s.transactions] }))
    await supabase.from('transactions').insert({
      id, user_id: userId,
      type: t.type, amount: t.amount, category_id: t.categoryId,
      date: t.date, description: t.description ?? null,
      payment_method: t.paymentMethod ?? null,
      is_recurring: t.isRecurring ?? false,
      recurring_period: t.recurringPeriod ?? null,
      created_at: now, updated_at: now,
    })
  },

  updateTransaction: async (id, t) => {
    const userId = get().userId
    if (!userId) return
    const now = new Date().toISOString()
    set((s) => ({
      transactions: s.transactions.map((tr) =>
        tr.id === id ? { ...tr, ...t, updatedAt: now } : tr
      ),
    }))
    await supabase.from('transactions').update({
      ...(t.type !== undefined && { type: t.type }),
      ...(t.amount !== undefined && { amount: t.amount }),
      ...(t.categoryId !== undefined && { category_id: t.categoryId }),
      ...(t.date !== undefined && { date: t.date }),
      ...(t.description !== undefined && { description: t.description }),
      ...(t.paymentMethod !== undefined && { payment_method: t.paymentMethod }),
      ...(t.isRecurring !== undefined && { is_recurring: t.isRecurring }),
      ...(t.recurringPeriod !== undefined && { recurring_period: t.recurringPeriod }),
      updated_at: now,
    }).eq('id', id).eq('user_id', userId)
  },

  deleteTransaction: async (id) => {
    const userId = get().userId
    if (!userId) return
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }))
    await supabase.from('transactions').delete().eq('id', id).eq('user_id', userId)
  },

  addCategory: async (c) => {
    const userId = get().userId
    if (!userId) return
    const id = crypto.randomUUID()
    const newCat: Category = { ...c, id, isDefault: false }
    set((s) => ({ categories: [...s.categories, newCat] }))
    await supabase.from('categories').insert({
      id, user_id: userId,
      name: c.name, type: c.type, icon: c.icon, color: c.color,
      is_default: false,
    })
  },

  updateCategory: async (id, c) => {
    const userId = get().userId
    if (!userId) return
    set((s) => ({
      categories: s.categories.map((cat) => (cat.id === id ? { ...cat, ...c } : cat)),
    }))
    await supabase.from('categories').update({
      ...(c.name !== undefined && { name: c.name }),
      ...(c.icon !== undefined && { icon: c.icon }),
      ...(c.color !== undefined && { color: c.color }),
    }).eq('id', id).eq('user_id', userId)
  },

  deleteCategory: async (id) => {
    const userId = get().userId
    if (!userId) return
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
    await supabase.from('categories').delete().eq('id', id).eq('user_id', userId)
  },

  addBudget: async (b) => {
    const userId = get().userId
    if (!userId) return
    const id = crypto.randomUUID()
    const newBudget: Budget = { ...b, id }
    set((s) => ({ budgets: [...s.budgets, newBudget] }))
    await supabase.from('budgets').insert({
      id, user_id: userId,
      category_id: b.categoryId, amount: b.amount,
      period: b.period, start_date: b.startDate,
    })
  },

  updateBudget: async (id, b) => {
    const userId = get().userId
    if (!userId) return
    set((s) => ({
      budgets: s.budgets.map((bud) => (bud.id === id ? { ...bud, ...b } : bud)),
    }))
    await supabase.from('budgets').update({
      ...(b.categoryId !== undefined && { category_id: b.categoryId }),
      ...(b.amount !== undefined && { amount: b.amount }),
      ...(b.period !== undefined && { period: b.period }),
      ...(b.startDate !== undefined && { start_date: b.startDate }),
    }).eq('id', id).eq('user_id', userId)
  },

  deleteBudget: async (id) => {
    const userId = get().userId
    if (!userId) return
    set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) }))
    await supabase.from('budgets').delete().eq('id', id).eq('user_id', userId)
  },

  updateSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),
}))
