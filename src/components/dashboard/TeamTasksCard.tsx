import { mockTeamMembers, mockTasks } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function TeamTasksCard() {
  const getTasksForMember = (memberId: string) => {
    return mockTasks.filter(t => t.assignedTo === memberId);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Tarefas por Membro</h3>
        <span className="text-xs text-muted-foreground">Atualizado agora</span>
      </div>
      
      <div className="space-y-3">
        {mockTeamMembers.filter(m => m.status === 'active').map((member) => {
          const tasks = getTasksForMember(member.id);
          const pending = tasks.filter(t => t.status === 'pending').length;
          const inProgress = tasks.filter(t => t.status === 'in_progress').length;
          const overdue = tasks.filter(t => t.status === 'overdue').length;
          const total = pending + inProgress + overdue;
          
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {overdue > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{overdue}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-amber-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{pending + inProgress}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{member.tasksCompleted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>Atrasadas</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pendentes</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Concluídas</span>
        </div>
      </div>
    </div>
  );
}
