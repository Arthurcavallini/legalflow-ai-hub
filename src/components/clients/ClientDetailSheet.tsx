import { useState } from 'react';
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
  Bot,
  Plus,
  Paperclip,
  Upload,
  Download,
  Trash2,
  File,
  Image,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NewProcessDialog } from './NewProcessDialog';
import { NewContractDialog } from './NewContractDialog';
import { NewTaskDialog } from './NewTaskDialog';
import { NewPaymentDialog } from './NewPaymentDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { toast } from 'sonner';

interface ClientDetailSheetProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailSheet({ client, open, onOpenChange }: ClientDetailSheetProps) {
  const [newProcessOpen, setNewProcessOpen] = useState(false);
  const [newContractOpen, setNewContractOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  
  // Attachments state
  const [attachments, setAttachments] = useState<{id: string; name: string; size: number; type: string; uploadedAt: Date; description?: string}[]>([
    { id: '1', name: 'RG_Roberto.pdf', size: 524288, type: 'pdf', uploadedAt: new Date('2024-01-15'), description: 'Documento de identidade do cliente' },
    { id: '2', name: 'Comprovante_Residencia.pdf', size: 312456, type: 'pdf', uploadedAt: new Date('2024-01-14'), description: 'Comprovante de endereço atualizado' },
    { id: '3', name: 'Foto_Documento.jpg', size: 1048576, type: 'image', uploadedAt: new Date('2024-01-12') },
  ]);
  const [editingAttachmentId, setEditingAttachmentId] = useState<string | null>(null);
  const [tempDescription, setTempDescription] = useState('');

  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'process' | 'contract' | 'task' | 'payment' | null;
    id: string;
    title: string;
  }>({ open: false, type: null, id: '', title: '' });

  // Contact editing state
  const [editingContact, setEditingContact] = useState<{
    field: 'phone' | 'email' | 'cpf' | 'address' | null;
    value: string;
  }>({ field: null, value: '' });

  // Local client data for editing (in real app, this would update the backend)
  const [localClientData, setLocalClientData] = useState<Partial<Client>>({});

  if (!client) return null;

  // Merge local edits with original client data
  const clientData = { ...client, ...localClientData };

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

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    const { type, id, title } = deleteDialog;
    // In a real app, this would call an API to delete the item
    toast.success(`${title} excluído com sucesso!`);
    setDeleteDialog({ open: false, type: null, id: '', title: '' });
  };

  // Handle contact field save
  const handleSaveContact = () => {
    if (editingContact.field) {
      setLocalClientData(prev => ({
        ...prev,
        [editingContact.field!]: editingContact.value
      }));
      toast.success('Informação atualizada!');
    }
    setEditingContact({ field: null, value: '' });
  };

  // Contact field component
  const ContactField = ({
    icon: Icon,
    label,
    value,
    field,
    colSpan = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | undefined;
    field: 'phone' | 'email' | 'cpf' | 'address';
    colSpan?: boolean;
  }) => {
    const isEditing = editingContact.field === field;
    const displayValue = value || '';

    if (!value && !isEditing) return null;

    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-secondary/30 group", colSpan && "col-span-2")}>
        <Icon className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={editingContact.value}
                onChange={(e) => setEditingContact(prev => ({ ...prev, value: e.target.value }))}
                className="h-7 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveContact();
                  if (e.key === 'Escape') setEditingContact({ field: null, value: '' });
                }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-success hover:text-success hover:bg-success/10"
                onClick={handleSaveContact}
              >
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => setEditingContact({ field: null, value: '' })}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className={cn("text-sm font-medium truncate", field === 'cpf' && "font-mono")}>
                {displayValue}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                onClick={() => setEditingContact({ field, value: displayValue })}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
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
                  {clientData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <SheetTitle className="text-xl font-bold text-foreground">
                    {clientData.name}
                  </SheetTitle>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      clientData.status === 'active' 
                        ? "bg-success/20 text-success border-success/30" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {clientData.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cliente desde {formatDate(clientData.createdAt)}
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
          {/* AI Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2.5 rounded-xl',
                clientData.aiEnabled !== false ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Bot className={cn(
                  'w-5 h-5',
                  clientData.aiEnabled !== false ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Atendimento IA</p>
                <p className="text-xs text-muted-foreground">
                  {clientData.aiEnabled !== false ? 'Bot ativo para este cliente' : 'Atendimento manual'}
                </p>
              </div>
            </div>
            <Switch 
              checked={clientData.aiEnabled !== false} 
              onCheckedChange={() => {}}
            />
          </div>
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

          {/* Contact Info - Editable */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ContactField icon={Phone} label="Telefone" value={clientData.phone} field="phone" />
              <ContactField icon={Mail} label="Email" value={clientData.email} field="email" />
              <ContactField icon={User} label="CPF" value={clientData.cpf} field="cpf" />
              <ContactField icon={MapPin} label="Endereço" value={clientData.address} field="address" colSpan />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="processes" className="space-y-4">
            <TabsList className="w-full bg-secondary/50 rounded-xl p-1 h-auto grid grid-cols-5">
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
              <TabsTrigger value="attachments" className="rounded-lg py-2 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Paperclip className="w-3.5 h-3.5 mr-1.5" />
                Anexos
              </TabsTrigger>
            </TabsList>

            {/* Processes Tab */}
            <TabsContent value="processes" className="space-y-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-dashed"
                onClick={() => setNewProcessOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar Processo
              </Button>
              {clientProcesses.length > 0 ? (
                clientProcesses.map((process) => {
                  const config = statusConfig[process.status as keyof typeof statusConfig] || statusConfig.intake;
                  return (
                    <div key={process.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{process.type}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">{process.processNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs', config.color)}>
                            {config.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                open: true,
                                type: 'process',
                                id: process.id,
                                title: 'Processo'
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum processo</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui processos cadastrados</p>
                </div>
              )}
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-dashed"
                onClick={() => setNewTaskOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar Tarefa
              </Button>
              {clientTasks.length > 0 ? (
                clientTasks.map((task) => {
                  const isOverdue = task.status === 'overdue';
                  const isCompleted = task.status === 'completed';
                  const isPending = task.status === 'pending' || task.status === 'in_progress';
                  
                  return (
                    <div key={task.id} className={cn(
                      "p-4 rounded-xl transition-colors border border-transparent group",
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
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            task.priority === 'high' ? 'destructive' : 
                            task.priority === 'medium' ? 'default' : 'secondary'
                          } className="text-xs">
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                open: true,
                                type: 'task',
                                id: task.id,
                                title: 'Tarefa'
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
                <div className="text-center py-8">
                  <ListTodo className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhuma tarefa</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui tarefas cadastradas</p>
                </div>
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-dashed"
                onClick={() => setNewPaymentOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar Lançamento
              </Button>
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
                        "p-4 rounded-xl transition-colors border border-transparent group",
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
                          <div className="flex items-center gap-2">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteDialog({
                                  open: true,
                                  type: 'payment',
                                  id: payment.id,
                                  title: 'Lançamento'
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum pagamento</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui pagamentos cadastrados</p>
                </div>
              )}
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-dashed"
                onClick={() => setNewContractOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar Contrato
              </Button>
              {clientContracts.length > 0 ? (
                clientContracts.map((contract) => {
                  const config = contractStatusConfig[contract.status as keyof typeof contractStatusConfig] || contractStatusConfig.draft;
                  const StatusIcon = config.icon;

                  return (
                    <div key={contract.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{getServiceName(contract.serviceId)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Criado em {formatDate(contract.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("gap-1 text-xs border", config.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                open: true,
                                type: 'contract',
                                id: contract.id,
                                title: 'Contrato'
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
                <div className="text-center py-8">
                  <FileSignature className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum contrato</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui contratos cadastrados</p>
                </div>
              )}
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="space-y-3 mt-4">
              <label htmlFor="file-upload-client">
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">Clique para anexar arquivo</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG, PNG até 10MB</p>
                </div>
                <input 
                  type="file" 
                  id="file-upload-client" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const newId = Date.now().toString();
                      setAttachments(prev => [...prev, {
                        id: newId,
                        name: file.name,
                        size: file.size,
                        type: file.type.includes('image') ? 'image' : 'pdf',
                        uploadedAt: new Date()
                      }]);
                      // Automatically open edit mode for description
                      setEditingAttachmentId(newId);
                      setTempDescription('');
                    }
                  }}
                />
              </label>

              {attachments.length > 0 ? (
                <div className="space-y-2">
                  {attachments.map((attachment) => {
                    const formatFileSize = (bytes: number) => {
                      if (bytes < 1024) return bytes + ' B';
                      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
                    };

                    const isEditing = editingAttachmentId === attachment.id;

                    const handleSaveDescription = () => {
                      setAttachments(prev => prev.map(a => 
                        a.id === attachment.id ? { ...a, description: tempDescription } : a
                      ));
                      setEditingAttachmentId(null);
                      setTempDescription('');
                    };

                    const handleCancelEdit = () => {
                      setEditingAttachmentId(null);
                      setTempDescription('');
                    };

                    const handleStartEdit = () => {
                      setEditingAttachmentId(attachment.id);
                      setTempDescription(attachment.description || '');
                    };

                    return (
                      <div key={attachment.id} className="p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg flex-shrink-0",
                            attachment.type === 'image' ? "bg-purple-500/10" : "bg-primary/10"
                          )}>
                            {attachment.type === 'image' ? (
                              <Image className="w-4 h-4 text-purple-500" />
                            ) : (
                              <File className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.size)} • {formatDate(attachment.uploadedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={handleStartEdit}
                              title="Editar descrição"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setAttachments(prev => prev.filter(a => a.id !== attachment.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Description section */}
                        {isEditing ? (
                          <div className="mt-3 flex items-center gap-2">
                            <Input
                              placeholder="Adicionar descrição do arquivo..."
                              value={tempDescription}
                              onChange={(e) => setTempDescription(e.target.value)}
                              className="flex-1 h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveDescription();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                              onClick={handleSaveDescription}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={handleCancelEdit}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : attachment.description ? (
                          <p className="mt-2 text-xs text-muted-foreground pl-10">
                            {attachment.description}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Paperclip className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum anexo</p>
                  <p className="text-xs text-muted-foreground">Este cliente não possui arquivos anexados</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>

      {/* Dialogs */}
      <NewProcessDialog 
        open={newProcessOpen} 
        onOpenChange={setNewProcessOpen}
        clientName={clientData.name}
      />
      <NewContractDialog 
        open={newContractOpen} 
        onOpenChange={setNewContractOpen}
        clientName={clientData.name}
      />
      <NewTaskDialog 
        open={newTaskOpen} 
        onOpenChange={setNewTaskOpen}
        clientName={clientData.name}
        clientId={clientData.id}
        clientProcesses={clientProcesses}
      />
      <NewPaymentDialog 
        open={newPaymentOpen} 
        onOpenChange={setNewPaymentOpen}
        clientName={clientData.name}
        clientId={clientData.id}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title={`Excluir ${deleteDialog.title}?`}
        description={`Tem certeza que deseja excluir este ${deleteDialog.title?.toLowerCase()}? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
      />
    </Sheet>
  );
}
