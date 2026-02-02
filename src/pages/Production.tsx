import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockTasks, mockClients } from '@/data/mockData';
import { Task } from '@/types';
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
import { TaskDetailSheet } from '@/components/production/TaskDetailSheet';

const productionColumns = [
  { id: 'pending', label: 'Aguardando Início', icon: Clock, color: 'text-primary' },
  { id: 'in_progress', label: 'Em Andamento', icon: Calendar, color: 'text-warning' },
  { id: 'overdue', label: 'Atrasado', icon: AlertTriangle, color: 'text-destructive' },
  { id: 'completed', label: 'Concluídas', icon: CheckCircle2, color: 'text-success' },
];

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
}

function TaskCard({ task, onSelect }: TaskCardProps) {
  const client = mockClients.find((c) => c.id === task.clientId);

  const priorityStyles = {
    high: 'border-l-destructive',
    medium: 'border-l-warning',
    low: 'border-l-primary',
  };

  const priorityBadge = {
    high: { label: 'Alta', color: 'bg-destructive/10 text-destructive border-destructive/20' },
    medium: { label: 'Média', color: 'bg-warning/10 text-warning border-warning/20' },
    low: { label: 'Baixa', color: 'bg-primary/10 text-primary border-primary/20' },
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-dropdown]')) return;
    onSelect(task);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer border-l-4 animate-fade-in',
        priorityStyles[task.priority]
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-dropdown>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
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
        <Badge variant="outline" className={cn("text-xs border", priorityBadge[task.priority].color)}>
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: string) =>
    mockTasks.filter((task) => task.status === status);

  return (
    <MainLayout title="Produção" subtitle="Esteira de tarefas e processos">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar tarefas..."
                className="pl-8 h-9"
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-1.5 h-9 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 h-[calc(100vh-220px)]">
          {productionColumns.map((column) => {
            const tasks = getTasksByStatus(column.id);
            const Icon = column.icon;
            return (
              <div
                key={column.id}
                className="flex-1 min-w-[280px] bg-secondary/30 rounded-xl p-4 border border-border flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-4 h-4', column.color)} />
                    <h3 className="font-medium text-sm">{column.label}</h3>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-card px-2 py-0.5 rounded-full border border-border">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
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

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </MainLayout>
  );
}