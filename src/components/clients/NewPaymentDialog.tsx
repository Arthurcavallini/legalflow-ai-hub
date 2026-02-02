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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Calendar, CreditCard, FileText } from 'lucide-react';
import { mockContracts, mockServices } from '@/data/mockData';

interface NewPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientId: string;
}

export function NewPaymentDialog({ open, onOpenChange, clientName, clientId }: NewPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contractId, setContractId] = useState('');

  const clientContracts = mockContracts.filter(c => c.clientId === clientId);

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service?.name || 'Serviço';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Novo Lançamento</DialogTitle>
          <DialogDescription>
            Adicionar lançamento financeiro para {clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {clientContracts.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="contract" className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                Vincular a Contrato
              </Label>
              <Select value={contractId} onValueChange={setContractId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o contrato" />
                </SelectTrigger>
                <SelectContent>
                  {clientContracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {getServiceName(contract.serviceId)} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              Valor
            </Label>
            <Input 
              id="amount" 
              type="number"
              placeholder="0,00" 
              className="h-10" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              Data de Vencimento
            </Label>
            <Input id="dueDate" type="date" className="h-10" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod" className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              Forma de Pagamento
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione a forma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input 
              id="description" 
              placeholder="Ex: Parcela 1/3" 
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Adicionar Lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
