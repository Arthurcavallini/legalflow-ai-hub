import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockLeads } from '@/data/mockData';
import { Lead } from '@/types';
import { 
  Phone, 
  Calendar, 
  MoreHorizontal, 
  MessageSquare, 
  Mail, 
  MapPin, 
  FileText, 
  Clock, 
  TrendingUp,
  Sparkles,
  User,
  Briefcase,
  DollarSign,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface LeadCardProps {
  lead: Lead;
  onSelect: (lead: ReturnType<typeof getExtendedLeadData>) => void;
}

function LeadCard({ lead, onSelect }: LeadCardProps) {
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

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Progress value={lead.probability} className="w-16 h-1.5" />
          <span className="text-xs font-bold text-primary">{lead.probability}%</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </div>
  );
}

// AI Summary Floating Bubble
function AISummaryBubble({ summary, isVisible }: { summary: string; isVisible: boolean }) {
  if (!isVisible) return null;
  
  return (
    <div className="absolute -top-2 -right-2 z-10">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse cursor-pointer group">
          <Sparkles className="w-4 h-4 text-white" />
          
          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-popover border border-border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold text-purple-500">Resumo IA</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </div>
        
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [selectedLead, setSelectedLead] = useState<ReturnType<typeof getExtendedLeadData> | null>(null);
  
  const getLeadsByStatus = (status: string) =>
    mockLeads.filter((lead) => lead.status === status);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const urgencyLabels = {
    high: { label: 'Alta', color: 'bg-destructive/10 text-destructive border-destructive/20' },
    medium: { label: 'Média', color: 'bg-warning/10 text-warning border-warning/20' },
    low: { label: 'Baixa', color: 'bg-primary/10 text-primary border-primary/20' },
  };

  const statusLabels = {
    new: { label: 'Novo', color: 'bg-primary/10 text-primary' },
    qualified: { label: 'Qualificado', color: 'bg-cyan-500/10 text-cyan-600' },
    proposal: { label: 'Proposta', color: 'bg-warning/10 text-warning' },
    negotiation: { label: 'Negociação', color: 'bg-purple-500/10 text-purple-600' },
    closed: { label: 'Fechado', color: 'bg-success/10 text-success' },
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {columns.map((column) => {
          const leads = getLeadsByStatus(column.id);
          return (
            <div key={column.id} className="flex-1 min-w-[280px] bg-secondary/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
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
                  <div key={lead.id} className="relative">
                    <AISummaryBubble 
                      summary={generateAISummary(lead)} 
                      isVisible={lead.source === 'whatsapp'} 
                    />
                    <LeadCard lead={lead} onSelect={setSelectedLead} />
                  </div>
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

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
          {selectedLead && (
            <>
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {selectedLead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-1">{selectedLead.name}</DialogTitle>
                    <p className="text-muted-foreground">{selectedLead.caseType}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn("text-xs", statusLabels[selectedLead.status as keyof typeof statusLabels]?.color)}>
                        {statusLabels[selectedLead.status as keyof typeof statusLabels]?.label}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs border", urgencyLabels[selectedLead.urgency].color)}>
                        Urgência {urgencyLabels[selectedLead.urgency].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Phone className="w-4 h-4" />
                      Ligar
                    </Button>
                    <Button size="sm" className="gap-1.5 bg-success hover:bg-success/90">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Summary Card */}
              <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Resumo da IA</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedLead.aiSummary}</p>
              </div>

              <Tabs defaultValue="info" className="p-6 pt-4">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="conversation">Conversa</TabsTrigger>
                  <TabsTrigger value="activity">Atividade</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6 mt-0">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4">Dados de Contato</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase">Email</p>
                          <p className="text-sm font-medium truncate">{selectedLead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Telefone</p>
                          <p className="text-sm font-medium">{selectedLead.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Localização</p>
                          <p className="text-sm font-medium">{selectedLead.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Origem</p>
                          <p className="text-sm font-medium capitalize">{selectedLead.source}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4">Indicadores</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-xl font-bold text-primary">{selectedLead.probability}%</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Probabilidade</p>
                      </div>
                      <div className="text-center p-4 bg-success/5 rounded-xl border border-success/10">
                        <p className="text-xl font-bold text-success">{formatCurrency(selectedLead.estimatedValue)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Valor Est.</p>
                      </div>
                      <div className="text-center p-4 bg-warning/5 rounded-xl border border-warning/10">
                        <p className="text-xl font-bold text-warning">{selectedLead.totalMessages}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Mensagens</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
                        <p className="text-xl font-bold text-foreground">{selectedLead.responseTime}m</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Tempo Resp.</p>
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Interesses</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.interests.map((interest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedLead.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Observações</h4>
                      <p className="text-sm text-muted-foreground bg-secondary/40 rounded-xl p-4">
                        {selectedLead.notes}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="conversation" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold">Histórico de Mensagens</h4>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      Abrir Chat
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedLead.conversationHistory.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "p-3 rounded-xl max-w-[80%]",
                          msg.type === 'lead' 
                            ? "bg-secondary/50 ml-0 mr-auto" 
                            : "bg-primary/10 ml-auto mr-0"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-0">
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Histórico de atividades em breve</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
