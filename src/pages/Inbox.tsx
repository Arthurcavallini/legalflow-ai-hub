import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Bot,
  User,
  MessageSquare,
  Check,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const mockConversations = [
  {
    id: '1',
    leadId: '1',
    name: 'Maria Silva',
    phone: '+55 11 99999-1234',
    lastMessage: 'Olá, gostaria de saber sobre processos trabalhistas',
    lastMessageTime: new Date('2024-01-15T10:30:00'),
    unread: 2,
    status: 'active' as const,
  },
  {
    id: '2',
    leadId: '7',
    name: 'Fernanda Costa',
    phone: '+55 11 93333-5678',
    lastMessage: 'Obrigada pelas informações!',
    lastMessageTime: new Date('2024-01-15T09:15:00'),
    unread: 0,
    status: 'active' as const,
  },
  {
    id: '3',
    leadId: '5',
    name: 'Lucia Mendes',
    phone: '+55 11 95555-7890',
    lastMessage: 'Vocês atendem casos de consumidor?',
    lastMessageTime: new Date('2024-01-15T08:00:00'),
    unread: 1,
    status: 'waiting' as const,
  },
  {
    id: '4',
    leadId: '2',
    name: 'João Santos',
    phone: '+55 11 98888-5678',
    lastMessage: 'Vou enviar os documentos amanhã',
    lastMessageTime: new Date('2024-01-14T16:45:00'),
    unread: 0,
    status: 'active' as const,
  },
];

const mockMessages = [
  { id: '1', content: 'Olá! Gostaria de saber sobre processos trabalhistas', sender: 'client' as const, time: new Date('2024-01-15T10:00:00'), read: true },
  { id: '2', content: 'Olá Maria! Claro, posso ajudar. Qual é a sua situação?', sender: 'ai' as const, time: new Date('2024-01-15T10:01:00'), read: true },
  { id: '3', content: 'Fui demitida sem justa causa há 2 semanas. Trabalhei 5 anos na empresa.', sender: 'client' as const, time: new Date('2024-01-15T10:05:00'), read: true },
  { id: '4', content: 'Entendo sua situação. Com 5 anos de empresa, você tem direito a diversas verbas rescisórias como: aviso prévio, férias proporcionais, 13º proporcional, FGTS + multa de 40%, e seguro desemprego.\n\nVocê recebeu o Termo de Rescisão (TRCT)?', sender: 'ai' as const, time: new Date('2024-01-15T10:06:00'), read: true },
  { id: '5', content: 'Recebi sim, mas acho que os valores estão errados', sender: 'client' as const, time: new Date('2024-01-15T10:15:00'), read: true },
  { id: '6', content: 'Isso é muito comum. Podemos fazer uma análise detalhada do seu TRCT para verificar se há diferenças.\n\nPosso agendar uma consulta com um de nossos advogados especialistas em direito trabalhista?', sender: 'ai' as const, time: new Date('2024-01-15T10:16:00'), read: true },
  { id: '7', content: 'Sim, gostaria de agendar', sender: 'client' as const, time: new Date('2024-01-15T10:30:00'), read: false },
];

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <MainLayout title="Atendimento" subtitle="Conversas do WhatsApp">
      <div className="flex h-[calc(100vh-180px)] metric-card p-0 overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar conversas..."
                className="pl-9 bg-secondary border-0 rounded-xl"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {mockConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    'p-4 cursor-pointer transition-all',
                    selectedConversation.id === conv.id 
                      ? 'bg-primary/10 border-l-2 border-l-primary' 
                      : 'hover:bg-secondary/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11 rounded-xl">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold rounded-xl">
                        {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate text-foreground">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="h-5 min-w-[20px] flex items-center justify-center p-0 bg-primary rounded-full text-xs font-bold">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background/50">
          {/* Chat Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold rounded-xl">
                  {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{selectedConversation.name}</p>
                <p className="text-xs text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 rounded-lg bg-success/20 text-success border-success/30">
                <Bot className="w-3 h-3" />
                IA Ativa
              </Badge>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-5">
            <div className="space-y-4 max-w-3xl mx-auto">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender === 'client' ? 'justify-start' : 'justify-end'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                      msg.sender === 'client' 
                        ? 'bg-card text-foreground rounded-bl-md border border-border' 
                        : msg.sender === 'ai'
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 text-foreground rounded-br-md border border-primary/20'
                        : 'bg-primary text-primary-foreground rounded-br-md'
                    )}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-semibold">Assistente IA</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-2">
                      <span className="text-[10px] opacity-60">
                        {msg.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender !== 'client' && (
                        msg.read ? <CheckCheck className="w-3.5 h-3.5 text-primary" /> : <Check className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-end gap-3 max-w-3xl mx-auto">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Textarea
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[48px] max-h-32 resize-none bg-secondary border-0 rounded-xl"
                rows={1}
              />
              <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-3 max-w-3xl mx-auto">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 rounded-xl">
                <Sparkles className="w-3 h-3" />
                Sugerir resposta
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 rounded-xl">
                <User className="w-3 h-3" />
                Assumir conversa
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 rounded-xl">
                <MessageSquare className="w-3 h-3" />
                Enviar proposta
              </Button>
            </div>
          </div>
        </div>

        {/* Lead Info Panel */}
        <div className="w-80 border-l border-border p-5 overflow-y-auto bg-card">
          <h3 className="font-bold text-foreground mb-5">Informações do Lead</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-2">Status</p>
              <Badge className="bg-primary/20 text-primary rounded-lg">Novo Lead</Badge>
            </div>
            
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-2">Tipo de Caso</p>
              <p className="text-sm font-semibold text-foreground">Trabalhista</p>
            </div>
            
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-2">Urgência</p>
              <Badge className="bg-destructive/20 text-destructive rounded-lg">Alta</Badge>
            </div>
            
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-2">Probabilidade de Conversão</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-gradient-to-r from-primary to-primary/70 rounded-full" />
                </div>
                <span className="text-sm font-bold text-foreground">75%</span>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-primary">Análise da IA</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lead qualificado. Recomendação: agendar consulta e solicitar TRCT e contracheques.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
              Converter para Cliente
            </Button>
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              Enviar Proposta
            </Button>
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              Gerar Contrato
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}