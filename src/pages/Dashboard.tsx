import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Users, 
  AlertTriangle, 
  Gavel, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  Target,
} from 'lucide-react';
import { mockDashboardMetrics, mockTasks, mockCourtNotifications, mockClients, mockTeamMembers, mockPayments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const revenueVsExpensesData = [
  { month: 'Jan', receita: 45000, despesa: 28000 },
  { month: 'Fev', receita: 52000, despesa: 31000 },
  { month: 'Mar', receita: 48000, despesa: 29000 },
  { month: 'Abr', receita: 61000, despesa: 35000 },
  { month: 'Mai', receita: 55000, despesa: 32000 },
  { month: 'Jun', receita: 67000, despesa: 38000 },
  { month: 'Jul', receita: 72000, despesa: 40000 },
];

export default function Dashboard() {
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  const pendingNotifications = mockCourtNotifications.filter(n => n.status === 'pending');
  
  // Mock data for closed clients this month
  const closedClientsThisMonth = 12;
  const closedClientsLastMonth = 9;
  const clientsPercentageChange = ((closedClientsThisMonth - closedClientsLastMonth) / closedClientsLastMonth * 100).toFixed(0);

  // Mock chats needing attention
  const chatsNeedingAttention = 5;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Team performance data
  const teamPerformance = mockTeamMembers.filter(m => m.status === 'active').map(member => ({
    ...member,
    assignedTasks: member.tasksPending + member.tasksCompleted,
    completedTasks: member.tasksCompleted,
    completionRate: Math.round((member.tasksCompleted / (member.tasksPending + member.tasksCompleted)) * 100) || 0
  }));

  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do escritório">
      <div className="space-y-6 animate-fade-in">
        {/* Top Row - Key Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          {/* Closed Clients */}
          <div className="metric-card metric-card-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Clientes Fechados</span>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Users className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{closedClientsThisMonth}</p>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              {Number(clientsPercentageChange) >= 0 ? (
                <>
                  <ArrowUpRight className="w-3 h-3 text-success" />
                  <span className="text-success">+{clientsPercentageChange}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-3 h-3 text-destructive" />
                  <span className="text-destructive">{clientsPercentageChange}%</span>
                </>
              )}
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className={cn(
            "metric-card",
            overdueTasks.length > 0 && "metric-card-danger"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Tarefas Atrasadas</span>
              <div className={cn(
                "p-1.5 rounded-lg",
                overdueTasks.length > 0 ? "bg-destructive/20" : "bg-muted"
              )}>
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              overdueTasks.length > 0 ? "text-destructive" : "text-foreground"
            )}>
              {overdueTasks.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Requer atenção imediata</p>
          </div>

          {/* New Intimations */}
          <div className={cn(
            "metric-card",
            pendingNotifications.length > 0 && "metric-card-warning"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Novas Intimações</span>
              <div className={cn(
                "p-1.5 rounded-lg",
                pendingNotifications.length > 0 ? "bg-warning/20" : "bg-muted"
              )}>
                <Gavel className={cn(
                  "w-4 h-4",
                  pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
                )} />
              </div>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              pendingNotifications.length > 0 ? "text-warning" : "text-foreground"
            )}>
              {pendingNotifications.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Aguardando análise</p>
          </div>

          {/* Chats Needing Attention */}
          <div className={cn(
            "metric-card",
            chatsNeedingAttention > 0 && "metric-card-primary"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Chats Pendentes</span>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">{chatsNeedingAttention}</p>
            <p className="text-xs text-muted-foreground mt-2">Precisam de resposta</p>
          </div>

          {/* Conversion Rate */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Taxa de Conversão</span>
              <div className="p-1.5 rounded-lg bg-success/20">
                <Target className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-success">{mockDashboardMetrics.conversionRate}%</p>
            <p className="text-xs text-muted-foreground mt-2">De leads para clientes</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Revenue vs Expenses Chart */}
          <div className="lg:col-span-2 dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Receita vs Despesas</h3>
                <p className="text-xs text-muted-foreground">Comparativo dos últimos 7 meses</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Receita</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-destructive/70" />
                  <span className="text-muted-foreground">Despesas</span>
                </span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueVsExpensesData}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    formatter={(value: number, name: string) => [formatCurrency(value), name === 'receita' ? 'Receita' : 'Despesas']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorReceita)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesa" 
                    stroke="hsl(0, 84%, 60%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDespesa)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-4">
            {/* Revenue Card */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Receita do Mês</p>
                  <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(mockDashboardMetrics.monthlyRevenue)}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-success text-xs font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12.5% vs mês anterior</span>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">A Receber</p>
                  <p className="text-2xl font-bold text-warning mt-1">
                    {formatCurrency(mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-warning/20">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">8 parcelas pendentes</p>
            </div>

            {/* Active Clients */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{mockDashboardMetrics.activeClients}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/20">
                  <Users className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-success text-xs font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8 este mês</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Desempenho da Equipe</h3>
              <p className="text-xs text-muted-foreground">Tarefas realizadas vs atribuídas</p>
            </div>
            <a href="/team" className="text-xs text-primary hover:underline">Ver todos</a>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teamPerformance.slice(0, 4).map((member) => (
              <div key={member.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Realizadas</span>
                    <span className="font-semibold text-success">{member.completedTasks}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Atribuídas</span>
                    <span className="font-semibold">{member.assignedTasks}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${member.completionRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Taxa de conclusão</span>
                    <span className="text-xs font-bold text-primary">{member.completionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Alerts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Overdue Tasks List */}
          <div className={cn(
            "dashboard-card",
            overdueTasks.length > 0 && "border-destructive/30"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  overdueTasks.length > 0 ? "bg-destructive/20" : "bg-muted"
                )}>
                  <AlertTriangle className={cn(
                    "w-5 h-5",
                    overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold">Tarefas Atrasadas</h3>
                  <p className="text-xs text-muted-foreground">{overdueTasks.length} tarefas precisam de atenção</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {overdueTasks.length > 0 ? (
                overdueTasks.slice(0, 4).map((task) => {
                  const assignee = mockTeamMembers.find(m => m.id === task.assignedTo);
                  return (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-destructive/20 text-destructive text-xs font-medium">
                            {assignee?.avatar || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{assignee?.name || 'Não atribuído'}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-destructive px-2 py-1 rounded-lg bg-destructive/20">
                        Atrasada
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
                  <p className="text-sm font-medium">Nenhuma tarefa atrasada!</p>
                  <p className="text-xs text-muted-foreground">Todas as tarefas estão em dia</p>
                </div>
              )}
            </div>
          </div>

          {/* Court Notifications */}
          <div className={cn(
            "dashboard-card",
            pendingNotifications.length > 0 && "border-warning/30"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  pendingNotifications.length > 0 ? "bg-warning/20" : "bg-muted"
                )}>
                  <Gavel className={cn(
                    "w-5 h-5",
                    pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold">Intimações Pendentes</h3>
                  <p className="text-xs text-muted-foreground">{pendingNotifications.length} aguardando análise</p>
                </div>
              </div>
              <a href="/intimacoes" className="text-xs text-primary hover:underline">Ver todas</a>
            </div>
            
            <div className="space-y-2">
              {pendingNotifications.length > 0 ? (
                pendingNotifications.slice(0, 4).map((notif) => (
                  <div 
                    key={notif.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20 hover:bg-warning/20 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium">{notif.type}</p>
                      <p className="text-xs text-muted-foreground font-mono">{notif.processNumber}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-warning/20 text-warning">
                      Nova
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Gavel className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Nenhuma intimação pendente</p>
                  <p className="text-xs text-muted-foreground">Todas as intimações foram analisadas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
