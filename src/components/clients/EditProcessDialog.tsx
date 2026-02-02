import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Hash, User, Calendar } from 'lucide-react';
import { mockTeamMembers } from '@/data/mockData';
import { Process } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface EditProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: Process | null;
}

const processTypes = [
  'Reclamação Trabalhista',
  'Revisão de Aposentadoria',
  'Divórcio Consensual',
  'Divórcio Litigioso',
  'Ação de Alimentos',
  'Defesa do Consumidor',
  'Outro',
];

const processStatuses = [
  { value: 'intake', label: 'Entrada' },
  { value: 'documentation', label: 'Documentação' },
  { value: 'analysis', label: 'Análise' },
  { value: 'filing', label: 'Protocolando' },
  { value: 'ongoing', label: 'Em Andamento' },
  { value: 'awaiting', label: 'Aguardando' },
  { value: 'completed', label: 'Concluído' },
];

export function EditProcessDialog({ open, onOpenChange, process }: EditProcessDialogProps) {
  const [processNumber, setProcessNumber] = useState('');
  const [processType, setProcessType] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (process) {
      setProcessNumber(process.processNumber || '');
      setProcessType(process.type);
      setStatus(process.status);
      setAssignedTo(process.assignedTo);
      setDeadline(process.deadline ? format(process.deadline, 'yyyy-MM-dd') : '');
      setDescription(process.description);
    }
  }, [process]);

  const handleSave = () => {
    toast.success('Processo atualizado com sucesso!');
    onOpenChange(false);
  };

  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Editar Processo</DialogTitle>
          <DialogDescription>
            Altere as informações do processo
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="processNumber" className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              Número do Processo
            </Label>
            <Input 
              id="processNumber" 
              value={processNumber}
              onChange={(e) => setProcessNumber(e.target.value)}
              placeholder="0000000-00.0000.0.00.0000" 
              className="h-10 font-mono" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              Tipo do Processo
            </Label>
            <Select value={processType} onValueChange={setProcessType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {processTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {processStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedTo" className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Responsável
            </Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {mockTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline" className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              Prazo
            </Label>
            <Input 
              id="deadline" 
              type="date" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-10" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o processo..." 
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
