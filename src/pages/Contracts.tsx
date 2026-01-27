import { MainLayout } from '@/components/layout/MainLayout';
import { mockContracts, mockClients, mockServices } from '@/data/mockData';
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
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Contracts() {
  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service?.name || 'Serviço não encontrado';
  };

  const statusConfig = {
    draft: { label: 'Rascunho', variant: 'secondary' as const, icon: FileText },
    pending_signature: { label: 'Aguardando Assinatura', variant: 'outline' as const, icon: Clock },
    active: { label: 'Ativo', variant: 'default' as const, icon: CheckCircle2 },
    completed: { label: 'Concluído', variant: 'secondary' as const, icon: CheckCircle2 },
    cancelled: { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle },
  };

  const totalValue = mockContracts.reduce((sum, c) => sum + c.value, 0);
  const activeContracts = mockContracts.filter(c => c.status === 'active').length;

  return (
    <MainLayout title="Contratos" subtitle="Gestão de contratos e documentos">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Total de Contratos</p>
            <p className="text-3xl font-bold mt-1">{mockContracts.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">{activeContracts}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Rascunhos</p>
            <p className="text-3xl font-bold mt-1 text-amber-600">
              {mockContracts.filter(c => c.status === 'draft').length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <p className="text-3xl font-bold mt-1 text-primary">
              R$ {(totalValue / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar contratos..." className="pl-9" />
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
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Novo Contrato
            </Button>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Assinado em</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContracts.map((contract) => {
                const status = statusConfig[contract.status];
                const StatusIcon = status.icon;

                return (
                  <TableRow key={contract.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      {getClientName(contract.clientId)}
                    </TableCell>
                    <TableCell>{getServiceName(contract.serviceId)}</TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        R$ {contract.value.toLocaleString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {contract.signedAt
                        ? new Date(contract.signedAt).toLocaleDateString('pt-BR')
                        : '-'}
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
                            <DropdownMenuItem>Visualizar</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Enviar para assinatura</DropdownMenuItem>
                            <DropdownMenuItem>Gerar PDF</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancelar
                            </DropdownMenuItem>
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
      </div>
    </MainLayout>
  );
}
