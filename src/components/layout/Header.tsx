import { Bell, Search, Plus, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockNotifications } from '@/data/mockData';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden lg:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-72 pl-9 pr-12 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
          />
          <div className="absolute right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Quick Actions */}
        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-secondary">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover border-border rounded-xl">
            <DropdownMenuLabel className="font-bold">Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.slice(0, 4).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 py-3 cursor-pointer rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                  <span className="font-medium text-sm">{notification.title}</span>
                </div>
                <span className="text-xs text-muted-foreground pl-4">
                  {notification.message}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer font-medium rounded-lg">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-secondary">
              <Avatar className="h-9 w-9 rounded-xl">
                <AvatarImage src="/placeholder.svg" alt="Usuário" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold rounded-xl">
                  DR
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-bold">Dr. Ricardo Silva</span>
                <span className="text-xs font-normal text-muted-foreground">
                  ricardo@escritorio.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg cursor-pointer">Meu perfil</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer">Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}