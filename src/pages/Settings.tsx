import { LogOut, DollarSign, User, AlertTriangle, ChevronRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'

const CURRENCIES = [
  { code: 'TRY', label: 'Türk Lirası (₺)' },
  { code: 'USD', label: 'Amerikan Doları ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'İngiliz Sterlini (£)' },
]

export default function Settings() {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const { user, signOut } = useAuth()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ayarlar</h1>
        <p className="text-sm text-gray-500 dark:text-sage-400 mt-1">Uygulama tercihlerinizi özelleştirin</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
              <User className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Hesap</h2>
              <p className="text-xs text-gray-500 dark:text-sage-500">Oturum bilgileri</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="px-4 py-3 bg-gray-50 dark:bg-sage-800/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-sage-500 mb-0.5">Giriş yapılan hesap</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer group w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
            <ChevronRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Para Birimi</h2>
              <p className="text-xs text-gray-500 dark:text-sage-500">Tüm işlemlerde kullanılacak birim</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select
            label="Para Birimi"
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Tehlikeli Alan</h2>
              <p className="text-xs text-gray-500 dark:text-sage-500">Geri alınamaz işlemler</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/40 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Tüm işlem, kategori ve bütçe verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Tüm veriler silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
                alert('Bu özellik yakında eklenecek.')
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <AlertTriangle className="w-4 h-4" />
            Tüm Verileri Sil
            <ChevronRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
