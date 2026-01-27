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
    active: { label: 'Ativo', color: 'bg-success/20 text-success border-success/30' },
    vacation: { label: 'Férias', color: 'bg-warning/20 text-warning border-warning/30' },
    inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
  };

  const totalMembers = mockTeamMembers.length;
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length;
  const pendingTasks = mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue').length;

  return (
    <MainLayout title="Equipe" subtitle="Gestão de colaboradores e produtividade">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="metric-card p-5">
            <p className="text-sm text-muted-foreground mb-1">Total de Membros</p>
            <p className="text-4xl font-bold text-foreground">{totalMembers}</p>
          </div>
          <div className="metric-card metric-card-success p-5">
            <p className="text-sm text-muted-foreground mb-1">Ativos</p>
            <p className="text-4xl font-bold text-success">{activeMembers}</p>
          </div>
          <div className="metric-card metric-card-warning p-5">
            <p className="text-sm text-muted-foreground mb-1">Tarefas Pendentes</p>
            <p className="text-4xl font-bold text-warning">{pendingTasks}</p>
          </div>
          <div className={cn(
            "metric-card p-5",
            overdueTasks > 0 && "metric-card-danger"
          )}>
            <p className="text-sm text-muted-foreground mb-1">Tarefas Atrasadas</p>
            <p className={cn(
              "text-4xl font-bold",
              overdueTasks > 0 ? "text-destructive" : "text-foreground"
            )}>{overdueTasks}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar membros..." 
              className="pl-9 bg-secondary border-0 rounded-xl" 
            />
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
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
              <div key={member.id} className="metric-card p-5 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold rounded-xl">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card',
                        member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-secondary">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl">
                      <DropdownMenuItem className="rounded-lg cursor-pointer">Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">Ver tarefas</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge variant="outline" className={cn("rounded-lg mb-4", status.color)}>
                  {status.label}
                </Badge>

                {/* Task Stats */}
                <div className="flex items-center gap-4 mb-4">
                  {overdue > 0 && (
                    <div className="flex items-center gap-1.5 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-bold">{overdue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-warning">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{pending + inProgress}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-bold">{completed}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Produtividade</span>
                    <span className="font-bold text-foreground">{productivity}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${productivity}%` }}
                    />
                  </div>
                </div>

                {/* Contact Icons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" className="rounded-lg hover:bg-primary/10 hover:text-primary">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-lg hover:bg-primary/10 hover:text-primary">
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