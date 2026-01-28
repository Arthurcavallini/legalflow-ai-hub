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
  ArrowDownRight,
  Filter,
  Calendar,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
  { name: 'PIX', value: 45 },
  { name: 'Boleto', value: 30 },
  { name: 'Cartão', value: 15 },
  { name: 'Transf.', value: 10 },
];

export default function Financial() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
    paid: { label: 'Pago', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 },
    overdue: { label: 'Em atraso', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
    cancelled: { label: 'Cancelado', color: 'bg-muted text-muted-foreground border-border', icon: AlertTriangle },
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

  const filteredPayments = mockPayments.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <MainLayout title="Financeiro" subtitle="Gestão financeira do escritório">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Receita do Mês</span>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(mockDashboardMetrics.monthlyRevenue)}</p>
            <div className="flex items-center gap-1 mt-2 text-success text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+15% vs anterior</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Recebido</span>
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalReceived)}</p>
            <p className="text-xs text-muted-foreground mt-2">{mockPayments.filter(p => p.status === 'paid').length} pagamentos</p>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">A Receber</span>
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-muted-foreground mt-2">{mockPayments.filter(p => p.status === 'pending').length} parcelas</p>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Em Atraso</span>
              <div className={cn("p-2 rounded-lg", totalOverdue > 0 ? "bg-destructive/10" : "bg-muted")}>
                <AlertTriangle className={cn("w-4 h-4", totalOverdue > 0 ? "text-destructive" : "text-muted-foreground")} />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", totalOverdue > 0 ? "text-destructive" : "")}>
              {formatCurrency(totalOverdue)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{mockPayments.filter(p => p.status === 'overdue').length} parcelas</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary rounded-lg p-1">
            <TabsTrigger value="transactions" className="rounded-md data-[state=active]:bg-card">
              Transações
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md data-[state=active]:bg-card">
              Análises
            </TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-md data-[state=active]:bg-card">
              Faturas
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6 space-y-4">
            {/* Filter Bar + Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar cliente..." className="pl-9 h-9" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="paid">Pagos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="overdue">Em atraso</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[140px] h-9">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo período</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="quarter">Trimestre</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button size="sm" className="gap-2 h-9 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Nova Cobrança
                </Button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="dashboard-card p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="text-xs font-medium">Cliente</TableHead>
                    <TableHead className="text-xs font-medium">Valor</TableHead>
                    <TableHead className="text-xs font-medium">Status</TableHead>
                    <TableHead className="text-xs font-medium">Vencimento</TableHead>
                    <TableHead className="text-xs font-medium">Pagamento</TableHead>
                    <TableHead className="text-xs font-medium">Método</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const status = statusConfig[payment.status];
                    const StatusIcon = status.icon;
                    return (
                      <TableRow key={payment.id} className="hover:bg-secondary/30">
                        <TableCell className="font-medium">{getClientName(payment.clientId)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1.5 text-xs border", status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(payment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.paidAt ? format(payment.paidAt, "dd/MM/yyyy", { locale: ptBR }) : '—'}
                        </TableCell>
                        <TableCell>
                          {payment.method ? (
                            <span className="text-sm capitalize">{payment.method}</span>
                          ) : '—'}
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
                              <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Mostrando {filteredPayments.length} de {mockPayments.length} registros</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Anterior</Button>
                <Button variant="outline" size="sm">Próximo</Button>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6 space-y-6">
            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Cash Flow Chart */}
              <div className="lg:col-span-2 dashboard-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold">Fluxo de Caixa</h3>
                    <p className="text-sm text-muted-foreground">Entradas vs Saídas - Últimos 6 meses</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-primary" />
                      <span className="text-muted-foreground">Entradas</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-destructive/70" />
                      <span className="text-muted-foreground">Saídas</span>
                    </span>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px',
                          color: 'hsl(var(--popover-foreground))'
                        }}
                        formatter={(value: number, name: string) => [formatCurrency(value), name === 'entrada' ? 'Entradas' : 'Saídas']}
                      />
                      <Area type="monotone" dataKey="entrada" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorEntrada)" />
                      <Area type="monotone" dataKey="saida" stroke="hsl(var(--destructive))" strokeWidth={2} fillOpacity={1} fill="url(#colorSaida)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods Bar Chart */}
              <div className="dashboard-card">
                <h3 className="font-semibold mb-1">Métodos de Pagamento</h3>
                <p className="text-sm text-muted-foreground mb-6">Distribuição por método</p>
                <div className="space-y-4">
                  {paymentMethodData.map((item, index) => {
                    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-chart-2'];
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{item.name}</span>
                          <span className="font-semibold">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all", colors[index])}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="dashboard-card">
                <h3 className="font-semibold mb-4">Receitas por Mês</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Receita']}
                      />
                      <Bar dataKey="entrada" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="font-semibold mb-4">Despesas por Mês</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Despesa']}
                      />
                      <Bar dataKey="saida" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-6">
            <div className="dashboard-card text-center py-16">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Faturas</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Gerencie suas faturas e notas fiscais
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Criar Fatura
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
