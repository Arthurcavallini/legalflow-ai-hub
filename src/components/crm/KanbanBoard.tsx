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
  { id: 'qualified', label: 'Qualificados', color: 'bg-success' },
  { id: 'proposal', label: 'Proposta Enviada', color: 'bg-warning' },
  { id: 'negotiation', label: 'Em Negociação', color: 'bg-purple-500' },
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
        'kanban-card border-l-4 animate-fade-in',
        urgencyStyles[lead.urgency]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.caseType}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-secondary">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl">
            <DropdownMenuItem className="rounded-lg cursor-pointer">Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer">Editar</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer">Mover para...</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer">Arquivar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {lead.notes && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 bg-secondary/50 rounded-lg p-2">
          {lead.notes}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        {lead.source === 'whatsapp' && (
          <Badge className="bg-success/20 text-success text-xs rounded-lg">
            <MessageSquare className="w-3 h-3 mr-1" />
            WhatsApp
          </Badge>
        )}
        <Badge variant="outline" className={cn("text-xs rounded-lg", urgencyLabels[lead.urgency].color)}>
          {urgencyLabels[lead.urgency].label}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary">
            <Phone className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary">
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
              style={{ width: `${lead.probability}%` }}
            />
          </div>
          <span className="text-xs font-bold text-foreground">{lead.probability}%</span>
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
          <div key={column.id} className="kanban-column min-w-[320px] flex-shrink-0">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className={cn('w-3 h-3 rounded-full', column.color)} />
                <h3 className="font-semibold text-sm text-foreground">{column.label}</h3>
              </div>
              <Badge variant="outline" className="text-xs font-bold rounded-lg">
                {leads.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              {leads.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground">
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