import { MainLayout } from '@/components/layout/MainLayout';
import { mockLeads } from '@/data/mockData';
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
      <div className="flex h-[calc(100vh-180px)] bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
        {/* Conversations List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar conversas..."
                className="pl-9"
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
                    'p-4 cursor-pointer transition-colors',
                    selectedConversation.id === conv.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-primary">
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
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedConversation.name}</p>
                <p className="text-xs text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Bot className="w-3 h-3" />
                IA Ativa
              </Badge>
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
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
                      'max-w-[70%] rounded-2xl px-4 py-2.5',
                      msg.sender === 'client' 
                        ? 'bg-secondary text-foreground rounded-bl-md' 
                        : msg.sender === 'ai'
                        ? 'bg-primary/10 text-foreground rounded-br-md border border-primary/20'
                        : 'bg-primary text-primary-foreground rounded-br-md'
                    )}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-medium">IA</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] opacity-70">
                        {msg.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender !== 'client' && (
                        msg.read ? <CheckCheck className="w-3 h-3 text-primary" /> : <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Textarea
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
              />
              <Button size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <Bot className="w-3 h-3" />
                Sugerir resposta
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <User className="w-3 h-3" />
                Assumir conversa
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <MessageSquare className="w-3 h-3" />
                Enviar proposta
              </Button>
            </div>
          </div>
        </div>

        {/* Lead Info Panel */}
        <div className="w-72 border-l border-border p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Informações do Lead</h3>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge className="status-new">Novo Lead</Badge>
            </div>
            
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Tipo de Caso</p>
              <p className="text-sm font-medium">Trabalhista</p>
            </div>
            
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Urgência</p>
              <Badge variant="destructive">Alta</Badge>
            </div>
            
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Probabilidade</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full">
                  <div className="h-full w-[75%] bg-primary rounded-full" />
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium text-primary">Análise da IA</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Lead qualificado. Recomendação: agendar consulta e solicitar TRCT e contracheques.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
              Converter para Cliente
            </Button>
            <Button variant="outline" className="w-full gap-2">
              Enviar Proposta
            </Button>
            <Button variant="outline" className="w-full gap-2">
              Gerar Contrato
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
