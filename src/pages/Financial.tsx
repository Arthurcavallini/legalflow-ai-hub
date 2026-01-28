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
  ArrowUpRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    <MainLayout title="Financeiro" subtitle="Gestão">
      <div className="space-y-6">
        {/* Big Number Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="metric-card metric-card-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Receita do Mês</span>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(mockDashboardMetrics.monthlyRevenue)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+15%</span>
            </div>
          </div>

          <div className="metric-card metric-card-success">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Recebido</span>
              <div className="p-1.5 rounded-lg bg-success/20">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(totalReceived)}
            </p>
          </div>

          <div className="metric-card metric-card-warning">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">A Receber</span>
              <div className="p-1.5 rounded-lg bg-warning/20">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(totalPending)}
            </p>
          </div>

          <div className={cn(
            "metric-card",
            totalOverdue > 0 && "metric-card-danger"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Em Atraso</span>
              <div className={cn(
                "p-1.5 rounded-lg",
                totalOverdue > 0 ? "bg-destructive/20" : "bg-muted"
              )}>
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  totalOverdue > 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              totalOverdue > 0 ? "text-destructive" : "text-foreground"
            )}>
              {formatCurrency(totalOverdue)}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pagamentos..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 text-sm">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-sm">
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
                <TableHead className="text-xs">Cliente</TableHead>
                <TableHead className="text-xs">Valor</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Vencimento</TableHead>
                <TableHead className="text-xs">Pagamento</TableHead>
                <TableHead className="text-xs">Método</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => {
                const status = statusConfig[payment.status];
                const StatusIcon = status.icon;

                return (
                  <TableRow key={payment.id} className="data-table-row">
                    <TableCell className="font-medium text-sm">
                      {getClientName(payment.clientId)}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1 text-xs", status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(payment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.paidAt
                        ? format(payment.paidAt, "dd/MM/yyyy", { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {payment.method ? (
                        <Badge variant="outline" className="capitalize text-xs">
                          {payment.method}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="text-sm">Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="text-sm">Enviar lembrete</DropdownMenuItem>
                          <DropdownMenuItem className="text-sm">Marcar como pago</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive text-sm">
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
