import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Gavel,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  ExternalLink,
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
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header com dados do cliente */}
        <div className="p-6 pb-4">
          <SheetHeader>
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-2xl",
                isUrgent ? "bg-destructive/10" : notification.status === 'acknowledged' ? "bg-success/10" : "bg-warning/10"
              )}>
                <Gavel className={cn(
                  "w-6 h-6",
                  isUrgent ? "text-destructive" : notification.status === 'acknowledged' ? "text-success" : "text-warning"
                )} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
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
                <SheetTitle className="text-xl">{notification.clientName}</SheetTitle>
                <p className="text-sm text-muted-foreground font-mono">{notification.processNumber}</p>
              </div>
            </div>
          </SheetHeader>

          {/* Info resumida */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-secondary/30 rounded-xl">
              <Calendar className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Prazo</p>
              <p className={cn("text-sm font-semibold", isUrgent && "text-destructive")}>
                {daysUntil > 0 ? `${daysUntil} dias` : daysUntil === 0 ? 'Hoje' : `${Math.abs(daysUntil)}d atraso`}
              </p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-xl">
              <User className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Responsável</p>
              <p className="text-sm font-semibold truncate">{assignee?.name.split(' ')[0] || '—'}</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-xl">
              <FileText className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Recebida</p>
              <p className="text-sm font-semibold">{format(notification.receivedAt, "dd/MM", { locale: ptBR })}</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-4 p-4 bg-secondary/20 rounded-xl">
            <p className="text-sm text-foreground/90">{notification.description}</p>
          </div>
        </div>

        <Separator />

        {/* Evolução */}
        <div className="p-6">
          <h4 className="font-semibold text-sm mb-6">Evolução do Processo</h4>

          <div className="relative pl-6 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border" />

            {timeline.map((item) => (
              <div key={item.id} className="relative">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute -left-[17px] w-3 h-3 rounded-full border-2 border-background",
                  item.type === 'completed' ? 'bg-success' :
                  item.type === 'assignment' ? 'bg-primary' :
                  'bg-muted-foreground'
                )} />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{item.action}</h5>
                    <span className="text-xs text-muted-foreground">
                      {format(item.date, "dd/MM HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                        {item.user.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações fixas no rodapé */}
        <div className="p-6 pt-0 space-y-3">
          {notification.status === 'pending' && (
            <Button className="w-full gap-2" size="lg">
              <CheckCircle2 className="w-4 h-4" />
              Marcar como Analisada
            </Button>
          )}
          <Button className="w-full gap-2" variant="outline" size="lg">
            <ExternalLink className="w-4 h-4" />
            Abrir no Tribunal
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
