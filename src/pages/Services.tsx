import { MainLayout } from '@/components/layout/MainLayout';
import { mockServices } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Package,
  Edit,
  Trash2,
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
      'Trabalhista': 'bg-primary/20 text-primary',
      'Previdenciário': 'bg-purple-500/20 text-purple-400',
      'Família': 'bg-pink-500/20 text-pink-400',
      'Consumidor': 'bg-success/20 text-success',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <MainLayout title="Serviços" subtitle="Catálogo">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="metric-card">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total de Serviços</span>
            <p className="text-3xl font-bold mt-2">{mockServices.length}</p>
          </div>
          <div className="metric-card">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Categorias</span>
            <p className="text-3xl font-bold mt-2">{categories.length}</p>
          </div>
          <div className="metric-card metric-card-primary">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Preço Médio</span>
            <p className="text-3xl font-bold mt-2 text-primary">
              R$ {Math.round(mockServices.reduce((sum, s) => sum + s.basePrice, 0) / mockServices.length).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="metric-card">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Mais Caro</span>
            <p className="text-3xl font-bold mt-2">
              R$ {Math.max(...mockServices.map(s => s.basePrice)).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar serviços..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
            <Plus className="w-4 h-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <div key={service.id} className="dashboard-card">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem className="gap-2 text-sm">
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{service.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge className={cn('font-normal text-xs', getCategoryColor(service.category))}>
                  {service.category}
                </Badge>
                <p className="text-lg font-bold text-primary">
                  R$ {service.basePrice.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
