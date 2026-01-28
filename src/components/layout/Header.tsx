import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockNotifications, mockCourtNotifications } from '@/data/mockData';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;
  const pendingNotifications = mockCourtNotifications.filter(n => n.status === 'pending');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg hover:bg-secondary">
              <Bell className="w-4 h-4" />
              {(unreadNotifications + pendingNotifications.length) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                  {unreadNotifications + pendingNotifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover border-border shadow-lg">
            <DropdownMenuLabel className="font-semibold text-sm">Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {mockNotifications.slice(0, 4).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  <span className="font-medium text-sm">{notification.title}</span>
                </div>
                <span className="text-xs text-muted-foreground pl-3.5">
                  {notification.message}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer font-medium text-sm">
              Ver todas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Action */}
        <Button size="sm" className="gap-1.5 h-8 bg-primary hover:bg-primary/90 rounded-lg text-xs font-medium">
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Novo</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-lg p-0">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/placeholder.svg" alt="Usuário" />
                <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground rounded-lg">
                  DR
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Dr. Ricardo Silva</span>
                <span className="text-xs font-normal text-muted-foreground">
                  ricardo@escritorio.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-sm">Meu perfil</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">Configurações</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-destructive cursor-pointer text-sm">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
