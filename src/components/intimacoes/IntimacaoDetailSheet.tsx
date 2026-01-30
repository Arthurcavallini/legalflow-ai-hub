import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Gavel,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
  Download,
  History,
} from 'lucide-react';
import { mockTeamMembers } from '@/data/mockData';

interface CourtNotification {
  id: string;
  processNumber: string;
  clientName: string;
  type: string;
  description: string;
  receivedAt: Date;
  deadline: Date;
  status: 'pending' | 'acknowledged';
  assignedTo: string;
}

interface IntimacaoDetailSheetProps {
  notification: CourtNotification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock evolution/timeline data
const getTimelineData = (notification: CourtNotification) => [
  {
    id: '1',
    action: 'Intimação recebida',
    description: 'Publicação captada automaticamente do DJE',
    date: notification.receivedAt,
    user: 'Sistema',
    type: 'system',
  },
  {
    id: '2',
    action: 'Atribuída ao responsável',
    description: `Intimação atribuída para análise`,
    date: new Date(notification.receivedAt.getTime() + 1000 * 60 * 30),
    user: mockTeamMembers.find(m => m.id === notification.assignedTo)?.name || 'Não atribuído',
    type: 'assignment',
  },
  ...(notification.status === 'acknowledged' ? [
    {
      id: '3',
      action: 'Análise concluída',
      description: 'Intimação analisada e providências tomadas',
      date: new Date(notification.receivedAt.getTime() + 1000 * 60 * 60 * 24),
      user: mockTeamMembers.find(m => m.id === notification.assignedTo)?.name || 'Sistema',
      type: 'completed',
    },
  ] : []),
];

export function IntimacaoDetailSheet({ notification, open, onOpenChange }: IntimacaoDetailSheetProps) {
  if (!notification) return null;

  const assignee = mockTeamMembers.find(m => m.id === notification.assignedTo);
  const timeline = getTimelineData(notification);

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysUntil = getDaysUntilDeadline(notification.deadline);
  const isUrgent = daysUntil <= 3 && notification.status === 'pending';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2.5 rounded-xl",
              isUrgent ? "bg-destructive/10" : notification.status === 'acknowledged' ? "bg-success/10" : "bg-warning/10"
            )}>
              <Gavel className={cn(
                "w-5 h-5",
                isUrgent ? "text-destructive" : notification.status === 'acknowledged' ? "text-success" : "text-warning"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs border",
                    notification.status === 'pending'
                      ? isUrgent
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-warning/10 text-warning border-warning/20"
                      : "bg-success/10 text-success border-success/20"
                  )}
                >
                  {notification.status === 'pending' ? (isUrgent ? 'Urgente' : 'Pendente') : 'Analisada'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {notification.type}
                </Badge>
              </div>
              <SheetTitle className="text-lg">{notification.clientName}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Evolução</TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">Ações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            {/* Process Info */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Informações do Processo
              </h4>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Número do Processo</p>
                  <p className="font-mono font-medium">{notification.processNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Tipo</p>
                  <p className="font-medium">{notification.type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Descrição
              </h4>
              <Separator />
              <p className="text-sm text-foreground/90">{notification.description}</p>
            </div>

            {/* Dates */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Datas
              </h4>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Recebida em</p>
                  <p className="font-medium">
                    {format(notification.receivedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(notification.receivedAt, "HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Prazo Fatal</p>
                  <p className={cn("font-medium", isUrgent && "text-destructive")}>
                    {format(notification.deadline, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className={cn("text-xs", isUrgent ? "text-destructive" : "text-muted-foreground")}>
                    {daysUntil > 0 ? `${daysUntil} dias restantes` : daysUntil === 0 ? 'Hoje!' : `${Math.abs(daysUntil)} dias em atraso`}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Responsável
              </h4>
              <Separator />
              {assignee && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {assignee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{assignee.name}</p>
                    <p className="text-xs text-muted-foreground">{assignee.role}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Histórico de Evolução
              </h4>

              <div className="relative pl-6 space-y-6">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

                {timeline.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute -left-4 w-4 h-4 rounded-full border-2 border-background",
                      item.type === 'completed' ? 'bg-success' :
                      item.type === 'assignment' ? 'bg-primary' :
                      'bg-muted-foreground'
                    )} />

                    <div className="bg-secondary/30 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{item.action}</h5>
                        <span className="text-xs text-muted-foreground">
                          {format(item.date, "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{item.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-4 space-y-4">
            <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
              <h4 className="font-medium text-sm">Ações Disponíveis</h4>
              <Separator />
              
              <div className="space-y-3">
                {notification.status === 'pending' && (
                  <Button className="w-full justify-start gap-2" variant="default">
                    <CheckCircle2 className="w-4 h-4" />
                    Marcar como Analisada
                  </Button>
                )}
                
                <Button className="w-full justify-start gap-2" variant="outline">
                  <FileText className="w-4 h-4" />
                  Criar Tarefa Vinculada
                </Button>
                
                <Button className="w-full justify-start gap-2" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                  Abrir no Tribunal
                </Button>
                
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Download className="w-4 h-4" />
                  Baixar Documento
                </Button>
                
                <Button className="w-full justify-start gap-2" variant="outline">
                  <User className="w-4 h-4" />
                  Alterar Responsável
                </Button>
              </div>
            </div>

            {notification.status === 'pending' && isUrgent && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-destructive">Atenção Urgente</h5>
                    <p className="text-xs text-destructive/80 mt-1">
                      Esta intimação possui prazo crítico. Recomendamos análise imediata.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
