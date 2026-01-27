import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
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
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Atendimento', icon: MessageSquare, path: '/inbox', badge: 5 },
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

export function Sidebar() {
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
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                LexFlow
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-item relative group',
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground animate-pulse-glow">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings & Collapse */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          <NavLink
            to="/settings"
            className={cn(
              'nav-item group',
              location.pathname === '/settings' ? 'nav-item-active' : 'nav-item-inactive'
            )}
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            {!collapsed && <span>Configurações</span>}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item nav-item-inactive w-full"
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