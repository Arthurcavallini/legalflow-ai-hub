import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TeamTasksCard } from '@/components/dashboard/TeamTasksCard';
import { CourtNotificationsCard } from '@/components/dashboard/CourtNotificationsCard';
import { OverdueTasksCard } from '@/components/dashboard/OverdueTasksCard';
import { NewClientsCard } from '@/components/dashboard/NewClientsCard';
import { FinancialSummaryCard } from '@/components/dashboard/FinancialSummaryCard';
import { mockDashboardMetrics, mockTasks, mockLeads, mockCourtNotifications } from '@/data/mockData';
import { Users, MessageSquare, ListTodo, AlertTriangle, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  const pendingTasks = mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const newLeadsToday = mockLeads.filter(l => {
    const today = new Date();
    const leadDate = new Date(l.createdAt);
    return leadDate.toDateString() === today.toDateString();
  });
  const pendingNotifications = mockCourtNotifications.filter(n => n.status === 'pending');

  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do escritório">
      <div className="space-y-6">
        {/* Key Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <MetricCard
            title="Novos Leads"
            value={mockDashboardMetrics.totalLeads}
            change={12}
            changeLabel="vs mês anterior"
            icon={MessageSquare}
            variant="primary"
          />
          <MetricCard
            title="Conversão"
            value={`${mockDashboardMetrics.conversionRate}%`}
            change={5}
            icon={TrendingUp}
          />
          <MetricCard
            title="Clientes Ativos"
            value={mockDashboardMetrics.activeClients}
            change={8}
            icon={Users}
          />
          <MetricCard
            title="Tarefas Pendentes"
            value={pendingTasks.length}
            icon={ListTodo}
          />
          <MetricCard
            title="Tarefas Atrasadas"
            value={overdueTasks.length}
            icon={AlertTriangle}
            variant={overdueTasks.length > 0 ? 'danger' : 'default'}
          />
          <MetricCard
            title="Intimações"
            value={pendingNotifications.length}
            subtitle="novas hoje"
            icon={FileText}
            variant={pendingNotifications.length > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Team & Tasks */}
          <div className="space-y-6">
            <TeamTasksCard />
            <OverdueTasksCard />
          </div>

          {/* Middle Column - Notifications & Clients */}
          <div className="space-y-6">
            <CourtNotificationsCard />
            <NewClientsCard />
          </div>

          {/* Right Column - Financial */}
          <div className="space-y-6">
            <FinancialSummaryCard />
            
            {/* Quick Actions */}
            <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
                  <MessageSquare className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Novo Lead</p>
                </button>
                <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Novo Cliente</p>
                </button>
                <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
                  <ListTodo className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Nova Tarefa</p>
                </button>
                <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
                  <FileText className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Novo Contrato</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
