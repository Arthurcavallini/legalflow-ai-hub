import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockTeamMembers, mockTasks } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Zap,
  MessageSquare,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  X,
  Briefcase,
  Timer,
  Award,
  Star,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type TeamMember = typeof mockTeamMembers[number];

// Extended mock data for richer visualization
const getExtendedMemberData = (member: TeamMember) => {
  const baseTasks = mockTasks.filter(t => t.assignedTo === member.id);
  const overdueTasks = baseTasks.filter(t => t.status === 'overdue');
  const pendingTasks = baseTasks.filter(t => t.status === 'pending');
  const inProgressTasks = baseTasks.filter(t => t.status === 'in_progress');
  
  // Simulated data for richer visualization
  const tasksToday = Math.floor(Math.random() * 5) + 1;
  const tasksCompletedToday = Math.floor(Math.random() * tasksToday);
  const avgResponseTime = Math.floor(Math.random() * 30) + 10; // minutes
  const activeProcesses = Math.floor(Math.random() * 8) + 2;
  const chatsAttended = Math.floor(Math.random() * 15) + 5;
  const documentsCreated = Math.floor(Math.random() * 10) + 2;
  const weeklyGrowth = Math.floor(Math.random() * 40) - 10; // -10% to +30%
  const monthlyTarget = 50;
  const monthlyCompleted = member.tasksCompleted;
  const targetProgress = Math.min(100, Math.round((monthlyCompleted / monthlyTarget) * 100));
  const workloadLevel = pendingTasks.length + inProgressTasks.length;
  const workloadStatus = workloadLevel > 8 ? 'high' : workloadLevel > 4 ? 'medium' : 'low';
  const lastActivity = new Date(Date.now() - Math.random() * 3600000);
  const streak = Math.floor(Math.random() * 15) + 1;

  return {
    ...member,
    overdueTasks: overdueTasks.length,
    pendingTasks: pendingTasks.length,
    inProgressTasks: inProgressTasks.length,
    tasksToday,
    tasksCompletedToday,
    avgResponseTime,
    activeProcesses,
    chatsAttended,
    documentsCreated,
    weeklyGrowth,
    monthlyTarget,
    targetProgress,
    workloadStatus,
    workloadLevel,
    lastActivity,
    streak,
    allTasks: baseTasks,
  };
};

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<ReturnType<typeof getExtendedMemberData> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const extendedMembers = mockTeamMembers.map(getExtendedMemberData);
  
  const filteredMembers = extendedMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig = {
    active: { label: 'Ativo', color: 'bg-success/15 text-success border-success/30' },
    vacation: { label: 'Férias', color: 'bg-warning/15 text-warning border-warning/30' },
    inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground border-border' },
  };

  const workloadConfig = {
    low: { label: 'Disponível', color: 'text-success', bg: 'bg-success/10' },
    medium: { label: 'Moderado', color: 'text-warning', bg: 'bg-warning/10' },
    high: { label: 'Sobrecarregado', color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  const totalMembers = mockTeamMembers.length;
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length;
  const totalOverdue = extendedMembers.reduce((sum, m) => sum + m.overdueTasks, 0);
  const avgProductivity = Math.round(extendedMembers.reduce((sum, m) => sum + m.targetProgress, 0) / extendedMembers.length);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Agora';
    if (diff < 60) return `${diff}min atrás`;
    return `${Math.floor(diff / 60)}h atrás`;
  };

  return (
    <MainLayout title="Equipe" subtitle="Gestão de colaboradores">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Membros</span>
                <p className="text-3xl font-bold mt-2">{totalMembers}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-success text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2 este mês</span>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ativos Agora</span>
                <p className="text-3xl font-bold mt-2 text-success">{activeMembers}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <Activity className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{totalMembers - activeMembers} ausentes</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Atrasadas</span>
                <p className={cn(
                  "text-3xl font-bold mt-2",
                  totalOverdue > 0 ? "text-destructive" : "text-foreground"
                )}>{totalOverdue}</p>
              </div>
              <div className={cn(
                "p-3 rounded-xl",
                totalOverdue > 0 ? "bg-destructive/10" : "bg-muted"
              )}>
                <AlertTriangle className={cn(
                  "w-5 h-5",
                  totalOverdue > 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Tarefas totais atrasadas</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Produtividade</span>
                <p className="text-3xl font-bold mt-2 text-primary">{avgProductivity}%</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Média da equipe</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar por nome ou cargo..." 
              className="pl-9 h-10 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="gap-2 h-10 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </Button>
        </div>

        {/* Team Grid - Enhanced Cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => {
            const status = statusConfig[member.status];
            const workload = workloadConfig[member.workloadStatus];
            const totalTasks = member.tasksCompleted + member.pendingTasks + member.inProgressTasks;
            const productivity = totalTasks > 0 ? Math.round((member.tasksCompleted / totalTasks) * 100) : 0;

            return (
              <div 
                key={member.id} 
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedMember(member)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card',
                        member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs border", status.color)}>
                    {status.label}
                  </Badge>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-secondary/40 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{member.tasksToday}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Hoje</p>
                  </div>
                  <div className="bg-secondary/40 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-primary">{member.activeProcesses}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Processos</p>
                  </div>
                  <div className={cn("rounded-xl p-3 text-center", workload.bg)}>
                    <p className={cn("text-lg font-bold", workload.color)}>{member.workloadLevel}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Carga</p>
                  </div>
                </div>

                {/* Task Status Row */}
                <div className="flex items-center justify-between py-3 border-y border-border/50 mb-4">
                  {member.overdueTasks > 0 && (
                    <div className="flex items-center gap-1.5 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-bold">{member.overdueTasks}</span>
                      <span className="text-xs text-muted-foreground">atraso</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-warning">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{member.pendingTasks + member.inProgressTasks}</span>
                    <span className="text-xs text-muted-foreground">pendentes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-bold">{member.tasksCompleted}</span>
                    <span className="text-xs text-muted-foreground">feitas</span>
                  </div>
                </div>

                {/* Meta Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Meta Mensal</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{member.targetProgress}%</span>
                  </div>
                  <Progress value={member.targetProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {member.tasksCompleted} de {member.monthlyTarget} tarefas
                  </p>
                </div>

                {/* Performance Trend */}
                <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    {member.weeklyGrowth >= 0 ? (
                      <div className="p-1.5 rounded-lg bg-success/20">
                        <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-destructive/20">
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Variação Semanal</p>
                      <p className={cn(
                        "text-sm font-bold",
                        member.weeklyGrowth >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {member.weeklyGrowth >= 0 ? '+' : ''}{member.weeklyGrowth}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Último acesso</p>
                    <p className="text-sm font-medium text-foreground">{formatTime(member.lastActivity)}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-warning" />
                    <span className="text-xs font-medium text-warning">{member.streak} dias</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold">
                      {selectedMember.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-xl">{selectedMember.name}</DialogTitle>
                    <p className="text-muted-foreground">{selectedMember.role}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className={cn("text-xs border", statusConfig[selectedMember.status].color)}>
                        {statusConfig[selectedMember.status].label}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs border", workloadConfig[selectedMember.workloadStatus].bg, workloadConfig[selectedMember.workloadStatus].color)}>
                        {workloadConfig[selectedMember.workloadStatus].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="activity">Atividade</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedMember.name.toLowerCase().replace(' ', '.')}@lexflow.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p className="text-sm font-medium">(11) 99999-9999</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="text-2xl font-bold text-primary">{selectedMember.tasksToday}</p>
                      <p className="text-xs text-muted-foreground mt-1">Tarefas Hoje</p>
                    </div>
                    <div className="text-center p-4 bg-success/5 rounded-xl border border-success/20">
                      <p className="text-2xl font-bold text-success">{selectedMember.tasksCompleted}</p>
                      <p className="text-xs text-muted-foreground mt-1">Concluídas</p>
                    </div>
                    <div className="text-center p-4 bg-warning/5 rounded-xl border border-warning/20">
                      <p className="text-2xl font-bold text-warning">{selectedMember.pendingTasks}</p>
                      <p className="text-xs text-muted-foreground mt-1">Pendentes</p>
                    </div>
                    <div className={cn(
                      "text-center p-4 rounded-xl border",
                      selectedMember.overdueTasks > 0 ? "bg-destructive/5 border-destructive/20" : "bg-muted border-border"
                    )}>
                      <p className={cn(
                        "text-2xl font-bold",
                        selectedMember.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"
                      )}>{selectedMember.overdueTasks}</p>
                      <p className="text-xs text-muted-foreground mt-1">Atrasadas</p>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Processos Ativos</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedMember.activeProcesses}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Chats Atendidos</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedMember.chatsAttended}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Docs Criados</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedMember.documentsCreated}</p>
                    </div>
                  </div>

                  {/* Meta Progress */}
                  <div className="p-5 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Meta Mensal</span>
                      </div>
                      <span className="text-lg font-bold text-primary">{selectedMember.targetProgress}%</span>
                    </div>
                    <Progress value={selectedMember.targetProgress} className="h-3 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.tasksCompleted} de {selectedMember.monthlyTarget} tarefas concluídas este mês
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Tarefas Recentes</h4>
                    <Button variant="outline" size="sm">Ver todas</Button>
                  </div>
                  
                  {selectedMember.allTasks.slice(0, 5).map((task, idx) => (
                    <div key={idx} className={cn(
                      "p-4 rounded-xl border flex items-center justify-between",
                      task.status === 'overdue' ? "bg-destructive/5 border-destructive/20" :
                      task.status === 'completed' ? "bg-success/5 border-success/20" :
                      "bg-card border-border"
                    )}>
                      <div className="flex items-center gap-3">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : task.status === 'overdue' ? (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Clock className="w-5 h-5 text-warning" />
                        )}
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Prazo: {task.dueDate.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'overdue' ? 'destructive' : 'secondary'
                      }>
                        {task.status === 'completed' ? 'Concluída' :
                         task.status === 'overdue' ? 'Atrasada' :
                         task.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="performance" className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Timer className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Tempo Médio de Resposta</span>
                      </div>
                      <p className="text-3xl font-bold text-primary">{selectedMember.avgResponseTime} min</p>
                      <p className="text-sm text-muted-foreground mt-1">Para atendimento de chats</p>
                    </div>
                    
                    <div className="p-5 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-warning" />
                        <span className="font-semibold">Sequência Produtiva</span>
                      </div>
                      <p className="text-3xl font-bold text-warning">{selectedMember.streak} dias</p>
                      <p className="text-sm text-muted-foreground mt-1">Concluindo tarefas diariamente</p>
                    </div>
                  </div>

                  <div className="p-5 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Variação Semanal</span>
                      </div>
                      <span className={cn(
                        "text-lg font-bold",
                        selectedMember.weeklyGrowth >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {selectedMember.weeklyGrowth >= 0 ? '+' : ''}{selectedMember.weeklyGrowth}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.weeklyGrowth >= 0 
                        ? "Produtividade crescente em relação à semana anterior"
                        : "Produtividade menor que a semana anterior"}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div key={star} className="flex flex-col items-center p-3 bg-secondary/30 rounded-xl">
                        <Star className={cn(
                          "w-6 h-6",
                          star <= 4 ? "text-warning fill-warning" : "text-muted"
                        )} />
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">Avaliação média: 4.0/5.0</p>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-6">
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Histórico de atividades em breve</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
