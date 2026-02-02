import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockCourtNotifications, mockTeamMembers } from '@/data/mockData';
import { 
  Gavel, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  User,
  FileText,
  ExternalLink,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IntimacaoDetailSheet } from '@/components/intimacoes/IntimacaoDetailSheet';

type NotificationStatus = 'pending' | 'acknowledged';

interface CourtNotification {
  id: string;
  processNumber: string;
  clientName: string;
  type: string;
  description: string;
  receivedAt: Date;
  deadline: Date;
  status: 'pending' | 'acknowledged';
  assignedTo: string;
}

export default function Intimacoes() {
  const [filter, setFilter] = useState<NotificationStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<CourtNotification | null>(null);

  const filteredNotifications = mockCourtNotifications.filter(n => {
    const matchesFilter = filter === 'all' || n.status === filter;
    const matchesSearch = n.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.processNumber.includes(searchTerm) ||
                         n.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getAssigneeName = (id: string) => {
    const member = mockTeamMembers.find(m => m.id === id);
    return member?.name || 'Não atribuído';
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const pendingCount = mockCourtNotifications.filter(n => n.status === 'pending').length;
  const acknowledgedCount = mockCourtNotifications.filter(n => n.status === 'acknowledged').length;
  const urgentCount = mockCourtNotifications.filter(n => n.status === 'pending' && getDaysUntilDeadline(n.deadline) <= 3).length;

  return (
    <MainLayout title="Intimações" subtitle="Gestão de intimações judiciais">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-warning">{pendingCount}</p>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Analisadas</span>
            </div>
            <p className="text-2xl font-bold text-success">{acknowledgedCount}</p>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Urgentes</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{urgentCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-card p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search - Takes more space */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente, processo ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-sm bg-secondary/50 border-0"
              />
            </div>

            {/* Filter Buttons - Pill style */}
            <div className="flex gap-2 p-1 rounded-xl bg-secondary/50">
              <Button 
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-4 rounded-lg transition-all",
                  filter === 'all' 
                    ? "bg-card shadow-sm text-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                )}
                onClick={() => setFilter('all')}
              >
                Todas
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px] bg-muted">
                  {mockCourtNotifications.length}
                </Badge>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-4 rounded-lg transition-all",
                  filter === 'pending' 
                    ? "bg-card shadow-sm text-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                )}
                onClick={() => setFilter('pending')}
              >
                Pendentes
                <Badge variant="secondary" className={cn(
                  "ml-2 h-5 px-1.5 text-[10px]",
                  filter === 'pending' ? "bg-warning/20 text-warning" : "bg-muted"
                )}>
                  {pendingCount}
                </Badge>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-4 rounded-lg transition-all",
                  filter === 'acknowledged' 
                    ? "bg-card shadow-sm text-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                )}
                onClick={() => setFilter('acknowledged')}
              >
                Analisadas
                <Badge variant="secondary" className={cn(
                  "ml-2 h-5 px-1.5 text-[10px]",
                  filter === 'acknowledged' ? "bg-success/20 text-success" : "bg-muted"
                )}>
                  {acknowledgedCount}
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const daysUntil = getDaysUntilDeadline(notification.deadline);
            const isUrgent = daysUntil <= 3 && notification.status === 'pending';

            return (
              <div
                key={notification.id}
                className={cn(
                  "dashboard-card p-4 cursor-pointer",
                  isUrgent && "border-destructive/40"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left: Icon & Type */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isUrgent ? "bg-destructive/10" : "bg-primary/10"
                    )}>
                      <Gavel className={cn(
                        "w-5 h-5",
                        isUrgent ? "text-destructive" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs border",
                            notification.status === 'pending'
                              ? isUrgent
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          )}
                        >
                          {notification.status === 'pending' ? (isUrgent ? 'Urgente' : 'Pendente') : 'Analisada'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm mb-1">
                        {notification.clientName}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 lg:items-center">
                    <div className="flex items-center gap-2 text-xs">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground font-mono">
                        {notification.processNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className={cn(
                        "font-medium",
                        isUrgent ? "text-destructive" : "text-foreground"
                      )}>
                        {daysUntil > 0 ? `${daysUntil} dias` : daysUntil === 0 ? 'Hoje!' : `${Math.abs(daysUntil)}d atraso`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {getAssigneeName(notification.assignedTo).split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNotification(notification);
                        }}
                      >
                        Analisar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="dashboard-card p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Gavel className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma intimação encontrada
              </h3>
              <p className="text-muted-foreground text-sm">
                {searchTerm ? 'Tente ajustar sua busca' : 'Não há intimações com este status'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Intimação Detail Sheet */}
      <IntimacaoDetailSheet
        notification={selectedNotification}
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      />
    </MainLayout>
  );
}
