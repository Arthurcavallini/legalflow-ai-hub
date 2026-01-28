import { Lead } from '@/types';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  Clock, 
  TrendingUp,
  Sparkles,
  User,
  DollarSign,
  Edit,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  conversationHistory: { type: string; message: string; time: string }[];
}

interface LeadDetailSheetProps {
  lead: ExtendedLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailSheet({ lead, open, onOpenChange }: LeadDetailSheetProps) {
  if (!lead) return null;

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
          <SheetHeader className="space-y-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-2xl">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xl rounded-2xl">
                  {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <SheetTitle className="text-xl font-bold text-foreground">
                    {lead.name}
                  </SheetTitle>
                </div>
                <p className="text-sm text-muted-foreground">{lead.caseType}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn("text-xs", statusLabels[lead.status as keyof typeof statusLabels]?.color)}>
                    {statusLabels[lead.status as keyof typeof statusLabels]?.label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs border", urgencyLabels[lead.urgency].color)}>
                    Urgência {urgencyLabels[lead.urgency].label}
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <Phone className="w-4 h-4" />
              Ligar
            </Button>
            <Button size="sm" className="gap-2 rounded-xl flex-1 bg-success hover:bg-success/90">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl flex-1">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Summary Card */}
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Resumo da IA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{lead.aiSummary}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-primary">{lead.probability}%</p>
              <p className="text-xs text-muted-foreground">Probabilidade</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-success/10 border border-success/20">
              <p className="text-lg font-bold text-success">{formatCurrency(lead.estimatedValue)}</p>
              <p className="text-xs text-muted-foreground">Valor Est.</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-2xl font-bold text-warning">{lead.totalMessages}</p>
              <p className="text-xs text-muted-foreground">Mensagens</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{lead.responseTime}m</p>
              <p className="text-xs text-muted-foreground">Tempo Resp.</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-medium">{lead.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Localização</p>
                  <p className="text-sm font-medium">{lead.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="text-sm font-medium capitalize">{lead.source}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="conversation" className="space-y-4">
            <TabsList className="w-full bg-secondary/50 rounded-xl p-1 h-auto">
              <TabsTrigger value="conversation" className="flex-1 rounded-lg py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Conversa
              </TabsTrigger>
              <TabsTrigger value="interests" className="flex-1 rounded-lg py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Interesses
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 rounded-lg py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Clock className="w-4 h-4 mr-2" />
                Atividade
              </TabsTrigger>
            </TabsList>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="space-y-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold">Histórico de Mensagens</h4>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                  <MessageSquare className="w-4 h-4" />
                  Abrir Chat
                </Button>
              </div>
              
              <div className="space-y-3">
                {lead.conversationHistory.map((msg, idx) => (
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

            {/* Interests Tab */}
            <TabsContent value="interests" className="space-y-4 mt-4">
              <h4 className="text-sm font-semibold mb-3">Áreas de Interesse</h4>
              <div className="flex flex-wrap gap-2">
                {lead.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm px-3 py-1.5">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              {lead.notes && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">Observações</h4>
                  <p className="text-sm text-muted-foreground bg-secondary/40 rounded-xl p-4">
                    {lead.notes}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Histórico de atividades</p>
                <p className="text-xs text-muted-foreground">Em breve você poderá ver todas as interações</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
