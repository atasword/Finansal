import { useState } from 'react'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'
import { useStore } from '@/store/useStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { Input } from '@/components/ui/Input'
import type { Category, TransactionType } from '@/types'

const EMOJI_OPTIONS = ['🍔','🚗','🏠','💡','🎬','🏥','📚','🛒','💼','💰','📈','🎁','🌍','🐾','🎵','✈️','🏋️','💇','🖥️','📱']
const COLOR_OPTIONS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b']

interface FormState {
  name: string
  type: TransactionType
  icon: string
  color: string
}

const EMPTY: FormState = { name: '', type: 'expense', icon: '📦', color: '#8b5cf6' }

export default function Categories() {
  const categories = useStore((s) => s.categories)
  const addCategory = useStore((s) => s.addCategory)
  const updateCategory = useStore((s) => s.updateCategory)
  const deleteCategory = useStore((s) => s.deleteCategory)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [tab, setTab] = useState<TransactionType>('expense')

  const open = (cat?: Category) => {
    if (cat) {
      setEditing(cat)
      setForm({ name: cat.name, type: cat.type, icon: cat.icon, color: cat.color })
    } else {
      setEditing(null)
      setForm({ ...EMPTY, type: tab })
    }
    setShowForm(true)
  }

  const close = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const save = () => {
    if (!form.name.trim()) return
    if (editing) { updateCategory(editing.id, form) } else { addCategory(form) }
    close()
  }

  const remove = (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) deleteCategory(id)
  }

  const displayed = categories.filter((c) => c.type === tab)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kategoriler</h1>
        <LiquidButton
          size="sm"
          onClick={() => open()}
          className="text-violet-700 dark:text-violet-200 font-semibold"
        >
          <Plus className="w-4 h-4" /> Kategori Ekle
        </LiquidButton>
      </div>

      <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit">
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
              tab === t ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t === 'expense' ? 'Gider' : 'Gelir'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayed.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200"
            style={{ borderLeftColor: cat.color, borderLeftWidth: 3 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: cat.color + '18', boxShadow: `0 0 0 1px ${cat.color}22` }}
            >
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{cat.name}</p>
              {cat.isDefault && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield size={10} className="text-gray-400" />
                  <p className="text-xs text-gray-400">Varsayılan</p>
                </div>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => open(cat)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
              >
                <Pencil size={13} />
              </button>
              {!cat.isDefault && (
                <button
                  onClick={() => remove(cat.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showForm} onClose={close} title={editing ? 'Kategori Düzenle' : 'Yeni Kategori'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  form.type === t
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {t === 'expense' ? 'Gider' : 'Gelir'}
              </button>
            ))}
          </div>

          <Input
            label="Kategori Adı"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Örn: Yiyecek"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İkon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setForm((f) => ({ ...f, icon: emoji }))}
                  className={`w-9 h-9 text-xl rounded-xl border-2 transition-all ${
                    form.icon === emoji
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-110'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Renk</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${
                    form.color === color ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={close} className="flex-1">İptal</Button>
            <LiquidButton
              size="lg"
              onClick={save}
              className="flex-1 text-emerald-700 dark:text-emerald-200 font-semibold"
            >
              Kaydet
            </LiquidButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
