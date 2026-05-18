import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { LayoutDashboard, ArrowLeftRight, Tag, PieChart, BarChart3, Settings, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ShaderBackground from '@/components/ui/shader-background'
import Dashboard from '@/pages/Dashboard'
import Transactions from '@/pages/Transactions'
import Categories from '@/pages/Categories'
import Budget from '@/pages/Budget'
import Reports from '@/pages/Reports'
import SettingsPage from '@/pages/Settings'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { useStore } from '@/store/useStore'

const mobileNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Özet' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'İşlemler' },
  { to: '/categories', icon: Tag, label: 'Kategoriler' },
  { to: '/budget', icon: PieChart, label: 'Bütçe' },
  { to: '/reports', icon: BarChart3, label: 'Raporlar' },
  { to: '/settings', icon: Settings, label: 'Ayarlar' },
]

function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/60 dark:border-gray-800/60">
      <div className="flex items-center justify-around px-1 py-1">
        {mobileNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl transition-colors flex-1',
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-gray-400 dark:text-gray-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200',
                  isActive && 'bg-violet-100 dark:bg-violet-900/40'
                )}>
                  <Icon size={18} />
                </div>
                <span className="text-[9px] font-semibold truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-transparent">
      <ShaderBackground />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-6 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()
  const loadUserData = useStore((s) => s.loadUserData)
  const resetStore = useStore((s) => s.resetStore)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    if (user) {
      loadUserData(user.id)
    } else if (!loading) {
      resetStore()
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <ShaderBackground />
        <Loader2 size={32} className="text-violet-400 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <ShaderBackground />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
      <Route path="/categories" element={<Layout><Categories /></Layout>} />
      <Route path="/budget" element={<Layout><Budget /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
