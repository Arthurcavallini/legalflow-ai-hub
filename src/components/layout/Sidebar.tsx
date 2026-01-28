import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';

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
}

export function Sidebar({ isDark, onToggleTheme }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shadow-lg shadow-primary/30">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                LexFlow
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-9 bg-sidebar-accent border-sidebar-border text-sm h-9 rounded-xl focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-primary-foreground"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full",
                        isActive 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : "bg-primary/20 text-primary"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-primary text-primary-foreground animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Theme Toggle & Settings */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-3">
          {/* Theme Toggle */}
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sidebar-accent">
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon className="w-4 h-4 text-primary" />
                ) : (
                  <Sun className="w-4 h-4 text-warning" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isDark ? 'Modo Escuro' : 'Modo Claro'}
                </span>
              </div>
              <Switch 
                checked={isDark}
                onCheckedChange={onToggleTheme}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}

          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              location.pathname === '/settings' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
            )}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Configurações</span>}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
