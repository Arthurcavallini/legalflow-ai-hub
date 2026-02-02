import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Users, 
  AlertTriangle, 
  Gavel, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MessageSquare,
  Target,
  Wallet,
  BarChart3,
  Bot,
} from 'lucide-react';
import { mockDashboardMetrics, mockTasks, mockCourtNotifications, mockTeamMembers, mockPayments, mockLeads, mockClients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { TeamMemberCard, getExtendedMemberData } from '@/components/team/TeamMemberCard';
import { TeamMemberSheet } from '@/components/team/TeamMemberSheet';
import type { ExtendedMemberData } from '@/components/team/TeamMemberCard';

const revenueVsExpensesData = [
  { month: 'Jan', receita: 45000, despesa: 28000 },
  { month: 'Fev', receita: 52000, despesa: 31000 },
  { month: 'Mar', receita: 48000, despesa: 29000 },
  { month: 'Abr', receita: 61000, despesa: 35000 },
  { month: 'Mai', receita: 55000, despesa: 32000 },
  { month: 'Jun', receita: 67000, despesa: 38000 },
  { month: 'Jul', receita: 72000, despesa: 40000 },
];

// Metric Card Component
function MetricCard({ 
  label, 
  value, 
  change, 
  changeLabel,
  icon: Icon, 
  variant = 'default',
  subtitle
}: { 
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  subtitle?: string;
}) {
  const isPositive = change !== undefined && change >= 0;
  
  const styles = {
    default: {
      card: 'bg-card border-border',
      icon: 'bg-muted text-muted-foreground',
      value: 'text-foreground',
    },
    primary: {
      card: 'bg-card border-primary/20',
      icon: 'bg-primary/10 text-primary',
      value: 'text-foreground',
    },
    success: {
      card: 'bg-card border-success/20',
      icon: 'bg-success/10 text-success',
      value: 'text-foreground',
    },
    warning: {
      card: 'bg-card border-warning/20',
      icon: 'bg-warning/10 text-warning',
      value: 'text-foreground',
    },
    danger: {
      card: 'bg-card border-destructive/20',
      icon: 'bg-destructive/10 text-destructive',
      value: 'text-destructive',
    },
  };

  const style = styles[variant];

  return (
    <div className={cn(
      'rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col',
      style.card
    )}>
      <div className="flex items-start justify-between flex-1">
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className={cn('text-3xl font-bold tracking-tight mt-2', style.value)}>{value}</p>
          </div>
          <div className="mt-3">
            {change !== undefined ? (
              <div className="flex items-center gap-1.5">
                {isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                )}
                <span className={cn(
                  'text-xs font-semibold',
                  isPositive ? 'text-success' : 'text-destructive'
                )}>
                  {isPositive && '+'}{change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            ) : subtitle ? (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className={cn('p-3 rounded-xl flex-shrink-0', style.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component for side panel
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  trendLabel,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10'
}: { 
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  trendLabel?: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex-1 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn('p-3 rounded-xl flex-shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
      <div className="mt-3">
        {trend ? (
          <div className="flex items-center gap-1.5">
            {trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
            )}
            <span className={cn(
              'text-xs font-semibold',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive && '+'}{trend.value}%
            </span>
            {trendLabel && (
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            )}
          </div>
        ) : trendLabel ? (
          <p className="text-xs text-muted-foreground">{trendLabel}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedMember, setSelectedMember] = useState<ExtendedMemberData | null>(null);
  
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  const pendingNotifications = mockCourtNotifications.filter(n => n.status === 'pending');
  
  const closedClientsThisMonth = 12;
  const closedClientsLastMonth = 9;
  const clientsPercentageChange = Math.round(((closedClientsThisMonth - closedClientsLastMonth) / closedClientsLastMonth) * 100);

  const chatsNeedingAttention = 5;

  // Count AI disabled chats (leads + clients with aiEnabled = false)
  const leadsWithAiDisabled = mockLeads.filter(l => l.aiEnabled === false).length;
  const clientsWithAiDisabled = mockClients.filter(c => c.aiEnabled === false).length;
  const totalAiDisabled = leadsWithAiDisabled + clientsWithAiDisabled;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const extendedTeamMembers = mockTeamMembers
    .filter(m => m.status === 'active')
    .map(getExtendedMemberData);

  const pendingAmount = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do escritório">
      <div className="space-y-8">
        {/* Top Metrics Row */}
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-5">
          <MetricCard
            label="Clientes Fechados"
            value={closedClientsThisMonth}
            change={clientsPercentageChange}
            changeLabel="vs mês anterior"
            icon={Users}
            variant="primary"
          />
          <MetricCard
            label="Tarefas Atrasadas"
            value={overdueTasks.length}
            subtitle="Requer atenção"
            icon={AlertTriangle}
            variant={overdueTasks.length > 0 ? 'danger' : 'default'}
          />
          <MetricCard
            label="Novas Intimações"
            value={pendingNotifications.length}
            subtitle="Aguardando análise"
            icon={Gavel}
            variant={pendingNotifications.length > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            label="Chats Pendentes"
            value={chatsNeedingAttention}
            subtitle="Precisam de resposta"
            icon={MessageSquare}
            variant="primary"
          />
          <MetricCard
            label="IA Desligada"
            value={totalAiDisabled}
            subtitle={`${leadsWithAiDisabled} leads · ${clientsWithAiDisabled} clientes`}
            icon={Bot}
            variant={totalAiDisabled > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Receita vs Despesas</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Comparativo dos últimos 7 meses</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground font-medium">Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <span className="text-xs text-muted-foreground font-medium">Despesas</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueVsExpensesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradientDespesa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.15}/>
                      <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${value/1000}k`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px hsl(var(--foreground) / 0.15)',
                      padding: '12px 16px',
                    }}
                    labelStyle={{ 
                      color: 'hsl(var(--foreground))',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}
                    itemStyle={{
                      color: 'hsl(var(--muted-foreground))',
                      fontSize: '13px',
                      padding: '2px 0'
                    }}
                    formatter={(value: number, name: string) => [formatCurrency(value), name === 'receita' ? 'Receita' : 'Despesas']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#gradientReceita)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesa" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    strokeOpacity={0.7}
                    fillOpacity={1} 
                    fill="url(#gradientDespesa)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Stats */}
          <div className="flex flex-col gap-5">
            <StatCard
              label="Receita do Mês"
              value={formatCurrency(mockDashboardMetrics.monthlyRevenue)}
              icon={TrendingUp}
              trend={{ value: 12.5, isPositive: true }}
              trendLabel="vs mês anterior"
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
            />
            <StatCard
              label="A Receber"
              value={formatCurrency(pendingAmount)}
              icon={Wallet}
              trendLabel="8 parcelas pendentes"
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
            />
            <StatCard
              label="Despesas do Mês"
              value={formatCurrency(38000)}
              icon={BarChart3}
              trend={{ value: 5, isPositive: false }}
              trendLabel="vs mês anterior"
              iconColor="text-rose-500"
              iconBg="bg-rose-500/10"
            />
          </div>
        </div>

        {/* Alerts Row - Overdue Tasks & Recent Intimations */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Overdue Tasks */}
          <div className={cn(
            'bg-card rounded-2xl border p-6 flex flex-col',
            overdueTasks.length > 0 ? 'border-destructive/30' : 'border-border'
          )}>
            <div className="flex items-center gap-4 mb-5">
              <div className={cn(
                'p-3 rounded-xl',
                overdueTasks.length > 0 ? 'bg-destructive/10' : 'bg-muted'
              )}>
                <AlertTriangle className={cn(
                  'w-5 h-5',
                  overdueTasks.length > 0 ? 'text-destructive' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Tarefas Atrasadas</h3>
                <p className="text-sm text-muted-foreground">{overdueTasks.length} tarefas precisam de atenção</p>
              </div>
            </div>
            
            <div className="space-y-3 flex-1">
              {overdueTasks.length > 0 ? (
                overdueTasks.slice(0, 4).map((task) => {
                  const assignee = mockTeamMembers.find(m => m.id === task.assignedTo);
                  return (
                    <div 
                      key={task.id} 
                      className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-destructive/15 text-destructive text-xs font-semibold">
                          {assignee?.avatar || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{assignee?.name || 'Não atribuído'}</p>
                      </div>
                      <Clock className="w-4 h-4 text-destructive flex-shrink-0" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">Nenhuma tarefa atrasada!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Intimations */}
          <div className={cn(
            'bg-card rounded-2xl border p-6 flex flex-col',
            pendingNotifications.length > 0 ? 'border-warning/30' : 'border-border'
          )}>
            <div className="flex items-center gap-4 mb-5">
              <div className={cn(
                'p-3 rounded-xl',
                pendingNotifications.length > 0 ? 'bg-warning/10' : 'bg-muted'
              )}>
                <Gavel className={cn(
                  'w-5 h-5',
                  pendingNotifications.length > 0 ? 'text-warning' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Intimações Recentes</h3>
                <p className="text-sm text-muted-foreground">{pendingNotifications.length} novas intimações</p>
              </div>
            </div>
            
            <div className="space-y-3 flex-1">
              {pendingNotifications.length > 0 ? (
                pendingNotifications.slice(0, 4).map((notification) => {
                  const daysUntil = Math.ceil((notification.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 5;
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer',
                        isUrgent 
                          ? 'bg-warning/5 border-warning/20 hover:bg-warning/10' 
                          : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{notification.type}</p>
                        <p className="text-xs text-muted-foreground truncate">{notification.clientName} · {notification.processNumber}</p>
                      </div>
                      <span className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0',
                        isUrgent 
                          ? 'bg-warning/15 text-warning' 
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {daysUntil} dias
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
                    <BarChart3 className="w-6 h-6 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">Nenhuma intimação pendente!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Desempenho da Equipe</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Tarefas do dia por membro</p>
            </div>
            <a href="/team" className="text-sm text-primary hover:underline font-medium">Ver todos →</a>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {extendedTeamMembers.slice(0, 4).map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                compact
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Member Detail Sheet */}
      <TeamMemberSheet
        member={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />
    </MainLayout>
  );
}
