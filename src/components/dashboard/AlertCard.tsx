import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, FileText, MessageSquare } from 'lucide-react';

type AlertType = 'overdue' | 'deadline' | 'document' | 'lead';

interface AlertCardProps {
  type: AlertType;
  title: string;
  items: Array<{
    id: string;
    label: string;
    sublabel?: string;
    urgent?: boolean;
  }>;
}

const alertConfig: Record<AlertType, { icon: React.ElementType; color: string; bg: string }> = {
  overdue: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  deadline: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  document: {
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  lead: {
    icon: MessageSquare,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
};

export function AlertCard({ type, title, items }: AlertCardProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('p-1.5 rounded-lg', config.bg)}>
          <Icon className={cn('w-4 h-4', config.color)} />
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.label}</p>
              {item.sublabel && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.sublabel}
                </p>
              )}
            </div>
            {item.urgent && (
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-destructive ml-2" />
            )}
          </div>
        ))}
        {items.length > 4 && (
          <button className="w-full text-center text-xs text-accent font-medium py-2 hover:underline">
            Ver mais {items.length - 4} itens
          </button>
        )}
      </div>
    </div>
  );
}
