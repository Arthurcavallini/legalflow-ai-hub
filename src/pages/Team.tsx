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
    active: { label: 'Ativo', color: 'bg-success/10 text-success border-success/20' },
    vacation: { label: 'Férias', color: 'bg-warning/10 text-warning border-warning/20' },
    inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground border-border' },
  };

  const totalMembers = mockTeamMembers.length;
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length;
  const totalCompleted = mockTeamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0);
  const totalPending = mockTeamMembers.reduce((sum, m) => sum + m.tasksPending, 0);

  return (
    <MainLayout title="Equipe" subtitle="Gestão de colaboradores">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Total</span>
            <p className="text-2xl font-bold mt-1">{totalMembers}</p>
          </div>
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Ativos</span>
            <p className="text-2xl font-bold mt-1 text-success">{activeMembers}</p>
          </div>
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Concluídas</span>
            <p className="text-2xl font-bold mt-1 text-primary">{totalCompleted}</p>
          </div>
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Pendentes</span>
            <p className="text-2xl font-bold mt-1 text-warning">{totalPending}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar membros..." 
              className="pl-8 h-9" 
            />
          </div>
          <Button size="sm" className="gap-1.5 h-9 bg-primary hover:bg-primary/90">
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
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold rounded-lg">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card',
                        member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Ver tarefas</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge variant="outline" className={cn("text-xs mb-4 border", status.color)}>
                  {status.label}
                </Badge>

                {/* Task Stats */}
                <div className="flex items-center gap-4 mb-4">
                  {overdue > 0 && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-sm font-semibold">{overdue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-warning">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-sm font-semibold">{pending + inProgress}</span>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-sm font-semibold">{completed}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Produtividade</span>
                    <span className="font-semibold">{productivity}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
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
