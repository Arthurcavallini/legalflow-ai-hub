import { MainLayout } from '@/components/layout/MainLayout';
import { mockTeamMembers, mockTasks } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Team() {
  const getTasksForMember = (memberId: string) => {
    return mockTasks.filter(t => t.assignedTo === memberId);
  };

  const statusConfig = {
    active: { label: 'Ativo', color: 'bg-success/20 text-success' },
    vacation: { label: 'Férias', color: 'bg-warning/20 text-warning' },
    inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
  };

  const totalMembers = mockTeamMembers.length;
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length;
  const totalCompleted = mockTeamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0);
  const totalPending = mockTeamMembers.reduce((sum, m) => sum + m.tasksPending, 0);

  return (
    <MainLayout title="Equipe" subtitle="Gestão">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="metric-card">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
            <p className="text-3xl font-bold mt-2">{totalMembers}</p>
          </div>
          <div className="metric-card metric-card-success">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Ativos</span>
            <p className="text-3xl font-bold mt-2 text-success">{activeMembers}</p>
          </div>
          <div className="metric-card metric-card-primary">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Concluídas</span>
            <p className="text-3xl font-bold mt-2 text-primary">{totalCompleted}</p>
          </div>
          <div className="metric-card metric-card-warning">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Pendentes</span>
            <p className="text-3xl font-bold mt-2 text-warning">{totalPending}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar membros..." 
              className="pl-9" 
            />
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </Button>
        </div>

        {/* Team Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTeamMembers.map((member) => {
            const tasks = getTasksForMember(member.id);
            const pending = tasks.filter(t => t.status === 'pending').length;
            const inProgress = tasks.filter(t => t.status === 'in_progress').length;
            const overdue = tasks.filter(t => t.status === 'overdue').length;
            const completed = member.tasksCompleted;
            const total = completed + pending + inProgress + overdue;
            const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
            const status = statusConfig[member.status];

            return (
              <div key={member.id} className="dashboard-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-11 w-11 rounded-lg">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold rounded-lg">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                        member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="text-sm">Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm">Ver tarefas</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm">Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge className={cn("text-xs mb-4", status.color)}>
                  {status.label}
                </Badge>

                {/* Task Stats */}
                <div className="flex items-center gap-4 mb-4">
                  {overdue > 0 && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-sm font-bold">{overdue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-warning">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-sm font-bold">{pending + inProgress}</span>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-sm font-bold">{completed}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Produtividade</span>
                    <span className="font-bold">{productivity}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${productivity}%` }}
                    />
                  </div>
                </div>

                {/* Contact Icons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" className="h-8 hover:text-primary">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 hover:text-primary">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
