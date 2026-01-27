import { Client } from '@/types';
import { mockProcesses, mockPayments, mockTasks } from '@/data/mockData';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  DollarSign, 
  ListTodo,
  Calendar,
  User,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-card border-border overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xl">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-foreground">
                  {client.name}
                </SheetTitle>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "mt-1",
                    client.status === 'active' 
                      ? "bg-success/20 text-success border-success/30" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 py-6 border-b border-border">
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-foreground">{clientProcesses.length}</p>
            <p className="text-xs text-muted-foreground">Processos</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-success/10">
            <p className="text-2xl font-bold text-success">{formatCurrency(totalReceived)}</p>
            <p className="text-xs text-muted-foreground">Recebido</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-warning/10">
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-muted-foreground">Pendente</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-6 border-b border-border space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Informações de Contato
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">{client.phone}</span>
            </div>
            {client.email && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">{client.email}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{client.address}</span>
              </div>
            )}
            {client.cpf && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono">{client.cpf}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="processes" className="py-6">
          <TabsList className="w-full bg-secondary/50 rounded-xl p-1">
            <TabsTrigger value="processes" className="flex-1 rounded-lg data-[state=active]:bg-card">
              Processos
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1 rounded-lg data-[state=active]:bg-card">
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex-1 rounded-lg data-[state=active]:bg-card">
              Financeiro
            </TabsTrigger>
          </TabsList>

          {/* Processes Tab */}
          <TabsContent value="processes" className="mt-4 space-y-3">
            {clientProcesses.length > 0 ? (
              clientProcesses.map((process) => (
                <div key={process.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{process.type}</p>
                      <p className="text-xs text-muted-foreground font-mono">{process.processNumber}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {process.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{process.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum processo</p>
              </div>
            )}
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-4 space-y-3">
            {clientTasks.length > 0 ? (
              clientTasks.map((task) => {
                const isOverdue = task.status === 'overdue';
                const isPending = task.status === 'pending' || task.status === 'in_progress';
                
                return (
                  <div key={task.id} className={cn(
                    "p-4 rounded-xl transition-colors cursor-pointer",
                    isOverdue ? "bg-destructive/10" : "bg-secondary/30 hover:bg-secondary/50"
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-success" />}
                        {task.status === 'overdue' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                        {isPending && <Clock className="w-4 h-4 text-warning" />}
                        <p className="font-medium text-foreground">{task.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Vence: {formatDate(task.dueDate)}</span>
                      <Badge variant={isOverdue ? "destructive" : "outline"} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <ListTodo className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-4 space-y-3">
            {clientPayments.length > 0 ? (
              clientPayments.map((payment) => {
                const isPaid = payment.status === 'paid';
                const isOverdue = payment.status === 'overdue';
                
                return (
                  <div key={payment.id} className={cn(
                    "p-4 rounded-xl transition-colors cursor-pointer",
                    isOverdue ? "bg-destructive/10" : isPaid ? "bg-success/10" : "bg-secondary/30"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isPaid ? "bg-success/20" : isOverdue ? "bg-destructive/20" : "bg-warning/20"
                        )}>
                          <DollarSign className={cn(
                            "w-4 h-4",
                            isPaid ? "text-success" : isOverdue ? "text-destructive" : "text-warning"
                          )} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            Vencimento: {formatDate(payment.dueDate)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={isPaid ? "outline" : isOverdue ? "destructive" : "secondary"}
                        className={cn(
                          isPaid && "bg-success/20 text-success border-success/30"
                        )}
                      >
                        {isPaid ? 'Pago' : isOverdue ? 'Atrasado' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum pagamento</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-border flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
          <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
            <Phone className="w-4 h-4 mr-2" />
            Ligar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}