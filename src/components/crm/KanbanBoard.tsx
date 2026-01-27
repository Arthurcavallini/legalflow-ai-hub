import { cn } from '@/lib/utils';
import { mockLeads } from '@/data/mockData';
import { Lead } from '@/types';
import { Phone, Mail, Calendar, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columns = [
  { id: 'new', label: 'Novos', color: 'bg-blue-500' },
  { id: 'qualified', label: 'Qualificados', color: 'bg-emerald-500' },
  { id: 'proposal', label: 'Proposta Enviada', color: 'bg-amber-500' },
  { id: 'negotiation', label: 'Em Negociação', color: 'bg-purple-500' },
  { id: 'closed', label: 'Fechados', color: 'bg-emerald-600' },
];

function LeadCard({ lead }: { lead: Lead }) {
  const urgencyStyles = {
    high: 'border-l-destructive',
    medium: 'border-l-amber-500',
    low: 'border-l-blue-500',
  };

  return (
    <div
      className={cn(
        'kanban-card border-l-4 animate-fade-in',
        urgencyStyles[lead.urgency]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.caseType}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Mover para...</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {lead.notes && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {lead.notes}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        {lead.source === 'whatsapp' && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            <MessageSquare className="w-3 h-3" />
            WhatsApp
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Phone className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
          {lead.email && (
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Mail className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${lead.probability}%` }}
            />
          </div>
          <span className="text-xs font-medium">{lead.probability}%</span>
        </div>
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
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={cn('w-2.5 h-2.5 rounded-full', column.color)} />
                <h3 className="font-medium text-sm">{column.label}</h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                {leads.length}
              </span>
            </div>
            <div className="space-y-3">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              {leads.length === 0 && (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground">
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
