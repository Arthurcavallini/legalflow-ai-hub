import { cn } from '@/lib/utils';
import { mockLeads } from '@/data/mockData';
import { Lead } from '@/types';
import { Phone, Calendar, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columns = [
  { id: 'new', label: 'Novos', color: 'bg-primary' },
  { id: 'qualified', label: 'Qualificados', color: 'bg-cyan-500' },
  { id: 'proposal', label: 'Proposta', color: 'bg-warning' },
  { id: 'negotiation', label: 'Negociação', color: 'bg-purple-500' },
  { id: 'closed', label: 'Fechados', color: 'bg-success' },
];

function LeadCard({ lead }: { lead: Lead }) {
  const urgencyStyles = {
    high: 'border-l-destructive',
    medium: 'border-l-warning',
    low: 'border-l-primary',
  };

  const urgencyLabels = {
    high: { label: 'Alta', color: 'bg-destructive/20 text-destructive' },
    medium: { label: 'Média', color: 'bg-warning/20 text-warning' },
    low: { label: 'Baixa', color: 'bg-primary/20 text-primary' },
  };

  return (
    <div
      className={cn(
        'kanban-card border-l-4',
        urgencyStyles[lead.urgency]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.caseType}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem className="text-sm">Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Mover para...</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive text-sm">Arquivar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {lead.notes && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 bg-secondary/50 rounded-lg p-2">
          {lead.notes}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs mb-3">
        {lead.source === 'whatsapp' && (
          <Badge className="bg-success/20 text-success text-[10px]">
            <MessageSquare className="w-3 h-3 mr-1" />
            WhatsApp
          </Badge>
        )}
        <Badge className={cn("text-[10px]", urgencyLabels[lead.urgency].color)}>
          {urgencyLabels[lead.urgency].label}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary">
            <Phone className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary">
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${lead.probability}%` }}
            />
          </div>
          <span className="text-xs font-bold">{lead.probability}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const getLeadsByStatus = (status: string) =>
    mockLeads.filter((lead) => lead.status === status);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const leads = getLeadsByStatus(column.id);
        return (
          <div key={column.id} className="kanban-column min-w-[300px] flex-shrink-0">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className={cn('w-2.5 h-2.5 rounded-full', column.color)} />
                <h3 className="font-semibold text-sm">{column.label}</h3>
              </div>
              <Badge variant="outline" className="text-xs font-semibold">
                {leads.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              {leads.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg text-xs text-muted-foreground">
                  Nenhum lead
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
