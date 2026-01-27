import { MainLayout } from '@/components/layout/MainLayout';
import { mockPayments, mockClients, mockDashboardMetrics } from '@/data/mockData';
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
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Financial() {
  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-warning/20 text-warning', icon: Clock },
    paid: { label: 'Pago', color: 'bg-success/20 text-success', icon: CheckCircle2 },
    overdue: { label: 'Em atraso', color: 'bg-destructive/20 text-destructive', icon: AlertTriangle },
    cancelled: { label: 'Cancelado', color: 'bg-muted text-muted-foreground', icon: AlertTriangle },
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout title="Financeiro" subtitle="Gestão de receitas e cobranças">
      <div className="space-y-6">
        {/* Big Number Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="metric-card metric-card-highlight glow-primary p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-success text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+15%</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {formatCurrency(mockDashboardMetrics.monthlyRevenue)}
            </p>
            <p className="text-sm text-muted-foreground">Receita do mês</p>
          </div>

          <div className="metric-card metric-card-success p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-success/20">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <p className="text-4xl font-bold text-success mb-1">
              {formatCurrency(totalReceived)}
            </p>
            <p className="text-sm text-muted-foreground">Recebido</p>
          </div>

          <div className="metric-card metric-card-warning p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-4xl font-bold text-warning mb-1">
              {formatCurrency(totalPending)}
            </p>
            <p className="text-sm text-muted-foreground">A receber</p>
          </div>

          <div className={cn(
            "metric-card p-6",
            totalOverdue > 0 && "metric-card-danger glow-danger"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl",
                totalOverdue > 0 ? "bg-destructive/20" : "bg-secondary"
              )}>
                <AlertTriangle className={cn(
                  "w-6 h-6",
                  totalOverdue > 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
            <p className={cn(
              "text-4xl font-bold mb-1",
              totalOverdue > 0 ? "text-destructive" : "text-foreground"
            )}>
              {formatCurrency(totalOverdue)}
            </p>
            <p className="text-sm text-muted-foreground">Em atraso</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pagamentos..."
              className="pl-9 bg-secondary border-0 rounded-xl"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Nova Cobrança
            </Button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="data-table">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header hover:bg-transparent">
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
                  <TableRow key={payment.id} className="data-table-row">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <DollarSign className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {getClientName(payment.clientId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(payment.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1.5 rounded-lg", status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {payment.method ? (
                        <Badge variant="outline" className="capitalize rounded-lg">
                          {payment.method}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-secondary">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl">
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Enviar lembrete</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">Marcar como pago</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer">
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