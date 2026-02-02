import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockLeads } from '@/data/mockData';
import { Lead } from '@/types';
import { 
  Phone, 
  Calendar, 
  MoreHorizontal, 
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LeadDetailSheet } from './LeadDetailSheet';
import { ConvertLeadToClientDialog } from './ConvertLeadToClientDialog';

const columns = [
  { id: 'in_conversation', label: 'Em Conversa', color: 'bg-primary' },
  { id: 'requested_quote', label: 'Pediu Orçamento', color: 'bg-cyan-500' },
  { id: 'closing_quote', label: 'Fechar Orçamento', color: 'bg-warning' },
  { id: 'waiting_service', label: 'Aguardando Atendimento', color: 'bg-purple-500' },
  { id: 'client_questions', label: 'Clientes Dúvidas', color: 'bg-orange-500' },
  { id: 'stopped_responding', label: 'Parou de responder', color: 'bg-destructive' },
  { id: 'finished', label: 'Finalizado', color: 'bg-success' },
];

// Extended lead data with more info
const getExtendedLeadData = (lead: Lead) => {
  return {
    ...lead,
    email: `${lead.name.toLowerCase().replace(' ', '.')}@email.com`,
    phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    location: 'São Paulo, SP',
    estimatedValue: Math.floor(Math.random() * 50000) + 5000,
    lastContact: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    totalMessages: Math.floor(Math.random() * 30) + 5,
    responseTime: Math.floor(Math.random() * 60) + 5,
    interests: ['Consultoria', 'Contrato', 'Processo'].slice(0, Math.floor(Math.random() * 3) + 1),
    aiSummary: generateAISummary(lead),
    conversationHistory: [
      { type: 'lead', message: 'Olá, preciso de ajuda com um processo.', time: '14:30' },
      { type: 'team', message: 'Olá! Claro, podemos ajudar. Qual tipo de processo?', time: '14:32' },
      { type: 'lead', message: 'É uma questão trabalhista, fui demitido sem justa causa.', time: '14:35' },
      { type: 'team', message: 'Entendo. Vou precisar de alguns documentos para analisar seu caso.', time: '14:38' },
    ],
  };
};

function generateAISummary(lead: Lead): string {
  const summaries = [
    `Lead interessado em ${lead.caseType}. Demonstra urgência ${lead.urgency === 'high' ? 'alta' : lead.urgency === 'medium' ? 'moderada' : 'baixa'} e probabilidade de fechamento de ${lead.probability}%. Recomenda-se follow-up imediato.`,
    `Potencial cliente para ${lead.caseType}. Conversas indicam necessidade real e orçamento disponível. Próximo passo: agendar reunião presencial.`,
    `Lead qualificado via ${lead.source}. Perfil compatível com casos de ${lead.caseType}. Interesse confirmado, aguardando proposta formal.`,
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
}

type ExtendedLead = ReturnType<typeof getExtendedLeadData>;

interface LeadCardProps {
  lead: Lead;
  onSelect: (lead: ExtendedLead) => void;
  onConvert: (lead: Lead) => void;
}

function LeadCard({ lead, onSelect, onConvert }: LeadCardProps) {
  const urgencyStyles = {
    high: 'border-l-destructive',
    medium: 'border-l-warning',
    low: 'border-l-primary',
  };

  const urgencyLabels = {
    high: { label: 'Alta', color: 'bg-destructive/10 text-destructive' },
    medium: { label: 'Média', color: 'bg-warning/10 text-warning' },
    low: { label: 'Baixa', color: 'bg-primary/10 text-primary' },
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-dropdown]')) return;
    onSelect(getExtendedLeadData(lead));
  };

  const handleConvert = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConvert(lead);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer border-l-4',
        urgencyStyles[lead.urgency]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.caseType}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-dropdown>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem className="text-sm">Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Mover para...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-sm text-success focus:text-success"
              onClick={handleConvert}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Tornar Cliente
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive text-sm">Arquivar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-xs mb-3">
        {lead.source === 'whatsapp' && (
          <Badge className="bg-success/10 text-success text-[10px]">
            <MessageSquare className="w-3 h-3 mr-1" />
            WhatsApp
          </Badge>
        )}
        <Badge className={cn("text-[10px]", urgencyLabels[lead.urgency].color)}>
          {urgencyLabels[lead.urgency].label}
        </Badge>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-3 border-t border-border/50">
        <Calendar className="w-3 h-3" />
        {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [selectedLead, setSelectedLead] = useState<ExtendedLead | null>(null);
  const [convertLeadOpen, setConvertLeadOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  
  const getLeadsByStatus = (status: string) =>
    mockLeads.filter((lead) => lead.status === status);

  const handleConvertLead = (lead: Lead) => {
    setLeadToConvert(lead);
    setConvertLeadOpen(true);
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 h-[calc(100vh-220px)]">
        {columns.map((column) => {
          const leads = getLeadsByStatus(column.id);
          return (
            <div key={column.id} className="flex-1 min-w-[280px] bg-secondary/30 rounded-xl p-4 border border-border flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2.5 h-2.5 rounded-full', column.color)} />
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                </div>
                <Badge variant="outline" className="text-xs font-semibold">
                  {leads.length}
                </Badge>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {leads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onSelect={setSelectedLead} 
                    onConvert={handleConvertLead}
                  />
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

      {/* Lead Detail Sheet */}
      <LeadDetailSheet 
        lead={selectedLead} 
        open={!!selectedLead} 
        onOpenChange={(open) => !open && setSelectedLead(null)} 
      />

      {/* Convert Lead to Client Dialog */}
      <ConvertLeadToClientDialog 
        open={convertLeadOpen}
        onOpenChange={setConvertLeadOpen}
        lead={leadToConvert}
      />
    </>
  );
}
