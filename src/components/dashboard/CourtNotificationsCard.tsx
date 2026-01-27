import { mockCourtNotifications, mockTeamMembers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CourtNotificationsCard() {
  const getAssigneeName = (id: string) => {
    const member = mockTeamMembers.find(m => m.id === id);
    return member?.name || 'Não atribuído';
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Novas Intimações</h3>
        </div>
        <Badge variant="secondary" className="font-medium">
          {mockCourtNotifications.filter(n => n.status === 'pending').length} novas
        </Badge>
      </div>
      
      <div className="space-y-3">
        {mockCourtNotifications.slice(0, 4).map((notification) => {
          const daysLeft = getDaysUntilDeadline(notification.deadline);
          const isUrgent = daysLeft <= 5;
          const isOverdue = daysLeft < 0;
          
          return (
            <div
              key={notification.id}
              className={cn(
                'p-3 rounded-lg border cursor-pointer transition-colors',
                isOverdue ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                isUrgent ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' :
                'bg-secondary/50 border-transparent hover:bg-secondary'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{notification.type}</p>
                  <p className="text-xs text-muted-foreground">{notification.clientName}</p>
                </div>
                <Badge 
                  variant={isOverdue ? 'destructive' : isUrgent ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {isOverdue ? 'Vencido' : `${daysLeft} dias`}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {notification.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Processo: {notification.processNumber.slice(0, 15)}...
                </span>
                <span className="text-muted-foreground">
                  → {getAssigneeName(notification.assignedTo).split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium hover:underline">
        Ver todas as intimações
      </button>
    </div>
  );
}
