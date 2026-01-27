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
      'Trabalhista': 'bg-blue-100 text-blue-800',
      'Previdenciário': 'bg-purple-100 text-purple-800',
      'Família': 'bg-pink-100 text-pink-800',
      'Consumidor': 'bg-emerald-100 text-emerald-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout title="Serviços" subtitle="Catálogo de produtos e serviços">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Total de Serviços</p>
            <p className="text-3xl font-bold mt-1">{mockServices.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Categorias</p>
            <p className="text-3xl font-bold mt-1">{categories.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Preço Médio</p>
            <p className="text-3xl font-bold mt-1 text-primary">
              R$ {Math.round(mockServices.reduce((sum, s) => sum + s.basePrice, 0) / mockServices.length).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Mais Caro</p>
            <p className="text-3xl font-bold mt-1">
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
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge className={cn('font-normal', getCategoryColor(service.category))}>
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
