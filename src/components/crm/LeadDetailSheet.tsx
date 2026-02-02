import { Lead } from '@/types';
import { Phone, MessageSquare, Clock, Sparkles, Edit, Send, Eye, PhoneCall, FileText, UserCheck, Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
interface ExtendedLead extends Lead {
  email: string;
  phone: string;
  location: string;
  estimatedValue: number;
  lastContact: Date;
  totalMessages: number;
  responseTime: number;
  interests: string[];
  aiSummary: string;
  aiEnabled?: boolean;
  conversationHistory: {
    type: string;
    message: string;
    time: string;
  }[];
}
interface LeadDetailSheetProps {
  lead: ExtendedLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock timeline data
const timelineEvents = [{
  id: 1,
  type: 'message',
  action: 'Enviou mensagem',
  detail: 'Olá, preciso de ajuda com um processo.',
  time: '14:30',
  date: 'Hoje'
}, {
  id: 2,
  type: 'response',
  action: 'Recebeu resposta',
  detail: 'Olá! Claro, podemos ajudar.',
  time: '14:32',
  date: 'Hoje'
}, {
  id: 3,
  type: 'message',
  action: 'Enviou mensagem',
  detail: 'É uma questão trabalhista.',
  time: '14:35',
  date: 'Hoje'
}, {
  id: 4,
  type: 'view',
  action: 'Visualizou proposta',
  detail: 'Proposta comercial #2024-001',
  time: '10:15',
  date: 'Ontem'
}, {
  id: 5,
  type: 'call',
  action: 'Ligação recebida',
  detail: 'Duração: 5 min',
  time: '16:42',
  date: 'Ontem'
}, {
  id: 6,
  type: 'status',
  action: 'Status alterado',
  detail: 'Novo → Qualificado',
  time: '09:00',
  date: '28 Jan'
}, {
  id: 7,
  type: 'created',
  action: 'Lead criado',
  detail: 'Origem: WhatsApp',
  time: '18:30',
  date: '27 Jan'
}];
export function LeadDetailSheet({
  lead,
  open,
  onOpenChange
}: LeadDetailSheetProps) {
  if (!lead) return null;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };
  const urgencyLabels = {
    high: {
      label: 'Alta',
      color: 'bg-destructive/10 text-destructive border-destructive/20'
    },
    medium: {
      label: 'Média',
      color: 'bg-warning/10 text-warning border-warning/20'
    },
    low: {
      label: 'Baixa',
      color: 'bg-primary/10 text-primary border-primary/20'
    }
  };
  const statusLabels = {
    new: {
      label: 'Novo',
      color: 'bg-primary/10 text-primary'
    },
    qualified: {
      label: 'Qualificado',
      color: 'bg-cyan-500/10 text-cyan-600'
    },
    proposal: {
      label: 'Proposta',
      color: 'bg-warning/10 text-warning'
    },
    negotiation: {
      label: 'Negociação',
      color: 'bg-purple-500/10 text-purple-600'
    },
    closed: {
      label: 'Fechado',
      color: 'bg-success/10 text-success'
    }
  };
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'message':
        return Send;
      case 'response':
        return MessageSquare;
      case 'view':
        return Eye;
      case 'call':
        return PhoneCall;
      case 'status':
        return UserCheck;
      case 'created':
        return FileText;
      default:
        return Clock;
    }
  };
  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'response':
        return 'bg-success/10 text-success border-success/20';
      case 'view':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'call':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'status':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'created':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };
  return <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-card border-border overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-5">
          <SheetHeader className="space-y-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 rounded-2xl ring-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold text-lg rounded-2xl">
                  {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg font-semibold text-foreground truncate">
                  {lead.name}
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{lead.caseType}</p>
                
              </div>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl h-9 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </Button>
            </div>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* AI Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                lead.aiEnabled !== false ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Bot className={cn(
                  'w-4 h-4',
                  lead.aiEnabled !== false ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Atendimento IA</p>
                <p className="text-xs text-muted-foreground">
                  {lead.aiEnabled !== false ? 'Bot ativo para este lead' : 'Atendimento manual'}
                </p>
              </div>
            </div>
            <Switch 
              checked={lead.aiEnabled !== false} 
              onCheckedChange={() => {}}
            />
          </div>
          {/* AI Summary Card */}
          <div className="p-4 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 border border-purple-500/10 rounded-2xl">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Resumo IA</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{lead.aiSummary}</p>
          </div>

          {/* Product Interest & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Serviço de Interesse</p>
              <p className="text-sm font-semibold text-foreground">{lead.caseType}</p>
            </div>
            <div className="p-4 rounded-xl bg-success/5 border border-success/10">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Valor Estimado</p>
              <p className="text-base font-bold text-success">{formatCurrency(lead.estimatedValue)}</p>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Telefone</p>
              <p className="text-sm font-semibold text-foreground">{lead.phone}</p>
            </div>
          </div>

          {/* Timeline Tab */}
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList className="w-full bg-secondary/30 rounded-xl p-1 h-auto border border-border/50">
              <TabsTrigger value="timeline" className="flex-1 rounded-lg py-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Linha do Tempo
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex-1 rounded-lg py-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Conversas
              </TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-0 mt-4">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                
                <div className="space-y-4">
                  {timelineEvents.map((event, idx) => {
                  const Icon = getTimelineIcon(event.type);
                  return <div key={event.id} className="relative flex gap-4 pl-0">
                        <div className={cn("relative z-10 w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0", getTimelineColor(event.type))}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 pb-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">{event.action}</p>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {event.date} · {event.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.detail}</p>
                        </div>
                      </div>;
                })}
                </div>
              </div>
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mensagens</h4>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-lg h-7 text-xs">
                  <MessageSquare className="w-3 h-3" />
                  Abrir Chat
                </Button>
              </div>
              
              <div className="space-y-2">
                {lead.conversationHistory.map((msg, idx) => <div key={idx} className={cn("p-3 rounded-xl max-w-[85%]", msg.type === 'lead' ? "bg-secondary/50 ml-0 mr-auto" : "bg-primary/10 ml-auto mr-0")}>
                    <p className="text-[13px] leading-relaxed">{msg.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{msg.time}</p>
                  </div>)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>;
}