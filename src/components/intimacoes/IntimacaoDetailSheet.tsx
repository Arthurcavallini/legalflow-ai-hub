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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header simplificado */}
        <div className="p-6 pb-4">
          <SheetHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs border",
                  notification.status === 'pending'
                    ? "bg-warning/10 text-warning border-warning/20"
                    : "bg-success/10 text-success border-success/20"
                )}
              >
                {notification.status === 'pending' ? 'Pendente' : 'Analisada'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {notification.type}
              </Badge>
            </div>
            <SheetTitle className="text-xl mb-1">{notification.clientName}</SheetTitle>
            <p className="text-sm text-muted-foreground font-mono">{notification.processNumber}</p>
          </SheetHeader>

          {/* Dados principais */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Responsável:</span>
              <span className="font-medium">{assignee?.name || 'Não atribuído'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Recebida em:</span>
              <span className="font-medium">{format(notification.receivedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Prazo:</span>
              <span className="font-medium">{format(notification.deadline, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          </div>

          {/* Descrição da intimação */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Conteúdo da Intimação</h4>
            <div className="p-4 bg-secondary/30 rounded-xl">
              <p className="text-sm leading-relaxed">{notification.description}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Evolução */}
        <div className="p-6">
          <h4 className="font-semibold text-sm mb-6">Evolução</h4>

          <div className="relative pl-6 space-y-5">
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border" />

            {timeline.map((item) => (
              <div key={item.id} className="relative">
                <div className={cn(
                  "absolute -left-[17px] w-3 h-3 rounded-full border-2 border-background",
                  item.type === 'completed' ? 'bg-success' :
                  item.type === 'assignment' ? 'bg-primary' :
                  'bg-muted-foreground'
                )} />

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{item.action}</h5>
                    <span className="text-xs text-muted-foreground">
                      {format(item.date, "dd/MM HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações fixas no rodapé */}
        <div className="p-6 pt-0 flex gap-3">
          {notification.status === 'pending' && (
            <Button className="flex-1 gap-2" size="lg">
              <CheckCircle2 className="w-4 h-4" />
              Marcar como Analisada
            </Button>
          )}
          <Button className="flex-1 gap-2" variant="outline" size="lg">
            <FileText className="w-4 h-4" />
            Criar Tarefa
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
