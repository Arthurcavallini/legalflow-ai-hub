import { useState } from 'react';
import { mockClients, mockProcesses, mockPayments } from '@/data/mockData';
import { Client } from '@/types';
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
import { ClientDetailSheet } from './ClientDetailSheet';

export function ClientsTable() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setSheetOpen(true);
  };

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
    <>
      <div className="data-table animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="data-table-header hover:bg-transparent">
              <TableHead className="w-[300px]">Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Processos</TableHead>
              <TableHead>Financeiro</TableHead>
              <TableHead>Status</TableHead>
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
                <TableRow 
                  key={client.id} 
                  className="data-table-row"
                  onClick={() => handleClientClick(client)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold rounded-xl">
                          {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.cpf || 'CPF não informado'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-primary" />
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
                      <div className="p-2 rounded-lg bg-secondary">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground">{processes.length}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {processes.length === 1 ? 'processo' : 'processos'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge 
                        variant={paymentStatus.variant}
                        className={cn(
                          "rounded-lg",
                          paymentStatus.variant === 'default' && "bg-success/20 text-success"
                        )}
                      >
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
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "rounded-lg",
                        client.status === 'active' 
                          ? "bg-success/20 text-success border-success/30" 
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientClick(client);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-secondary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl">
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Ver histórico</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Editar dados</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Ver contratos</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Ver financeiro</DropdownMenuItem>
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

      <ClientDetailSheet 
        client={selectedClient}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}