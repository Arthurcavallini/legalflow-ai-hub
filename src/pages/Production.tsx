import { MainLayout } from '@/components/layout/MainLayout';
import { mockTasks, mockProcesses, mockClients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const productionColumns = [
  { id: 'pending', label: 'Pendentes', icon: Clock },
  { id: 'in_progress', label: 'Em Andamento', icon: Calendar },
  { id: 'completed', label: 'Concluídas', icon: CheckCircle2 },
  { id: 'overdue', label: 'Atrasadas', icon: AlertTriangle },
];

function TaskCard({ task }: { task: typeof mockTasks[0] }) {
  const client = mockClients.find((c) => c.id === task.clientId);
  const process = mockProcesses.find((p) => p.id === task.processId);

  const priorityStyles = {
    high: 'border-l-destructive',
    medium: 'border-l-amber-500',
    low: 'border-l-blue-500',
  };

  const priorityBadge = {
    high: { label: 'Alta', variant: 'destructive' as const },
    medium: { label: 'Média', variant: 'secondary' as const },
    low: { label: 'Baixa', variant: 'outline' as const },
  };

  return (
    <div
      className={cn(
        'bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 animate-fade-in',
        priorityStyles[task.priority]
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Mover para...</DropdownMenuItem>
            <DropdownMenuItem>Marcar como concluída</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {client && (
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {client.name}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Badge variant={priorityBadge[task.priority].variant} className="text-xs">
          {priorityBadge[task.priority].label}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(task.dueDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Production() {
  const getTasksByStatus = (status: string) =>
    mockTasks.filter((task) => task.status === status);

  return (
    <MainLayout title="Produção" subtitle="Esteira de tarefas e processos">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar tarefas..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {productionColumns.map((column) => {
            const tasks = getTasksByStatus(column.id);
            const Icon = column.icon;
            return (
              <div
                key={column.id}
                className="kanban-column min-w-[300px] flex-shrink-0"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        column.id === 'overdue' && 'text-destructive',
                        column.id === 'completed' && 'text-accent',
                        column.id === 'in_progress' && 'text-amber-500',
                        column.id === 'pending' && 'text-blue-500'
                      )}
                    />
                    <h3 className="font-medium text-sm">{column.label}</h3>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground">
                      Nenhuma tarefa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
