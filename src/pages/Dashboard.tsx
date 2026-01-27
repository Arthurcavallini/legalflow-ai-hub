import { MainLayout } from '@/components/layout/MainLayout';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Users, 
  AlertTriangle, 
  Gavel, 
  TrendingUp,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  Target
} from 'lucide-react';
import { mockDashboardMetrics, mockTasks, mockLeads, mockCourtNotifications, mockClients, mockTeamMembers, mockPayments } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  const pendingTasks = mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const pendingNotifications = mockCourtNotifications.filter(n => n.status === 'pending');
  const completedTasks = mockTasks.filter(t => t.status === 'completed');
  
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

  const taskCompletionRate = Math.round((completedTasks.length / mockTasks.length) * 100);
  const conversionRate = mockDashboardMetrics.conversionRate;

  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do escritório">
      <div className="space-y-6 animate-fade-in">
        {/* Top Row - Key Metrics with Gauges */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          {/* Main Revenue Card with Gauge */}
          <div className="lg:col-span-2 metric-card metric-card-highlight glow-primary p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-2 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)',
                    }}
                  >
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Receita do Mês</span>
                </div>
                <p className="metric-number-gold">{formatCurrency(mockDashboardMetrics.monthlyRevenue)}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-success text-sm font-semibold">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+12%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                </div>
              </div>
              <CircularGauge
                value={75}
                max={100}
                size={140}
                label="75%"
                sublabel="da meta"
                variant="primary"
              />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="metric-card p-6">
            <div className="flex flex-col items-center text-center">
              <CircularGauge
                value={conversionRate}
                max={100}
                size={100}
                label={`${conversionRate}%`}
                sublabel=""
                variant="success"
              />
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">Taxa de Conversão</p>
                <p className="text-xs text-muted-foreground">Leads → Clientes</p>
              </div>
            </div>
          </div>

          {/* Task Completion */}
          <div className="metric-card p-6">
            <div className="flex flex-col items-center text-center">
              <CircularGauge
                value={taskCompletionRate}
                max={100}
                size={100}
                label={`${taskCompletionRate}%`}
                sublabel=""
                variant="primary"
              />
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">Tarefas Concluídas</p>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Quick Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* A Receber */}
          <div className="metric-card metric-card-warning p-5">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)',
                }}
              >
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">A Receber</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(totalPending)}</p>
          </div>

          {/* Clientes Ativos */}
          <div className="metric-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)',
                }}
              >
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Clientes</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{mockDashboardMetrics.activeClients}</p>
              <div className="flex items-center gap-1 text-success text-xs font-semibold">
                <UserPlus className="w-3 h-3" />
                <span>+8</span>
              </div>
            </div>
          </div>

          {/* Novos Leads */}
          <div className="metric-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)',
                }}
              >
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Novos Leads</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{mockDashboardMetrics.totalLeads}</p>
              <span className="text-xs text-muted-foreground">este mês</span>
            </div>
          </div>

          {/* Contratos */}
          <div className="metric-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)',
                }}
              >
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Contratos</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">23</p>
              <span className="text-xs text-success font-medium">5 novos</span>
            </div>
          </div>
        </div>

        {/* Third Row - Alerts */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Tarefas Atrasadas */}
          <div className={cn(
            "metric-card p-5",
            overdueTasks.length > 0 && "metric-card-danger"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl"
                  style={{
                    background: overdueTasks.length > 0 
                      ? 'linear-gradient(135deg, hsl(0, 72%, 51% / 0.2) 0%, hsl(0, 72%, 51% / 0.05) 100%)'
                      : 'linear-gradient(135deg, hsl(30, 15%, 15% / 0.5) 0%, hsl(30, 15%, 10% / 0.5) 100%)',
                  }}
                >
                  <AlertTriangle className={cn(
                    "w-5 h-5",
                    overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Tarefas Atrasadas</p>
                  <p className="text-xs text-muted-foreground">Requer atenção</p>
                </div>
              </div>
              <p className={cn(
                "text-3xl font-bold",
                overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {overdueTasks.length}
              </p>
            </div>
            {overdueTasks.length > 0 && (
              <div className="space-y-2">
                {overdueTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-xs truncate flex-1">{task.title}</span>
                    <span className="text-xs text-destructive font-medium ml-2">Atrasada</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Novas Intimações */}
          <div className={cn(
            "metric-card p-5",
            pendingNotifications.length > 0 && "metric-card-warning"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl"
                  style={{
                    background: pendingNotifications.length > 0
                      ? 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)'
                      : 'linear-gradient(135deg, hsl(30, 15%, 15% / 0.5) 0%, hsl(30, 15%, 10% / 0.5) 100%)',
                  }}
                >
                  <Gavel className={cn(
                    "w-5 h-5",
                    pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Novas Intimações</p>
                  <p className="text-xs text-muted-foreground">Aguardando análise</p>
                </div>
              </div>
              <p className={cn(
                "text-3xl font-bold",
                pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
              )}>
                {pendingNotifications.length}
              </p>
            </div>
            {pendingNotifications.length > 0 && (
              <div className="space-y-2">
                {pendingNotifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-xs truncate flex-1">{notif.type}</span>
                    <span className="text-xs text-warning font-medium ml-2">Nova</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tarefas Pendentes */}
          <div className="metric-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(36, 100%, 50% / 0.05) 100%)',
                  }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Tarefas Pendentes</p>
                  <p className="text-xs text-muted-foreground">Em andamento</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {pendingTasks.length}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Em progresso: {mockTasks.filter(t => t.status === 'in_progress').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fourth Row - Team & Clients */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team Performance */}
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Produtividade da Equipe</h3>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Esta semana</span>
            </div>
            <div className="space-y-5">
              {mockTeamMembers.filter(m => m.status === 'active').slice(0, 5).map((member) => {
                const memberTasks = mockTasks.filter(t => t.assignedTo === member.id);
                const completed = member.tasksCompleted;
                const pending = memberTasks.filter(t => t.status !== 'completed').length;
                const overdue = memberTasks.filter(t => t.status === 'overdue').length;
                const progress = completed / (completed + pending) * 100 || 0;

                return (
                  <div key={member.id} className="flex items-center gap-4">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm"
                      style={{
                        background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(25, 80%, 45% / 0.1) 100%)',
                        color: 'hsl(36, 100%, 55%)',
                      }}
                    >
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <div className="flex items-center gap-3 text-xs">
                          {overdue > 0 && (
                            <span className="text-destructive font-semibold">{overdue} atrasada</span>
                          )}
                          <span className="text-muted-foreground">{completed} concluídas</span>
                        </div>
                      </div>
                      <ProgressBar value={progress} max={100} variant="primary" size="sm" />
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
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer hover:bg-secondary/50"
                  style={{
                    background: 'linear-gradient(135deg, hsl(20 14% 10%) 0%, hsl(20 14% 8%) 100%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm"
                      style={{
                        background: 'linear-gradient(135deg, hsl(36, 100%, 50% / 0.2) 0%, hsl(25, 80%, 45% / 0.1) 100%)',
                        color: 'hsl(36, 100%, 55%)',
                      }}
                    >
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
