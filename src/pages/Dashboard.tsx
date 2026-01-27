import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Users, 
  MessageSquare, 
  ListTodo, 
  AlertTriangle, 
  Gavel, 
  TrendingUp,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { mockDashboardMetrics, mockTasks, mockLeads, mockCourtNotifications, mockClients, mockTeamMembers, mockPayments } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  const pendingTasks = mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const pendingNotifications = mockCourtNotifications.filter(n => n.status === 'pending');
  
  const totalReceived = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do escritório">
      <div className="space-y-6">
        {/* Big Numbers Row */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* Receita */}
          <div className="metric-card metric-card-highlight glow-primary p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-success text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {formatCurrency(mockDashboardMetrics.monthlyRevenue)}
            </p>
            <p className="text-sm text-muted-foreground">Receita do mês</p>
          </div>

          {/* A Receber */}
          <div className="metric-card metric-card-warning p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Pendente</span>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {formatCurrency(totalPending)}
            </p>
            <p className="text-sm text-muted-foreground">A receber</p>
          </div>

          {/* Clientes Ativos */}
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-secondary">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-success text-sm font-semibold">
                <UserPlus className="w-4 h-4" />
                <span>+8</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {mockDashboardMetrics.activeClients}
            </p>
            <p className="text-sm text-muted-foreground">Clientes ativos</p>
          </div>

          {/* Leads */}
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-secondary">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-success text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>{mockDashboardMetrics.conversionRate}%</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {mockDashboardMetrics.totalLeads}
            </p>
            <p className="text-sm text-muted-foreground">Novos leads</p>
          </div>
        </div>

        {/* Alert Cards Row */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Tarefas Atrasadas */}
          <div className={cn(
            "metric-card p-6",
            overdueTasks.length > 0 && "metric-card-danger glow-danger"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-3 rounded-xl",
                  overdueTasks.length > 0 ? "bg-destructive/20" : "bg-secondary"
                )}>
                  <AlertTriangle className={cn(
                    "w-6 h-6",
                    overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Tarefas Atrasadas</p>
                  <p className="text-xs text-muted-foreground">Requer atenção</p>
                </div>
              </div>
              <p className={cn(
                "text-4xl font-bold",
                overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {overdueTasks.length}
              </p>
            </div>
            {overdueTasks.length > 0 && (
              <div className="space-y-2">
                {overdueTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-sm truncate">{task.title}</span>
                    <span className="text-xs text-destructive font-medium">Atrasada</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Intimações Pendentes */}
          <div className={cn(
            "metric-card p-6",
            pendingNotifications.length > 0 && "metric-card-warning"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-3 rounded-xl",
                  pendingNotifications.length > 0 ? "bg-warning/20" : "bg-secondary"
                )}>
                  <Gavel className={cn(
                    "w-6 h-6",
                    pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Novas Intimações</p>
                  <p className="text-xs text-muted-foreground">Aguardando análise</p>
                </div>
              </div>
              <p className={cn(
                "text-4xl font-bold",
                pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
              )}>
                {pendingNotifications.length}
              </p>
            </div>
            {pendingNotifications.length > 0 && (
              <div className="space-y-2">
                {pendingNotifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-sm truncate">{notif.type}</span>
                    <span className="text-xs text-warning font-medium">Nova</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tarefas Pendentes */}
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary">
                  <ListTodo className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Tarefas Pendentes</p>
                  <p className="text-xs text-muted-foreground">Em andamento</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {pendingTasks.length}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Em progresso: {mockTasks.filter(t => t.status === 'in_progress').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">A fazer: {mockTasks.filter(t => t.status === 'pending').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team Tasks */}
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Produtividade da Equipe</h3>
              <span className="text-xs text-muted-foreground">Esta semana</span>
            </div>
            <div className="space-y-4">
              {mockTeamMembers.filter(m => m.status === 'active').slice(0, 5).map((member) => {
                const memberTasks = mockTasks.filter(t => t.assignedTo === member.id);
                const completed = member.tasksCompleted;
                const pending = memberTasks.filter(t => t.status !== 'completed').length;
                const overdue = memberTasks.filter(t => t.status === 'overdue').length;
                const progress = completed / (completed + pending) * 100 || 0;

                return (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-sm">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <div className="flex items-center gap-3 text-xs">
                          {overdue > 0 && (
                            <span className="text-destructive font-semibold">{overdue} atrasada</span>
                          )}
                          <span className="text-muted-foreground">{completed} concluídas</span>
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Clientes Recentes</h3>
              <a href="/clients" className="text-sm text-primary hover:underline">Ver todos</a>
            </div>
            <div className="space-y-3">
              {mockClients.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-sm">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    client.status === 'active' 
                      ? "bg-success/20 text-success" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}