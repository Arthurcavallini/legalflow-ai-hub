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
  Building2,
  Scale,
  Package,
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
  { label: 'CRM', icon: FolderKanban, path: '/crm' },
  { label: 'Produção', icon: FolderKanban, path: '/production' },
  { label: 'Clientes', icon: Users, path: '/clients' },
  { label: 'Financeiro', icon: Wallet, path: '/financial' },
  { label: 'Contratos', icon: FileText, path: '/contracts' },
  { label: 'Serviços', icon: Package, path: '/services' },
  { label: 'Equipe', icon: UserCog, path: '/team' },
  { label: 'Calendário', icon: Calendar, path: '/calendar' },
];

const offices = [
  { id: '1', name: 'Escritório SP', slug: 'sp' },
  { id: '2', name: 'Escritório RJ', slug: 'rj' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(offices[0]);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-accent-foreground">
                LexFlow
              </span>
            )}
          </div>
        </div>

        {/* Office Selector */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent cursor-pointer hover:bg-sidebar-accent/80 transition-colors">
              <Building2 className="w-4 h-4 text-sidebar-foreground/70" />
              <span className="text-sm font-medium text-sidebar-foreground">
                {selectedOffice.name}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-item relative',
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings & Collapse */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <NavLink
            to="/settings"
            className={cn(
              'nav-item',
              location.pathname === '/settings' ? 'nav-item-active' : 'nav-item-inactive'
            )}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Configurações</span>}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item nav-item-inactive w-full mt-2"
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
