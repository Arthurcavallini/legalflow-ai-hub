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
import { Bot, User, Phone, Mail, MapPin, CreditCard, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockLeads } from '@/data/mockData';

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewClientDialog({ open, onOpenChange }: NewClientDialogProps) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [fromLead, setFromLead] = useState(false);

  // Leads que podem ser convertidos (não fechados ainda)
  const convertibleLeads = mockLeads.filter(l => l.status !== 'closed' && l.status !== 'lost');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Novo Cliente</DialogTitle>
          <DialogDescription>
            Cadastre um novo cliente no sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Convert from Lead */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                fromLead ? 'bg-success/10' : 'bg-muted'
              )}>
                <FileText className={cn(
                  'w-4 h-4',
                  fromLead ? 'text-success' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Converter de Lead</p>
                <p className="text-xs text-muted-foreground">
                  {fromLead ? 'Importar dados de um lead existente' : 'Cadastro manual'}
                </p>
              </div>
            </div>
            <Switch 
              checked={fromLead} 
              onCheckedChange={setFromLead}
            />
          </div>

          {fromLead && (
            <div className="grid gap-2">
              <Label>Selecionar Lead</Label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Escolha um lead para converter" />
                </SelectTrigger>
                <SelectContent>
                  {convertibleLeads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      <div className="flex items-center gap-2">
                        <span>{lead.name}</span>
                        <span className="text-xs text-muted-foreground">· {lead.caseType}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                  {aiEnabled ? 'Bot ativo para este cliente' : 'Atendimento manual'}
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
              <Input id="name" placeholder="Ex: Roberto Almeida" className="h-10" />
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
                  Email
                </Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" className="h-10" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpf" className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                CPF
              </Label>
              <Input id="cpf" placeholder="000.000.000-00" className="h-10" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                Endereço
              </Label>
              <Input id="address" placeholder="Rua, número, bairro - Cidade/UF" className="h-10" />
            </div>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              placeholder="Informações adicionais sobre o cliente..." 
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Cadastrar Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
