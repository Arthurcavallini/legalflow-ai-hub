import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  FileSignature,
  Eye,
  Copy,
  Edit,
  Trash2,
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

// Mock contract templates
const mockTemplates = [
  { id: '1', name: 'Contrato de Honorários Advocatícios', category: 'Geral', description: 'Modelo padrão para prestação de serviços advocatícios', usageCount: 45 },
  { id: '2', name: 'Procuração Ad Judicia', category: 'Processual', description: 'Procuração para representação em processos judiciais', usageCount: 32 },
  { id: '3', name: 'Acordo Extrajudicial', category: 'Trabalhista', description: 'Modelo para acordos trabalhistas extrajudiciais', usageCount: 18 },
  { id: '4', name: 'Termo de Confidencialidade', category: 'Geral', description: 'NDA para proteção de informações sensíveis', usageCount: 12 },
  { id: '5', name: 'Contrato de Consultoria', category: 'Empresarial', description: 'Modelo para serviços de consultoria jurídica', usageCount: 8 },
];

export default function Contracts() {
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);

  return (
    <MainLayout title="Modelos" subtitle="Gestão de modelos de contratos e documentos">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar modelos..." className="pl-8 h-9" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Dialog open={newTemplateOpen} onOpenChange={setNewTemplateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 h-9 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Novo Modelo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Modelo</DialogTitle>
                  <DialogDescription>
                    Crie um novo modelo de contrato para usar em seus documentos.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Modelo</Label>
                    <Input placeholder="Ex: Contrato de Honorários" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input placeholder="Ex: Trabalhista, Geral, Empresarial" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea placeholder="Descreva o propósito deste modelo..." className="min-h-[100px]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewTemplateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Criar Modelo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTemplates.map((template) => (
            <div key={template.id} className="dashboard-card cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <FileSignature className="w-5 h-5 text-primary" />
                </div>
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
                    <DropdownMenuItem className="gap-2">
                      <Copy className="w-3.5 h-3.5" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
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
            className="dashboard-card border-dashed cursor-pointer flex flex-col items-center justify-center text-center min-h-[180px]"
            onClick={() => setNewTemplateOpen(true)}
          >
            <div className="p-2.5 rounded-lg bg-secondary mb-3">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Adicionar Modelo</p>
            <p className="text-xs text-muted-foreground">Crie um novo modelo de contrato</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
