import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockContracts, mockClients, mockServices } from '@/data/mockData';
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
  Filter,
  Download,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Copy,
  Edit,
  Trash2,
  FileSignature,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Mock contract templates
const mockTemplates = [
  { id: '1', name: 'Contrato de Honorários Advocatícios', category: 'Geral', description: 'Modelo padrão para prestação de serviços advocatícios', usageCount: 45 },
  { id: '2', name: 'Procuração Ad Judicia', category: 'Processual', description: 'Procuração para representação em processos judiciais', usageCount: 32 },
  { id: '3', name: 'Acordo Extrajudicial', category: 'Trabalhista', description: 'Modelo para acordos trabalhistas extrajudiciais', usageCount: 18 },
  { id: '4', name: 'Termo de Confidencialidade', category: 'Geral', description: 'NDA para proteção de informações sensíveis', usageCount: 12 },
  { id: '5', name: 'Contrato de Consultoria', category: 'Empresarial', description: 'Modelo para serviços de consultoria jurídica', usageCount: 8 },
];

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('contracts');
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service?.name || 'Serviço não encontrado';
  };

  const statusConfig = {
    draft: { label: 'Rascunho', variant: 'secondary' as const, icon: FileText, color: 'bg-muted text-muted-foreground' },
    pending_signature: { label: 'Aguardando Assinatura', variant: 'outline' as const, icon: Clock, color: 'bg-warning/20 text-warning' },
    active: { label: 'Ativo', variant: 'default' as const, icon: CheckCircle2, color: 'bg-success/20 text-success' },
    completed: { label: 'Concluído', variant: 'secondary' as const, icon: CheckCircle2, color: 'bg-primary/20 text-primary' },
    cancelled: { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle, color: 'bg-destructive/20 text-destructive' },
  };

  const totalValue = mockContracts.reduce((sum, c) => sum + c.value, 0);
  const activeContracts = mockContracts.filter(c => c.status === 'active').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout title="Contratos" subtitle="Gestão de contratos e modelos">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="metric-card">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total de Contratos</span>
            <p className="text-3xl font-bold mt-2">{mockContracts.length}</p>
          </div>
          <div className="metric-card metric-card-success">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Ativos</span>
            <p className="text-3xl font-bold mt-2 text-success">{activeContracts}</p>
          </div>
          <div className="metric-card metric-card-warning">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Rascunhos</span>
            <p className="text-3xl font-bold mt-2 text-warning">
              {mockContracts.filter(c => c.status === 'draft').length}
            </p>
          </div>
          <div className="metric-card metric-card-primary">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Valor Total</span>
            <p className="text-3xl font-bold mt-2 text-primary">{formatCurrency(totalValue)}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-secondary/50 rounded-xl p-1">
              <TabsTrigger value="contracts" className="rounded-lg data-[state=active]:bg-card gap-2">
                <FileText className="w-4 h-4" />
                Contratos
              </TabsTrigger>
              <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-card gap-2">
                <FileSignature className="w-4 h-4" />
                Modelos
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar..." className="pl-9 rounded-xl" />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              {activeTab === 'contracts' ? (
                <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  Novo Contrato
                </Button>
              ) : (
                <Dialog open={newTemplateOpen} onOpenChange={setNewTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                      <Plus className="w-4 h-4" />
                      Novo Modelo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Modelo</DialogTitle>
                      <DialogDescription>
                        Crie um novo modelo de contrato para usar em seus documentos.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nome do Modelo</Label>
                        <Input placeholder="Ex: Contrato de Honorários" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Input placeholder="Ex: Trabalhista, Geral, Empresarial" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea placeholder="Descreva o propósito deste modelo..." className="rounded-xl min-h-[100px]" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewTemplateOpen(false)} className="rounded-xl">
                        Cancelar
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 rounded-xl">
                        Criar Modelo
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-4">
            <div className="dashboard-card p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Cliente</TableHead>
                    <TableHead className="text-xs">Serviço</TableHead>
                    <TableHead className="text-xs">Valor</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Criado em</TableHead>
                    <TableHead className="text-xs">Assinado em</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockContracts.map((contract) => {
                    const status = statusConfig[contract.status];
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={contract.id} className="cursor-pointer hover:bg-secondary/30">
                        <TableCell className="font-medium text-sm">
                          {getClientName(contract.clientId)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{getServiceName(contract.serviceId)}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-sm">{formatCurrency(contract.value)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1 text-xs", status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
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
                              <DropdownMenuContent align="end" className="bg-popover border-border">
                                <DropdownMenuItem className="text-sm">Visualizar</DropdownMenuItem>
                                <DropdownMenuItem className="text-sm">Editar</DropdownMenuItem>
                                <DropdownMenuItem className="text-sm">Enviar para assinatura</DropdownMenuItem>
                                <DropdownMenuItem className="text-sm">Gerar PDF</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive text-sm">Cancelar</DropdownMenuItem>
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
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((template) => (
                <div key={template.id} className="dashboard-card hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <FileSignature className="w-5 h-5 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="gap-2 text-sm">
                          <Eye className="w-3.5 h-3.5" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm">
                          <Edit className="w-3.5 h-3.5" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm">
                          <Copy className="w-3.5 h-3.5" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{template.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Usado {template.usageCount}x
                    </span>
                  </div>
                </div>
              ))}

              {/* Add Template Card */}
              <div 
                className="dashboard-card border-dashed hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]"
                onClick={() => setNewTemplateOpen(true)}
              >
                <div className="p-3 rounded-xl bg-secondary/50 mb-3">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Adicionar Modelo</p>
                <p className="text-xs text-muted-foreground">Crie um novo modelo de contrato</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
