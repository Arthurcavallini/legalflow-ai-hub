import { Task, Client } from '@/types';
import { mockClients, mockProcesses, mockTeamMembers } from '@/data/mockData';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  User,
  FileText,
  Edit,
  MessageSquare,
  Sparkles,
  ListTodo,
  Flag,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateTaskAISummary(task: Task): string {
  const summaries = [
    `Tarefa de prioridade ${task.priority === 'high' ? 'alta' : task.priority === 'medium' ? 'média' : 'baixa'}. ${task.status === 'overdue' ? 'Atenção: prazo expirado. Recomenda-se ação imediata.' : 'Prazo dentro do esperado.'}`,
    `Esta tarefa requer atenção ${task.priority === 'high' ? 'urgente' : 'moderada'}. Verificar dependências antes de prosseguir.`,
    `Análise indica que a tarefa está ${task.status === 'completed' ? 'concluída com sucesso' : task.status === 'in_progress' ? 'em progresso adequado' : 'aguardando início'}.`,
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
}

export function TaskDetailSheet({ task, open, onOpenChange }: TaskDetailSheetProps) {
  if (!task) return null;

  const client = mockClients.find(c => c.id === task.clientId);
  const process = mockProcesses.find(p => p.id === task.processId);
  const assignee = mockTeamMembers.find(m => m.id === task.assignedTo);
  const aiSummary = generateTaskAISummary(task);

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const priorityConfig = {
    high: { label: 'Alta', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
    medium: { label: 'Média', color: 'bg-warning/10 text-warning border-warning/20', icon: Flag },
    low: { label: 'Baixa', color: 'bg-primary/10 text-primary border-primary/20', icon: Flag },
  };

  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-primary/10 text-primary', icon: Clock },
    in_progress: { label: 'Em Andamento', color: 'bg-warning/10 text-warning', icon: Clock },
    completed: { label: 'Concluída', color: 'bg-success/10 text-success', icon: CheckCircle2 },
    overdue: { label: 'Atrasada', color: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  };

  const currentStatus = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.pending;
  const currentPriority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const StatusIcon = currentStatus.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
          <SheetHeader className="space-y-0">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-4 rounded-2xl",
                currentStatus.color
              )}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-xl font-bold text-foreground mb-1">
                  {task.title}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn("text-xs", currentStatus.color)}>
                    {currentStatus.label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs border", currentPriority.color)}>
                    Prioridade {currentPriority.label}
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <CheckCircle2 className="w-4 h-4" />
              Concluir
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <Clock className="w-4 h-4" />
              Adiar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <User className="w-4 h-4" />
              Reatribuir
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Summary Card */}
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Análise da IA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{aiSummary}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">{format(task.dueDate, "dd/MM/yyyy")}</p>
              <p className="text-xs text-muted-foreground">Prazo</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">{format(task.createdAt, "dd/MM/yyyy")}</p>
              <p className="text-xs text-muted-foreground">Criada em</p>
            </div>
            {task.completedAt && (
              <div className="text-center p-4 rounded-xl bg-success/10 border border-success/20">
                <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                <p className="text-sm font-bold text-success">{format(task.completedAt, "dd/MM/yyyy")}</p>
                <p className="text-xs text-muted-foreground">Concluída</p>
              </div>
            )}
            {!task.completedAt && (
              <div className={cn(
                "text-center p-4 rounded-xl",
                task.status === 'overdue' ? "bg-destructive/10 border border-destructive/20" : "bg-secondary/50"
              )}>
                <AlertTriangle className={cn(
                  "w-5 h-5 mx-auto mb-2",
                  task.status === 'overdue' ? "text-destructive" : "text-muted-foreground"
                )} />
                <p className={cn(
                  "text-sm font-bold",
                  task.status === 'overdue' ? "text-destructive" : "text-foreground"
                )}>
                  {task.status === 'overdue' ? 'Atrasada' : 'Em dia'}
                </p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Descrição
              </h3>
              <p className="text-sm text-foreground bg-secondary/30 rounded-xl p-4">
                {task.description}
              </p>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="w-full bg-secondary/50 rounded-xl p-1 h-auto">
              <TabsTrigger value="details" className="flex-1 rounded-lg py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <ListTodo className="w-4 h-4 mr-2" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="client" className="flex-1 rounded-lg py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <User className="w-4 h-4 mr-2" />
                Cliente
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 rounded-lg py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Clock className="w-4 h-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Assignee */}
                {assignee && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Responsável</p>
                      <p className="text-sm font-medium truncate">{assignee.name}</p>
                    </div>
                  </div>
                )}

                {/* Process */}
                {process && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Processo</p>
                      <p className="text-sm font-medium truncate">{process.type}</p>
                    </div>
                  </div>
                )}
              </div>

              {process && (
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Número do Processo</p>
                  <p className="text-sm font-mono font-medium">{process.processNumber}</p>
                </div>
              )}
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-4 mt-4">
              {client ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                    <Avatar className="h-14 w-14 rounded-xl">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-xl">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                      {client.email && (
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                      <MessageSquare className="w-4 h-4" />
                      Contato
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Sem cliente vinculado</p>
                  <p className="text-xs text-muted-foreground">Esta tarefa não está associada a um cliente</p>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Histórico de alterações</p>
                <p className="text-xs text-muted-foreground">Em breve você poderá ver todas as alterações</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
