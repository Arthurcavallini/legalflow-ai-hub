import { MainLayout } from '@/components/layout/MainLayout';
import { mockServices } from '@/data/mockData';
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
  MoreHorizontal,
  Package,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Services() {
  const categories = [...new Set(mockServices.map(s => s.category))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Trabalhista': 'bg-primary/10 text-primary border-primary/20',
      'Previdenciário': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'Família': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      'Consumidor': 'bg-success/10 text-success border-success/20',
    };
    return colors[category] || 'bg-muted text-muted-foreground border-border';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout title="Serviços" subtitle="Catálogo de serviços">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Total de Serviços</span>
            <p className="text-2xl font-bold mt-1">{mockServices.length}</p>
          </div>
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Categorias</span>
            <p className="text-2xl font-bold mt-1">{categories.length}</p>
          </div>
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Preço Médio</span>
            <p className="text-2xl font-bold mt-1 text-primary">
              {formatCurrency(Math.round(mockServices.reduce((sum, s) => sum + s.basePrice, 0) / mockServices.length))}
            </p>
          </div>
          <div className="dashboard-card">
            <span className="text-sm text-muted-foreground">Mais Caro</span>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(Math.max(...mockServices.map(s => s.basePrice)))}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar serviços..." className="pl-8 h-9" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-1.5 h-9 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Services Table */}
        <div className="dashboard-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                <TableHead className="text-xs font-medium">Serviço</TableHead>
                <TableHead className="text-xs font-medium">Descrição</TableHead>
                <TableHead className="text-xs font-medium">Categoria</TableHead>
                <TableHead className="text-xs font-medium text-right">Preço Base</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{service.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {service.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('font-normal text-xs border', getCategoryColor(service.category))}>
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-primary">{formatCurrency(service.basePrice)}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-3.5 h-3.5" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-3.5 h-3.5" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
