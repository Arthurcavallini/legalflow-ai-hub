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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListTodo, User, Calendar, Flag } from 'lucide-react';
import { mockTeamMembers, mockProcesses } from '@/data/mockData';
import { Process } from '@/types';

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientId: string;
  clientProcesses?: Process[];
}

export function NewTaskDialog({ open, onOpenChange, clientName, clientId, clientProcesses }: NewTaskDialogProps) {
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [processId, setProcessId] = useState('');

  const processes = clientProcesses || mockProcesses.filter(p => p.clientId === clientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Nova Tarefa</DialogTitle>
          <DialogDescription>
            Criar tarefa para {clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <ListTodo className="w-3.5 h-3.5 text-muted-foreground" />
              Título da Tarefa
            </Label>
            <Input id="title" placeholder="Ex: Preparar petição inicial" className="h-10" />
          </div>

          {processes.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="process" className="flex items-center gap-2">
                Vincular a Processo (opcional)
              </Label>
              <Select value={processId} onValueChange={setProcessId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o processo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum processo</SelectItem>
                  {processes.map((process) => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.type} - {process.processNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="assignedTo" className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Responsável
              </Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione" />
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
              <Label htmlFor="priority" className="flex items-center gap-2">
                <Flag className="w-3.5 h-3.5 text-muted-foreground" />
                Prioridade
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              Data de Vencimento
            </Label>
            <Input id="dueDate" type="date" className="h-10" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Detalhes sobre a tarefa..." 
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Criar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
