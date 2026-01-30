import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Target,
  MessageSquare,
  FileText,
  Briefcase,
  Timer,
  Award,
  MapPin,
  Calendar,
  User,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExtendedMemberData } from './TeamMemberCard';

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-success/10 text-success' },
  vacation: { label: 'Férias', color: 'bg-warning/10 text-warning' },
  inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
};

interface TeamMemberSheetProps {
  member: ExtendedMemberData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamMemberSheet({ member, open, onOpenChange }: TeamMemberSheetProps) {
  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-lg mb-1">{member.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("text-xs", statusConfig[member.status].color)}>
                  {statusConfig[member.status].label}
                </Badge>
                {member.personalInfo.oab && (
                  <Badge variant="outline" className="text-xs">
                    OAB {member.personalInfo.oab}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="p-6 pt-4">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6 mt-0">
            {/* Status Control */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Status do Membro</h4>
              <div className="flex gap-2">
                <Button 
                  variant={member.status === 'active' ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "flex-1",
                    member.status === 'active' && "bg-success hover:bg-success/90"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Ativo
                </Button>
                <Button 
                  variant={member.status === 'vacation' ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "flex-1",
                    member.status === 'vacation' && "bg-warning hover:bg-warning/90 text-warning-foreground"
                  )}
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Férias
                </Button>
                <Button 
                  variant={member.status !== 'active' && member.status !== 'vacation' ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "flex-1",
                    member.status !== 'active' && member.status !== 'vacation' && "bg-muted-foreground hover:bg-muted-foreground/90"
                  )}
                >
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Inativo
                </Button>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Dados Pessoais</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase">Email</p>
                    <p className="text-sm font-medium truncate">{member.personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Telefone</p>
                    <p className="text-sm font-medium">{member.personalInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Departamento</p>
                    <p className="text-sm font-medium">{member.personalInfo.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Localização</p>
                    <p className="text-sm font-medium">{member.personalInfo.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Data de Início</p>
                    <p className="text-sm font-medium">
                      {member.personalInfo.startDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Gestor</p>
                    <p className="text-sm font-medium">{member.personalInfo.manager}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Indicadores</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-2xl font-bold text-primary">{member.tasksToday}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">Hoje</p>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-xl border border-success/10">
                  <p className="text-2xl font-bold text-success">{member.tasksCompleted}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">Concluídas</p>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-xl border border-warning/10">
                  <p className="text-2xl font-bold text-warning">{member.pendingTasks}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">Pendentes</p>
                </div>
                <div className={cn(
                  "text-center p-4 rounded-xl border",
                  member.overdueTasks > 0 ? "bg-destructive/5 border-destructive/10" : "bg-muted/50 border-border"
                )}>
                  <p className={cn(
                    "text-2xl font-bold",
                    member.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"
                  )}>{member.overdueTasks}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">Atrasadas</p>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Processos</span>
                </div>
                <p className="text-xl font-bold">{member.activeProcesses}</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Chats</span>
                </div>
                <p className="text-xl font-bold">{member.chatsAttended}</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Documentos</span>
                </div>
                <p className="text-xl font-bold">{member.documentsCreated}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Tarefas Recentes</h4>
              <Button variant="outline" size="sm">Ver todas</Button>
            </div>
            
            {member.allTasks.length > 0 ? (
              member.allTasks.slice(0, 5).map((task, idx) => (
                <div key={idx} className={cn(
                  "p-4 rounded-xl border flex items-center gap-4",
                  task.status === 'overdue' ? "bg-destructive/5 border-destructive/20" :
                  task.status === 'completed' ? "bg-success/5 border-success/20" :
                  "bg-card border-border"
                )}>
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  ) : task.status === 'overdue' ? (
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-warning flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Prazo: {task.dueDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant={
                    task.status === 'completed' ? 'default' :
                    task.status === 'overdue' ? 'destructive' : 'secondary'
                  } className="flex-shrink-0">
                    {task.status === 'completed' ? 'Concluída' :
                     task.status === 'overdue' ? 'Atrasada' :
                     task.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma tarefa atribuída
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-0">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="font-medium">Tempo Médio</span>
                </div>
                <p className="text-3xl font-bold text-primary">{member.avgExecutionTime} dias</p>
                <p className="text-sm text-muted-foreground mt-1">Por tarefa</p>
              </div>
              
              <div className="p-5 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-warning" />
                  <span className="font-medium">Sequência</span>
                </div>
                <p className="text-3xl font-bold text-warning">{member.streak} dias</p>
                <p className="text-sm text-muted-foreground mt-1">Produtivo</p>
              </div>
            </div>

            {/* Weekly Growth */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {member.weeklyGrowth >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-medium">Variação Semanal</span>
                </div>
                <span className={cn(
                  "text-xl font-bold",
                  member.weeklyGrowth >= 0 ? "text-success" : "text-destructive"
                )}>
                  {member.weeklyGrowth >= 0 ? '+' : ''}{member.weeklyGrowth}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {member.weeklyGrowth >= 0 
                  ? "Produtividade crescente em relação à semana anterior"
                  : "Produtividade menor que a semana anterior"}
              </p>
            </div>

            {/* Monthly Target */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-medium">Meta Mensal</span>
                </div>
                <span className="text-xl font-bold text-primary">{member.targetProgress}%</span>
              </div>
              <Progress value={member.targetProgress} className="h-2.5 mb-3" />
              <p className="text-sm text-muted-foreground">
                {member.tasksCompleted} de {member.monthlyTarget} tarefas concluídas
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
