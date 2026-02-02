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
import { FileSignature, Package, DollarSign } from 'lucide-react';
import { mockServices } from '@/data/mockData';

interface NewContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
}

export function NewContractDialog({ open, onOpenChange, clientName }: NewContractDialogProps) {
  const [selectedService, setSelectedService] = useState('');
  const [value, setValue] = useState('');

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = mockServices.find(s => s.id === serviceId);
    if (service) {
      setValue(service.basePrice.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Novo Contrato</DialogTitle>
          <DialogDescription>
            Criar contrato para {clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="service" className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              Serviço
            </Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {mockServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{service.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.basePrice)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="value" className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              Valor do Contrato
            </Label>
            <Input 
              id="value" 
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0,00" 
              className="h-10" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="template" className="flex items-center gap-2">
              <FileSignature className="w-3.5 h-3.5 text-muted-foreground" />
              Modelo de Contrato
            </Label>
            <Select>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Contrato Padrão</SelectItem>
                <SelectItem value="trabalhista">Contrato Trabalhista</SelectItem>
                <SelectItem value="familia">Contrato Família</SelectItem>
                <SelectItem value="consumidor">Contrato Consumidor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Criar Contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
