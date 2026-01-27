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
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NotificationStatus = 'pending' | 'acknowledged';

export default function Intimacoes() {
  const [filter, setFilter] = useState<NotificationStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusConfig = (status: NotificationStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', color: 'bg-warning/20 text-warning', icon: Clock };
      case 'acknowledged':
        return { label: 'Analisado', color: 'bg-success/20 text-success', icon: CheckCircle2 };
      default:
        return { label: 'Pendente', color: 'bg-warning/20 text-warning', icon: Clock };
    }
  };

  const pendingCount = mockCourtNotifications.filter(n => n.status === 'pending').length;
  const acknowledgedCount = mockCourtNotifications.filter(n => n.status === 'acknowledged').length;

  return (
    <MainLayout title="Intimações" subtitle="Notificações do Diário Oficial">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div 
            onClick={() => setFilter('pending')}
            className={cn(
              "metric-card p-5 cursor-pointer transition-all",
              filter === 'pending' && "ring-2 ring-warning"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-warning/20">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning/30" />
            </div>
          </div>

          <div 
            onClick={() => setFilter('acknowledged')}
            className={cn(
              "metric-card p-5 cursor-pointer transition-all",
              filter === 'acknowledged' && "ring-2 ring-success"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-success/20">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Analisadas</p>
                  <p className="text-3xl font-bold text-foreground">{acknowledgedCount}</p>
                </div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success/30" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente, processo ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-secondary border-0 rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="rounded-xl"
            >
              Todas
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
              className="rounded-xl"
            >
              Pendentes
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const daysUntil = getDaysUntilDeadline(notification.deadline);
            const isUrgent = daysUntil <= 3 && notification.status === 'pending';
            const statusConfig = getStatusConfig(notification.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={notification.id}
                className={cn(
                  "metric-card p-5 transition-all hover:shadow-lg cursor-pointer",
                  isUrgent && "border-destructive/50 bg-destructive/5"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left: Icon & Type */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "p-3 rounded-xl",
                      isUrgent ? "bg-destructive/20" : "bg-primary/20"
                    )}>
                      <Gavel className={cn(
                        "w-6 h-6",
                        isUrgent ? "text-destructive" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "status-badge",
                          statusConfig.color
                        )}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {notification.clientName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 lg:items-center">
                    {/* Process Number */}
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-mono text-xs">
                        {notification.processNumber}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className={cn(
                        "font-medium",
                        isUrgent ? "text-destructive" : "text-foreground"
                      )}>
                        {daysUntil > 0 ? `${daysUntil} dias` : daysUntil === 0 ? 'Hoje!' : `${Math.abs(daysUntil)}d atraso`}
                      </span>
                    </div>

                    {/* Assigned */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {getAssigneeName(notification.assignedTo).split(' ')[0]}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90">
                        Analisar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="metric-card p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Gavel className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma intimação encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tente ajustar sua busca' : 'Não há intimações com este status'}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}