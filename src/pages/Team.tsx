import { MainLayout } from '@/components/layout/MainLayout';
import { mockTeamMembers, mockTasks } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Team() {
  const getTasksForMember = (memberId: string) => {
    return mockTasks.filter(t => t.assignedTo === memberId);
  };

  const statusConfig = {
    active: { label: 'Ativo', variant: 'default' as const, color: 'bg-emerald-500' },
    vacation: { label: 'Férias', variant: 'secondary' as const, color: 'bg-amber-500' },
    inactive: { label: 'Inativo', variant: 'outline' as const, color: 'bg-gray-400' },
  };

  return (
    <MainLayout title="Equipe" subtitle="Gestão de colaboradores e produtividade">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Total de Membros</p>
            <p className="text-3xl font-bold mt-1">{mockTeamMembers.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">
              {mockTeamMembers.filter(m => m.status === 'active').length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
            <p className="text-3xl font-bold mt-1 text-amber-600">
              {mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Tarefas Atrasadas</p>
            <p className="text-3xl font-bold mt-1 text-red-600">
              {mockTasks.filter(t => t.status === 'overdue').length}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar membros..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </Button>
        </div>

        {/* Team Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px]">Membro</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tarefas</TableHead>
                <TableHead>Produtividade</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeamMembers.map((member) => {
                const tasks = getTasksForMember(member.id);
                const pending = tasks.filter(t => t.status === 'pending').length;
                const inProgress = tasks.filter(t => t.status === 'in_progress').length;
                const overdue = tasks.filter(t => t.status === 'overdue').length;
                const completed = member.tasksCompleted;
                const total = completed + pending + inProgress + overdue;
                const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
                const status = statusConfig[member.status];

                return (
                  <TableRow key={member.id} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className={cn(
                            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
                            status.color
                          )} />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <Phone className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{member.role}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {overdue > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{overdue}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{pending + inProgress}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{completed}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={productivity} className="w-20 h-2" />
                        <span className="text-sm font-medium">{productivity}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem>Ver tarefas</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Alterar status</DropdownMenuItem>
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
