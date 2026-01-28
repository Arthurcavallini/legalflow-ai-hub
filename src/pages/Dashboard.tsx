import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Users, 
  AlertTriangle, 
  Gavel, 
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  FileText,
  Target,
  BarChart3,
} from 'lucide-react';
import { mockDashboardMetrics, mockTasks, mockLeads, mockCourtNotifications, mockClients, mockTeamMembers, mockPayments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jan', value: 45000 },
  { month: 'Fev', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Abr', value: 61000 },
  { month: 'Mai', value: 55000 },
  { month: 'Jun', value: 67000 },
  { month: 'Jul', value: 72000 },
];

const leadsData = [
  { name: 'Seg', leads: 12, converted: 8 },
  { name: 'Ter', leads: 19, converted: 14 },
  { name: 'Qua', leads: 15, converted: 10 },
  { name: 'Qui', leads: 22, converted: 16 },
  { name: 'Sex', leads: 18, converted: 12 },
  { name: 'Sáb', leads: 8, converted: 5 },
  { name: 'Dom', leads: 4, converted: 2 },
];

export default function Dashboard() {
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
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

  return (
    <MainLayout title="Dashboard" subtitle="LexFlow">
      <div className="space-y-6 animate-fade-in">
        {/* Top Row - Key Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* Revenue */}
          <div className="metric-card metric-card-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Receita Mensal</span>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="metric-number-blue">{formatCurrency(mockDashboardMetrics.monthlyRevenue)}</p>
            <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>12.5%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </div>

          {/* Pending */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">A Receber</span>
              <div className="p-1.5 rounded-lg bg-warning/20">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="metric-number">{formatCurrency(totalPending)}</p>
            <div className="flex items-center gap-1 mt-2 text-warning text-xs font-medium">
              <span>8 parcelas pendentes</span>
            </div>
          </div>

          {/* Active Clients */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Clientes Ativos</span>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Users className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="metric-number">{mockDashboardMetrics.activeClients}</p>
            <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8 este mês</span>
            </div>
          </div>

          {/* Leads */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Novos Leads</span>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Target className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="metric-number">{mockDashboardMetrics.totalLeads}</p>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground text-xs font-medium">
              <span>Taxa de conversão: {mockDashboardMetrics.conversionRate}%</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Receita</h3>
                <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Receita</span>
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(217, 20%, 50%)', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(217, 20%, 50%)', fontSize: 12 }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(222, 47%, 11%)', 
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leads Chart */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Leads</h3>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(217, 20%, 50%)', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(217, 20%, 50%)', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(222, 47%, 11%)', 
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)'
                    }}
                  />
                  <Bar dataKey="leads" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Alerts Row */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Overdue Tasks */}
          <div className={cn(
            "metric-card",
            overdueTasks.length > 0 && "metric-card-danger"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  overdueTasks.length > 0 ? "bg-destructive/20" : "bg-muted"
                )}>
                  <AlertTriangle className={cn(
                    "w-4 h-4",
                    overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Tarefas Atrasadas</p>
                  <p className="text-xs text-muted-foreground">Requer atenção</p>
                </div>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                overdueTasks.length > 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {overdueTasks.length}
              </p>
            </div>
            {overdueTasks.length > 0 && (
              <div className="space-y-2">
                {overdueTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50 text-xs">
                    <span className="truncate flex-1">{task.title}</span>
                    <span className="text-destructive font-medium ml-2">Atrasada</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Court Notifications */}
          <div className={cn(
            "metric-card",
            pendingNotifications.length > 0 && "metric-card-warning"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  pendingNotifications.length > 0 ? "bg-warning/20" : "bg-muted"
                )}>
                  <Gavel className={cn(
                    "w-4 h-4",
                    pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Novas Intimações</p>
                  <p className="text-xs text-muted-foreground">Aguardando análise</p>
                </div>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                pendingNotifications.length > 0 ? "text-warning" : "text-muted-foreground"
              )}>
                {pendingNotifications.length}
              </p>
            </div>
            {pendingNotifications.length > 0 && (
              <div className="space-y-2">
                {pendingNotifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50 text-xs">
                    <span className="truncate flex-1">{notif.type}</span>
                    <span className="text-warning font-medium ml-2">Nova</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contracts */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <FileText className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Contratos</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-success">23</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>5 novos contratos</span>
              <span className="text-success font-medium">+18%</span>
            </div>
          </div>
        </div>

        {/* Bottom Row - Team & Clients */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Team Performance */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">Equipe</h3>
              <a href="/team" className="text-xs text-primary hover:underline">Ver todos</a>
            </div>
            <div className="space-y-4">
              {mockTeamMembers.filter(m => m.status === 'active').slice(0, 4).map((member) => {
                const completed = member.tasksCompleted;
                const pending = member.tasksPending;
                const progress = completed / (completed + pending) * 100 || 0;

                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg font-semibold text-xs bg-primary/20 text-primary">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <span className="text-xs text-muted-foreground">{completed} tarefas</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">Clientes Recentes</h3>
              <a href="/clients" className="text-xs text-primary hover:underline">Ver todos</a>
            </div>
            <div className="space-y-3">
              {mockClients.slice(0, 4).map((client) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg font-semibold text-xs bg-primary/20 text-primary">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    client.status === 'active' 
                      ? "bg-success/20 text-success" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
