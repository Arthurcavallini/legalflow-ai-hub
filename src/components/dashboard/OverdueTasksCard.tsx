import { mockTasks, mockClients, mockTeamMembers } from '@/data/mockData';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function OverdueTasksCard() {
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  
  const getClientName = (clientId?: string) => {
    if (!clientId) return null;
    const client = mockClients.find(c => c.id === clientId);
    return client?.name;
  };

  const getAssigneeName = (id: string) => {
    const member = mockTeamMembers.find(m => m.id === id);
    return member?.name || 'Não atribuído';
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diff = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-100">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="font-semibold text-foreground">Tarefas Atrasadas</h3>
        </div>
        <Badge variant="destructive" className="font-medium">
          {overdueTasks.length} tarefas
        </Badge>
      </div>
      
      <div className="space-y-3">
        {overdueTasks.map((task) => {
          const daysOverdue = getDaysOverdue(task.dueDate);
          const clientName = getClientName(task.clientId);
          const assignee = getAssigneeName(task.assignedTo);
          
          return (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {task.title}
                </p>
                <Badge variant="destructive" className="text-xs shrink-0 ml-2">
                  -{daysOverdue}d
                </Badge>
              </div>
              
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{assignee.split(' ')[0]}</span>
                </div>
                {clientName && (
                  <span className="text-muted-foreground">
                    Cliente: {clientName.split(' ')[0]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {overdueTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhuma tarefa atrasada!</p>
            <p className="text-xs text-muted-foreground">Todas as tarefas estão em dia</p>
          </div>
        )}
      </div>
    </div>
  );
}
