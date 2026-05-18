import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Tag, PieChart, BarChart3, Settings, Sparkles, Zap, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Özet' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'İşlemler' },
  { to: '/categories', icon: Tag, label: 'Kategoriler' },
  { to: '/budget', icon: PieChart, label: 'Bütçe' },
  { to: '/reports', icon: BarChart3, label: 'Raporlar' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Ayarlar' },
];

export function Sidebar() {
  const { user, signOut } = useAuth()
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/95 dark:bg-sage-950/95 backdrop-blur-xl border-r border-gray-200/60 dark:border-sage-800/60 min-h-screen shadow-xl shadow-gray-200/40 dark:shadow-none relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sage-50/30 via-transparent to-sage-50/20 dark:from-sage-900/20 dark:via-transparent dark:to-sage-900/10 pointer-events-none" />

      {/* Logo */}
      <div className="relative px-5 py-6 border-b border-gray-100/80 dark:border-sage-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 flex items-center justify-center shadow-lg shadow-sage-400/40 dark:shadow-sage-900/60">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-sage-950 shadow-sm" />
          </div>
          <div>
            <span className="font-extrabold text-base text-gray-900 dark:text-white tracking-tight">Finansal</span>
            <span className="block text-[10px] text-sage-500 dark:text-sage-300 font-semibold tracking-wider uppercase">Takip Pro</span>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-sage-100 dark:bg-sage-900/40 rounded-full">
              <Zap size={9} className="text-sage-500 dark:text-sage-400" />
              <span className="text-[9px] font-bold text-sage-600 dark:text-sage-400 uppercase tracking-wide">Pro</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 px-3 pt-4 space-y-0.5">
        <p className="px-3 mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400/80 dark:text-sage-600">Ana Menü</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-sage-400 to-sage-500 text-white shadow-md shadow-sage-400/30 dark:shadow-sage-900/40'
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
                {isActive && (
                  <span className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative px-3 pb-5 border-t border-gray-100/80 dark:border-sage-800/80 pt-3 space-y-0.5">
        <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400/80 dark:text-sage-600">Sistem</p>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-sage-400 to-sage-500 text-white shadow-md shadow-sage-400/30 dark:shadow-sage-900/40'
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
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {user && (
          <p className="px-3 pt-2 pb-1 text-[10px] text-gray-400/70 dark:text-sage-600 truncate">{user.email}</p>
        )}
        <button
          onClick={signOut}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500/80 dark:text-red-400/80 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg text-red-400/70 group-hover:text-red-500 group-hover:bg-red-100/60 dark:group-hover:bg-red-900/30 transition-all duration-200">
            <LogOut size={16} />
          </span>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
