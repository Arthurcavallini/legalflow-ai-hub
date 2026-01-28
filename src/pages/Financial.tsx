import { MainLayout } from '@/components/layout/MainLayout';
import { mockPayments, mockClients, mockDashboardMetrics } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DollarSign,
  FileText,
  CreditCard,
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const cashFlowData = [
  { month: 'Jan', entrada: 45000, saida: 28000 },
  { month: 'Fev', entrada: 52000, saida: 31000 },
  { month: 'Mar', entrada: 48000, saida: 29000 },
  { month: 'Abr', entrada: 61000, saida: 35000 },
  { month: 'Mai', entrada: 55000, saida: 32000 },
  { month: 'Jun', entrada: 67000, saida: 38000 },
];

const paymentMethodData = [
  { name: 'PIX', value: 45, color: 'hsl(217, 91%, 60%)' },
  { name: 'Boleto', value: 30, color: 'hsl(142, 71%, 45%)' },
  { name: 'Cartão', value: 15, color: 'hsl(45, 93%, 47%)' },
  { name: 'Transferência', value: 10, color: 'hsl(280, 67%, 60%)' },
];

export default function Financial() {
  const [activeTab, setActiveTab] = useState('overview');

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
    <MainLayout title="Financeiro" subtitle="Gestão financeira do escritório">
      <div className="space-y-6">
        {/* Metrics Row */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="metric-card metric-card-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Receita do Mês</span>
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">{formatCurrency(mockDashboardMetrics.monthlyRevenue)}</p>
            <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+15% vs mês anterior</span>
            </div>
          </div>

          <div className="metric-card metric-card-success">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Recebido</span>
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalReceived)}</p>
            <p className="text-xs text-muted-foreground mt-2">{mockPayments.filter(p => p.status === 'paid').length} pagamentos</p>
          </div>

          <div className="metric-card metric-card-warning">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">A Receber</span>
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-muted-foreground mt-2">{mockPayments.filter(p => p.status === 'pending').length} parcelas</p>
          </div>

          <div className={cn("metric-card", totalOverdue > 0 && "metric-card-danger")}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Em Atraso</span>
              <div className={cn("p-2 rounded-lg", totalOverdue > 0 ? "bg-destructive/20" : "bg-muted")}>
                <AlertTriangle className={cn("w-4 h-4", totalOverdue > 0 ? "text-destructive" : "text-muted-foreground")} />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", totalOverdue > 0 ? "text-destructive" : "text-foreground")}>
              {formatCurrency(totalOverdue)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{mockPayments.filter(p => p.status === 'overdue').length} parcelas</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-secondary/50 rounded-xl p-1">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-card">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-card">
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-card">
                Faturas
              </TabsTrigger>
            </TabsList>

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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Cash Flow Chart */}
              <div className="lg:col-span-2 dashboard-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold">Fluxo de Caixa</h3>
                    <p className="text-xs text-muted-foreground">Entradas vs Saídas</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-primary" />
                      <span className="text-muted-foreground">Entradas</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-destructive/70" />
                      <span className="text-muted-foreground">Saídas</span>
                    </span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--popover-foreground))' }}
                        formatter={(value: number, name: string) => [formatCurrency(value), name === 'entrada' ? 'Entradas' : 'Saídas']}
                      />
                      <Area type="monotone" dataKey="entrada" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fillOpacity={1} fill="url(#colorEntrada)" />
                      <Area type="monotone" dataKey="saida" stroke="hsl(0, 84%, 60%)" strokeWidth={2} fillOpacity={1} fill="url(#colorSaida)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="dashboard-card">
                <h3 className="text-base font-semibold mb-4">Métodos de Pagamento</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={4}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {paymentMethodData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                      <span className="text-xs font-semibold ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Pagamentos Recentes</h3>
                <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setActiveTab('payments')}>
                  Ver todos
                </Button>
              </div>
              <div className="space-y-3">
                {mockPayments.slice(0, 5).map((payment) => {
                  const status = statusConfig[payment.status];
                  const StatusIcon = status.icon;
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", status.color.replace('text-', 'bg-').split(' ')[0])}>
                          <StatusIcon className={cn("w-4 h-4", status.color.split(' ')[1])} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{getClientName(payment.clientId)}</p>
                          <p className="text-xs text-muted-foreground">Venc: {format(payment.dueDate, "dd/MM/yyyy", { locale: ptBR })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(payment.amount)}</p>
                        <Badge className={cn("text-xs mt-1", status.color)}>{status.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-4">
            <div className="dashboard-card p-0 overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar pagamentos..." className="pl-9 rounded-xl" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
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
                      <TableRow key={payment.id} className="hover:bg-secondary/30">
                        <TableCell className="font-medium text-sm">{getClientName(payment.clientId)}</TableCell>
                        <TableCell className="font-semibold text-sm">{formatCurrency(payment.amount)}</TableCell>
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
                          {payment.paidAt ? format(payment.paidAt, "dd/MM/yyyy", { locale: ptBR }) : '-'}
                        </TableCell>
                        <TableCell>
                          {payment.method ? (
                            <Badge variant="outline" className="capitalize text-xs">{payment.method}</Badge>
                          ) : '-'}
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
                              <DropdownMenuItem className="text-destructive text-sm">Cancelar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-4">
            <div className="dashboard-card text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Faturas</h3>
              <p className="text-sm text-muted-foreground mb-4">Gerencie suas faturas e notas fiscais</p>
              <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl">
                <Plus className="w-4 h-4" />
                Gerar Nova Fatura
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
