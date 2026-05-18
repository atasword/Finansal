import { useState } from 'react';
import { Plus, Menu, X, Sparkles, Zap, LayoutDashboard, ArrowLeftRight, Tag, PieChart, BarChart3, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Özet' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'İşlemler' },
  { to: '/categories', icon: Tag, label: 'Kategoriler' },
  { to: '/budget', icon: PieChart, label: 'Bütçe' },
  { to: '/reports', icon: BarChart3, label: 'Raporlar' },
  { to: '/settings', icon: Settings, label: 'Ayarlar' },
];

export function Header() {
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 bg-white/80 dark:bg-sage-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-sage-800/60 shadow-sm shadow-gray-100/50 dark:shadow-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-sage-800/80 transition-all duration-150 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 flex items-center justify-center shadow-md shadow-sage-300/40">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-extrabold text-sm text-gray-900 dark:text-white tracking-tight">Finansal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LiquidButton
            size="sm"
            onClick={() => setShowForm(true)}
            className="text-sage-600 dark:text-sage-200 font-semibold"
          >
            <Plus size={15} />
            İşlem Ekle
          </LiquidButton>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={cn('md:hidden fixed inset-0 z-50 flex transition-all duration-300', menuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
          {/* Backdrop */}
          <div
            className={cn('absolute inset-0 bg-sage-950/50 backdrop-blur-sm transition-opacity duration-300', menuOpen ? 'opacity-100' : 'opacity-0')}
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer panel */}
          <aside className={cn('relative w-72 max-w-[85vw] h-full bg-white dark:bg-sage-950 shadow-2xl flex flex-col transition-transform duration-300 ease-out', menuOpen ? 'translate-x-0' : '-translate-x-full')}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-sage-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 flex items-center justify-center shadow-lg shadow-sage-400/40">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-sage-950" />
                </div>
                <div>
                  <span className="font-extrabold text-base text-gray-900 dark:text-white tracking-tight">Finansal</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-sage-500 dark:text-sage-300 font-semibold tracking-wider uppercase">Takip Pro</span>
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-sage-100 dark:bg-sage-900/40 rounded-full ml-1">
                      <Zap size={8} className="text-sage-500" />
                      <span className="text-[8px] font-bold text-sage-600 dark:text-sage-400 uppercase">Pro</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-sage-200 hover:bg-gray-100 dark:hover:bg-sage-800 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto">
              <p className="px-3 mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400/80 dark:text-sage-600">Ana Menü</p>
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-sage-400 to-sage-500 text-white shadow-md shadow-sage-400/30'
                        : 'text-gray-500 dark:text-sage-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-sage-800/60'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-gray-400 dark:text-sage-500 group-hover:text-gray-600 dark:group-hover:text-sage-300 group-hover:bg-gray-200/60 dark:group-hover:bg-sage-700/60'
                      )}>
                        <Icon size={16} />
                      </span>
                      <span className={isActive ? 'text-white font-semibold' : ''}>{label}</span>
                      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User footer */}
            <div className="px-4 py-4 border-t border-gray-100 dark:border-sage-800">
              {user && (
                <p className="text-[10px] text-gray-400 dark:text-sage-600 truncate mb-2 px-1">{user.email}</p>
              )}
              <button
                onClick={() => { setMenuOpen(false); signOut() }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} />
                Çıkış Yap
              </button>
            </div>
          </aside>
      </div>

      <TransactionForm open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
export default Header;
