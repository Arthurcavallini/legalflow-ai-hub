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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, User, Phone, Mail, MapPin, CreditCard, Hash, Package, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockServices } from '@/data/mockData';
import { Lead } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ConvertLeadToClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export function ConvertLeadToClientDialog({ open, onOpenChange, lead }: ConvertLeadToClientDialogProps) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Pre-fill with lead data when dialog opens
  useState(() => {
    if (lead) {
      setName(lead.name);
      setPhone(lead.phone);
      setEmail(lead.email || '');
      setAiEnabled(lead.aiEnabled !== false);
    }
  });

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
              Lead → Cliente
            </Badge>
          </div>
          <DialogTitle className="text-lg font-semibold">Converter em Cliente</DialogTitle>
          <DialogDescription>
            Convertendo {lead.name} de lead para cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Lead Info Preview */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Dados do Lead</p>
                <p className="text-xs text-muted-foreground">
                  Origem: {lead.source === 'whatsapp' ? 'WhatsApp' : lead.source === 'website' ? 'Website' : lead.source === 'referral' ? 'Indicação' : 'Outro'} • {lead.caseType}
                </p>
              </div>
            </div>
          </div>

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
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Roberto Almeida" 
                className="h-10" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  Telefone
                </Label>
                <Input 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999" 
                  className="h-10" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com" 
                  className="h-10" 
                />
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

          {/* Process and Service */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium text-muted-foreground">Vinculação (opcional)</h4>
            
            <div className="grid gap-2">
              <Label htmlFor="processNumber" className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                Número do Processo
              </Label>
              <Input 
                id="processNumber" 
                placeholder="0000000-00.0000.0.00.0000" 
                className="h-10 font-mono" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="service" className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                Serviço/Produto Contratado
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({service.category})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-success hover:bg-success/90 gap-2">
            <User className="w-4 h-4" />
            Converter em Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
