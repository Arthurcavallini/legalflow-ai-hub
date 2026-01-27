import { mockClients, mockProcesses, mockPayments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, Mail, MoreHorizontal, FileText, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ClientsTable() {
  const getClientProcesses = (clientId: string) =>
    mockProcesses.filter((p) => p.clientId === clientId);

  const getClientPayments = (clientId: string) =>
    mockPayments.filter((p) => p.clientId === clientId);

  const getPaymentStatus = (payments: typeof mockPayments) => {
    const hasOverdue = payments.some((p) => p.status === 'overdue');
    const hasPending = payments.some((p) => p.status === 'pending');
    if (hasOverdue) return { label: 'Em atraso', variant: 'destructive' as const };
    if (hasPending) return { label: 'Pendente', variant: 'secondary' as const };
    return { label: 'Em dia', variant: 'default' as const };
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Processos</TableHead>
            <TableHead>Financeiro</TableHead>
            <TableHead>Última atividade</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockClients.map((client) => {
            const processes = getClientProcesses(client.id);
            const payments = getClientPayments(client.id);
            const paymentStatus = getPaymentStatus(payments);
            const totalPending = payments
              .filter((p) => p.status !== 'paid')
              .reduce((sum, p) => sum + p.amount, 0);

            return (
              <TableRow key={client.id} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.cpf || 'CPF não informado'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">{client.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{processes.length}</span>
                    <span className="text-sm text-muted-foreground">
                      {processes.length === 1 ? 'processo' : 'processos'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant={paymentStatus.variant}>
                      {paymentStatus.label}
                    </Badge>
                    {totalPending > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>
                          R$ {totalPending.toLocaleString('pt-BR')} pendente
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(client.updatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver histórico</DropdownMenuItem>
                        <DropdownMenuItem>Editar dados</DropdownMenuItem>
                        <DropdownMenuItem>Ver contratos</DropdownMenuItem>
                        <DropdownMenuItem>Ver financeiro</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
