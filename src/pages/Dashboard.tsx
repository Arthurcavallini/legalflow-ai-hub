import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { LeadsPipeline } from '@/components/dashboard/LeadsPipeline';
import { mockDashboardMetrics, mockTasks, mockPayments, mockLeads } from '@/data/mockData';
import { Users, TrendingUp, ListTodo, Wallet, AlertTriangle, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const overdueTasks = mockTasks.filter((t) => t.status === 'overdue');
  const upcomingTasks = mockTasks.filter(
    (t) => t.status === 'pending' && new Date(t.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const overduePayments = mockPayments.filter((p) => p.status === 'overdue');
  const newLeads = mockLeads.filter(
    (l) => l.status === 'new' && new Date(l.createdAt) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do escritório">
      <div className="space-y-6">
        {/* Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Leads Ativos"
            value={mockDashboardMetrics.totalLeads}
            change={12}
            changeLabel="vs mês anterior"
            icon={MessageSquare}
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${mockDashboardMetrics.conversionRate}%`}
            change={5}
            changeLabel="vs mês anterior"
            icon={TrendingUp}
            variant="accent"
          />
          <MetricCard
            title="Clientes Ativos"
            value={mockDashboardMetrics.activeClients}
            change={8}
            changeLabel="vs mês anterior"
            icon={Users}
          />
          <MetricCard
            title="Receita do Mês"
            value={`R$ ${(mockDashboardMetrics.monthlyRevenue / 1000).toFixed(1)}k`}
            change={15}
            changeLabel="vs mês anterior"
            icon={Wallet}
          />
        </div>

        {/* Charts and Pipeline */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <LeadsPipeline />
        </div>

        {/* Alerts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AlertCard
            type="overdue"
            title="Tarefas Atrasadas"
            items={overdueTasks.map((t) => ({
              id: t.id,
              label: t.title,
              sublabel: `Venceu em ${new Date(t.dueDate).toLocaleDateString('pt-BR')}`,
              urgent: true,
            }))}
          />
          <AlertCard
            type="deadline"
            title="Próximos Prazos"
            items={upcomingTasks.map((t) => ({
              id: t.id,
              label: t.title,
              sublabel: `Vence em ${new Date(t.dueDate).toLocaleDateString('pt-BR')}`,
            }))}
          />
          <AlertCard
            type="document"
            title="Pagamentos em Atraso"
            items={overduePayments.map((p) => ({
              id: p.id,
              label: `R$ ${p.amount.toLocaleString('pt-BR')}`,
              sublabel: `Venceu em ${new Date(p.dueDate).toLocaleDateString('pt-BR')}`,
              urgent: true,
            }))}
          />
          <AlertCard
            type="lead"
            title="Novos Leads Hoje"
            items={newLeads.map((l) => ({
              id: l.id,
              label: l.name,
              sublabel: l.caseType || 'Não classificado',
            }))}
          />
        </div>

        {/* Tasks Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Tarefas Pendentes"
            value={mockDashboardMetrics.pendingTasks}
            icon={ListTodo}
          />
          <MetricCard
            title="Tarefas Atrasadas"
            value={mockDashboardMetrics.overdueTasks}
            icon={AlertTriangle}
            variant="danger"
          />
          <MetricCard
            title="Pagamentos Pendentes"
            value={`R$ ${(mockDashboardMetrics.pendingPayments / 1000).toFixed(1)}k`}
            icon={Wallet}
            variant="warning"
          />
        </div>
      </div>
    </MainLayout>
  );
}
