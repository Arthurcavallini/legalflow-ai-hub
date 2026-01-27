import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockPayments, mockClients, mockDashboardMetrics } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Filter,
  Download,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Financial() {
  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const statusConfig = {
    pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
    paid: { label: 'Pago', variant: 'default' as const, icon: CheckCircle2 },
    overdue: { label: 'Em atraso', variant: 'destructive' as const, icon: AlertTriangle },
    cancelled: { label: 'Cancelado', variant: 'outline' as const, icon: AlertTriangle },
  };

  const totalReceived = mockPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = mockPayments
    .filter((p) => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout title="Financeiro" subtitle="Gestão de receitas e cobranças">
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Receita do Mês"
            value={`R$ ${(mockDashboardMetrics.monthlyRevenue / 1000).toFixed(1)}k`}
            change={15}
            changeLabel="vs mês anterior"
            icon={TrendingUp}
            variant="accent"
          />
          <MetricCard
            title="Recebido"
            value={`R$ ${totalReceived.toLocaleString('pt-BR')}`}
            icon={CheckCircle2}
          />
          <MetricCard
            title="A Receber"
            value={`R$ ${totalPending.toLocaleString('pt-BR')}`}
            icon={Wallet}
          />
          <MetricCard
            title="Em Atraso"
            value={`R$ ${totalOverdue.toLocaleString('pt-BR')}`}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar pagamentos..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4" />
              Nova Cobrança
            </Button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => {
                const status = statusConfig[payment.status];
                const StatusIcon = status.icon;

                return (
                  <TableRow key={payment.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      {getClientName(payment.clientId)}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        R$ {payment.amount.toLocaleString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {payment.method ? (
                        <span className="text-sm capitalize">{payment.method}</span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Enviar lembrete</DropdownMenuItem>
                          <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
