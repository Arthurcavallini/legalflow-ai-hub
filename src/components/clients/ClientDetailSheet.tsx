import { Client } from '@/types';
import { mockProcesses, mockPayments, mockTasks, mockTeamMembers, mockContracts, mockServices } from '@/data/mockData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  DollarSign, 
  ListTodo,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Edit,
  MessageSquare,
  FileSignature,
  XCircle,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientDetailSheetProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailSheet({ client, open, onOpenChange }: ClientDetailSheetProps) {
  if (!client) return null;

  const clientProcesses = mockProcesses.filter(p => p.clientId === client.id);
  const clientPayments = mockPayments.filter(p => p.clientId === client.id);
  const clientTasks = mockTasks.filter(t => t.clientId === client.id);
  const clientContracts = mockContracts.filter(c => c.clientId === client.id);

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service?.name || 'Serviço não encontrado';
  };

  const contractStatusConfig = {
    draft: { label: 'Rascunho', icon: FileText, color: 'bg-muted text-muted-foreground border-border' },
    pending_signature: { label: 'Aguardando', icon: Clock, color: 'bg-warning/10 text-warning border-warning/20' },
    active: { label: 'Ativo', icon: CheckCircle2, color: 'bg-success/10 text-success border-success/20' },
    completed: { label: 'Concluído', icon: CheckCircle2, color: 'bg-primary/10 text-primary border-primary/20' },
    cancelled: { label: 'Cancelado', icon: XCircle, color: 'bg-destructive/10 text-destructive border-destructive/20' },
  };

  const totalReceived = clientPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = clientPayments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const getAssigneeName = (id: string) => {
    const member = mockTeamMembers.find(m => m.id === id);
    return member?.name || 'Não atribuído';
  };

  const statusConfig = {
    intake: { label: 'Entrada', color: 'bg-primary/20 text-primary' },
    documentation: { label: 'Documentação', color: 'bg-warning/20 text-warning' },
    analysis: { label: 'Análise', color: 'bg-primary/20 text-primary' },
    filing: { label: 'Protocolando', color: 'bg-warning/20 text-warning' },
    ongoing: { label: 'Em Andamento', color: 'bg-success/20 text-success' },
    awaiting: { label: 'Aguardando', color: 'bg-muted text-muted-foreground' },
    completed: { label: 'Concluído', color: 'bg-success/20 text-success' },
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
          <SheetHeader className="space-y-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-2xl">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xl rounded-2xl">
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <SheetTitle className="text-xl font-bold text-foreground">
                    {client.name}
                  </SheetTitle>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      client.status === 'active' 
                        ? "bg-success/20 text-success border-success/30" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cliente desde {formatDate(client.createdAt)}
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <Phone className="w-4 h-4" />
              Ligar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{clientProcesses.length}</p>
              <p className="text-xs text-muted-foreground">Processos</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{clientTasks.length}</p>
              <p className="text-xs text-muted-foreground">Tarefas</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-success/10">
              <p className="text-xl font-bold text-success">{formatCurrency(totalReceived)}</p>
              <p className="text-xs text-muted-foreground">Recebido</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-warning/10">
              <p className="text-xl font-bold text-warning">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-muted-foreground">Pendente</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-medium truncate">{client.phone}</p>
                </div>
              </div>
              {client.email && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{client.email}</p>
                  </div>
                </div>
              )}
              {client.cpf && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <User className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="text-sm font-medium font-mono">{client.cpf}</p>
                  </div>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 col-span-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Endereço</p>
                    <p className="text-sm font-medium">{client.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="processes" className="space-y-4">
            <TabsList className="w-full bg-secondary/50 rounded-xl p-1 h-auto grid grid-cols-4">
              <TabsTrigger value="processes" className="rounded-lg py-2 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Processos
              </TabsTrigger>
              <TabsTrigger value="contracts" className="rounded-lg py-2 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileSignature className="w-3.5 h-3.5 mr-1.5" />
                Contratos
              </TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-lg py-2 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <ListTodo className="w-3.5 h-3.5 mr-1.5" />
                Tarefas
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-lg py-2 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                Financeiro
              </TabsTrigger>
            </TabsList>

            {/* Processes Tab */}
            <TabsContent value="processes" className="space-y-3 mt-4">
              {clientProcesses.length > 0 ? (
                clientProcesses.map((process) => {
                  const config = statusConfig[process.status as keyof typeof statusConfig] || statusConfig.intake;
                  return (
                    <div key={process.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{process.type}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">{process.processNumber}</p>
                        </div>
                        <Badge className={cn('text-xs', config.color)}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{process.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{getAssigneeName(process.assignedTo)}</span>
                        </div>
                        {process.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Prazo: {formatDate(process.deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum processo</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui processos cadastrados</p>
                </div>
              )}
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-3 mt-4">
              {clientTasks.length > 0 ? (
                clientTasks.map((task) => {
                  const isOverdue = task.status === 'overdue';
                  const isCompleted = task.status === 'completed';
                  const isPending = task.status === 'pending' || task.status === 'in_progress';
                  
                  return (
                    <div key={task.id} className={cn(
                      "p-4 rounded-xl transition-colors cursor-pointer border border-transparent",
                      isOverdue ? "bg-destructive/10 hover:border-destructive/30" : 
                      isCompleted ? "bg-success/10 hover:border-success/30" :
                      "bg-secondary/30 hover:bg-secondary/50 hover:border-primary/20"
                    )}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-success" />}
                          {isOverdue && <AlertTriangle className="w-4 h-4 text-destructive" />}
                          {isPending && <Clock className="w-4 h-4 text-warning" />}
                          <p className={cn(
                            "font-medium",
                            isCompleted && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </p>
                        </div>
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' : 
                          task.priority === 'medium' ? 'default' : 'secondary'
                        } className="text-xs">
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{getAssigneeName(task.assignedTo)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className={isOverdue ? "text-destructive font-medium" : ""}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhuma tarefa</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui tarefas cadastradas</p>
                </div>
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-3 mt-4">
              {clientPayments.length > 0 ? (
                <>
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                      <p className="text-xs text-muted-foreground mb-1">Total Recebido</p>
                      <p className="text-xl font-bold text-success">{formatCurrency(totalReceived)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                      <p className="text-xs text-muted-foreground mb-1">Total Pendente</p>
                      <p className="text-xl font-bold text-warning">{formatCurrency(totalPending)}</p>
                    </div>
                  </div>

                  {clientPayments.map((payment) => {
                    const isPaid = payment.status === 'paid';
                    const isOverdue = payment.status === 'overdue';
                    
                    return (
                      <div key={payment.id} className={cn(
                        "p-4 rounded-xl transition-colors cursor-pointer border border-transparent",
                        isOverdue ? "bg-destructive/10 hover:border-destructive/30" : 
                        isPaid ? "bg-success/10 hover:border-success/30" : 
                        "bg-secondary/30 hover:bg-secondary/50 hover:border-primary/20"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "p-3 rounded-xl",
                              isPaid ? "bg-success/20" : isOverdue ? "bg-destructive/20" : "bg-warning/20"
                            )}>
                              <DollarSign className={cn(
                                "w-5 h-5",
                                isPaid ? "text-success" : isOverdue ? "text-destructive" : "text-warning"
                              )} />
                            </div>
                            <div>
                              <p className="font-bold text-lg text-foreground">{formatCurrency(payment.amount)}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span>Venc: {formatDate(payment.dueDate)}</span>
                                {payment.paidAt && (
                                  <>
                                    <span>•</span>
                                    <span>Pago: {formatDate(payment.paidAt)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={isPaid ? "outline" : isOverdue ? "destructive" : "secondary"}
                              className={cn(
                                isPaid && "bg-success/20 text-success border-success/30"
                              )}
                            >
                              {isPaid ? 'Pago' : isOverdue ? 'Atrasado' : 'Pendente'}
                            </Badge>
                            {payment.method && (
                              <p className="text-xs text-muted-foreground mt-1 capitalize">{payment.method}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum pagamento</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui pagamentos cadastrados</p>
                </div>
              )}
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-3 mt-4">
              {clientContracts.length > 0 ? (
                clientContracts.map((contract) => {
                  const config = contractStatusConfig[contract.status as keyof typeof contractStatusConfig] || contractStatusConfig.draft;
                  const StatusIcon = config.icon;

                  return (
                    <div key={contract.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{getServiceName(contract.serviceId)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Criado em {formatDate(contract.createdAt)}
                          </p>
                        </div>
                        <Badge variant="outline" className={cn("gap-1 text-xs border", config.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-foreground">{formatCurrency(contract.value)}</p>
                        {contract.signedAt && (
                          <p className="text-xs text-muted-foreground">
                            Assinado em {formatDate(contract.signedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <FileSignature className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum contrato</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui contratos cadastrados</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
