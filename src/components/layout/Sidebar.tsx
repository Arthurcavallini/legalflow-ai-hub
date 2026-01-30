import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wallet,
  UserCog,
  FileText,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scale,
  Package,
  Gavel,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Intimações', icon: Gavel, path: '/intimacoes', badge: 3 },
  { label: 'CRM', icon: FolderKanban, path: '/crm' },
  { label: 'Produção', icon: FolderKanban, path: '/production' },
  { label: 'Clientes', icon: Users, path: '/clients' },
  { label: 'Financeiro', icon: Wallet, path: '/financial' },
  { label: 'Contratos', icon: FileText, path: '/contracts' },
  { label: 'Serviços', icon: Package, path: '/services' },
  { label: 'Equipe', icon: UserCog, path: '/team' },
  { label: 'Calendário', icon: Calendar, path: '/calendar' },
];

interface SidebarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({ isDark, onToggleTheme, collapsed, onToggleCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 shadow-sm',
        collapsed ? 'w-[72px]' : 'w-60'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Scale className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold text-foreground">
                ADV360
              </span>
            )}
          </div>
          <button
            onClick={onToggleCollapsed}
            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 py-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-8 bg-secondary border-0 text-sm h-8 rounded-lg placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto",
          collapsed ? "px-2 py-2 space-y-1" : "px-2 py-1 space-y-0.5"
        )}>
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center rounded-lg text-sm transition-all duration-150 relative',
                  collapsed 
                    ? 'justify-center w-10 h-10 mx-auto' 
                    : 'gap-2.5 px-2.5 py-2',
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary font-normal'
                )}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full",
                        isActive 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : "bg-primary text-primary-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground border-2 border-card">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-3 border-t border-border space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm w-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
            {!collapsed && (
              <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            )}
          </button>

          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
              location.pathname === '/settings' 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary font-normal'
            )}
          >
            <Settings className="w-[18px] h-[18px]" />
            {!collapsed && <span>Configurações</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
