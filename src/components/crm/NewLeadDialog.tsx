import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, User, Phone, Mail, MessageSquare, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTeamMembers } from '@/data/mockData';

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLeadDialog({ open, onOpenChange }: NewLeadDialogProps) {
  const [aiEnabled, setAiEnabled] = useState(true);

  const sources = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Indicação' },
    { value: 'other', label: 'Outro' },
  ];

  const caseTypes = [
    'Trabalhista',
    'Previdenciário',
    'Família',
    'Consumidor',
    'Cível',
    'Criminal',
    'Tributário',
    'Empresarial',
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Baixa', color: 'bg-primary/10 text-primary' },
    { value: 'medium', label: 'Média', color: 'bg-warning/10 text-warning' },
    { value: 'high', label: 'Alta', color: 'bg-destructive/10 text-destructive' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Novo Lead</DialogTitle>
          <DialogDescription>
            Adicione um novo lead ao funil de vendas.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* AI Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                aiEnabled ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Bot className={cn(
                  'w-4 h-4',
                  aiEnabled ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Atendimento IA</p>
                <p className="text-xs text-muted-foreground">
                  {aiEnabled ? 'Bot ativo para este lead' : 'Atendimento manual'}
                </p>
              </div>
            </div>
            <Switch 
              checked={aiEnabled} 
              onCheckedChange={setAiEnabled}
            />
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Nome Completo
              </Label>
              <Input id="name" placeholder="Ex: Maria Silva" className="h-10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  Telefone
                </Label>
                <Input id="phone" placeholder="(11) 99999-9999" className="h-10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Email (opcional)
                </Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" className="h-10" />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                  Origem
                </Label>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map(source => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  Tipo de Caso
                </Label>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Urgência</Label>
                <div className="flex gap-2">
                  {urgencyLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all',
                        'hover:ring-2 hover:ring-primary/20',
                        'bg-secondary/50 border-border text-muted-foreground'
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Responsável</Label>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.filter(m => m.status === 'active').map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              placeholder="Detalhes adicionais sobre o lead..." 
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Criar Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
