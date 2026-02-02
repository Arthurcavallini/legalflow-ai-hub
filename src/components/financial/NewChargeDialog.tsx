import { useState, useMemo } from 'react';
import { mockClients, mockServices } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building,
  DollarSign,
  User,
  Package,
  Hash,
} from 'lucide-react';

interface NewChargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { id: 'pix', name: 'PIX', icon: Smartphone, description: 'Pagamento instantâneo' },
  { id: 'boleto', name: 'Boleto', icon: Banknote, description: 'Vencimento em 3 dias úteis' },
  { id: 'cartao', name: 'Cartão', icon: CreditCard, description: 'Crédito ou débito' },
  { id: 'transferencia', name: 'Transferência', icon: Building, description: 'TED ou DOC' },
];

export function NewChargeDialog({ open, onOpenChange }: NewChargeDialogProps) {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('pix');
  const [quantity, setQuantity] = useState<number>(1);
  const [customValue, setCustomValue] = useState<string>('');

  const activeClients = mockClients.filter(c => c.status === 'active');

  const selectedServiceData = useMemo(() => {
    return mockServices.find(s => s.id === selectedService);
  }, [selectedService]);

  const totalValue = useMemo(() => {
    if (customValue) {
      return parseFloat(customValue) || 0;
    }
    if (selectedServiceData) {
      return selectedServiceData.basePrice * quantity;
    }
    return 0;
  }, [selectedServiceData, quantity, customValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = () => {
    // Here you would submit the charge
    console.log({
      clientId: selectedClient,
      serviceId: selectedService,
      method: selectedMethod,
      quantity,
      value: totalValue,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedService('');
    setSelectedMethod('pix');
    setQuantity(1);
    setCustomValue('');
  };

  const isValid = selectedClient && selectedService && selectedMethod && totalValue > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>
          <DialogDescription>
            Crie uma nova cobrança selecionando o cliente, serviço e forma de pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-muted-foreground" />
              Cliente
            </Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {activeClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <span>{client.name}</span>
                      <span className="text-xs text-muted-foreground">{client.phone}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Package className="w-4 h-4 text-muted-foreground" />
              Serviço
            </Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {mockServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{service.name}</span>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {formatCurrency(service.basePrice)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity & Custom Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Quantidade
              </Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Valor Personalizado
              </Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Opcional"
                className="h-10"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Forma de Pagamento</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/10" : "bg-secondary"
                    )}>
                      <Icon className={cn(
                        "w-4 h-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-foreground" : "text-foreground/80"
                      )}>
                        {method.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total Value Display */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                {selectedServiceData && quantity > 1 && !customValue && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {quantity}x {formatCurrency(selectedServiceData.basePrice)}
                  </p>
                )}
              </div>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-primary hover:bg-primary/90"
          >
            Criar Cobrança
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
