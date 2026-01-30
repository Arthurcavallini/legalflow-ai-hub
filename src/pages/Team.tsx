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
  Target,
  MessageSquare,
  FileText,
  Users,
  ArrowUpRight,
  Activity,
  Briefcase,
  Timer,
  Award,
  MapPin,
  Calendar,
  User,
  Building,
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
  
  const tasksToday = Math.floor(Math.random() * 5) + 1;
  const avgExecutionTime = Math.floor(Math.random() * 3) + 1; // days
  const activeProcesses = Math.floor(Math.random() * 8) + 2;
  const chatsAttended = Math.floor(Math.random() * 15) + 5;
  const documentsCreated = Math.floor(Math.random() * 10) + 2;
  const weeklyGrowth = Math.floor(Math.random() * 40) - 10;
  const monthlyTarget = 50;
  const targetProgress = Math.min(100, Math.round((member.tasksCompleted / monthlyTarget) * 100));
  const streak = Math.floor(Math.random() * 15) + 1;
  const lastActivity = new Date(Date.now() - Math.random() * 3600000);

  // Personal info mock
  const personalInfo = {
    fullName: member.name,
    email: `${member.name.toLowerCase().replace(' ', '.')}@adv360.com`,
    phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    department: member.role.includes('Advogado') ? 'Jurídico' : member.role.includes('Paralegal') ? 'Apoio Jurídico' : 'Administrativo',
    location: 'São Paulo, SP',
    startDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    manager: 'Dr. Carlos Silva',
    oab: member.role.includes('Advogado') ? `SP-${Math.floor(Math.random() * 90000) + 100000}` : null,
  };

  return {
    ...member,
    overdueTasks: overdueTasks.length,
    pendingTasks: pendingTasks.length,
    inProgressTasks: inProgressTasks.length,
    tasksToday,
    avgExecutionTime,
    activeProcesses,
    chatsAttended,
    documentsCreated,
    weeklyGrowth,
    monthlyTarget,
    targetProgress,
    streak,
    lastActivity,
    personalInfo,
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
    active: { label: 'Ativo', color: 'bg-success/10 text-success' },
    vacation: { label: 'Férias', color: 'bg-warning/10 text-warning' },
    inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
  };

  const totalMembers = mockTeamMembers.length;
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length;
  const totalOverdue = extendedMembers.reduce((sum, m) => sum + m.overdueTasks, 0);
  const avgProductivity = Math.round(extendedMembers.reduce((sum, m) => sum + m.targetProgress, 0) / extendedMembers.length);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Agora';
    if (diff < 60) return `${diff}min`;
    return `${Math.floor(diff / 60)}h`;
  };

  return (
    <MainLayout title="Equipe" subtitle="Gestão de colaboradores">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                <p className="text-3xl font-bold mt-1">{totalMembers}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Ativos</span>
                <p className="text-3xl font-bold mt-1 text-success">{activeMembers}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <Activity className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Atrasadas</span>
                <p className={cn("text-3xl font-bold mt-1", totalOverdue > 0 ? "text-destructive" : "text-foreground")}>
                  {totalOverdue}
                </p>
              </div>
              <div className={cn("p-3 rounded-xl", totalOverdue > 0 ? "bg-destructive/10" : "bg-muted")}>
                <AlertTriangle className={cn("w-5 h-5", totalOverdue > 0 ? "text-destructive" : "text-muted-foreground")} />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Produtividade</span>
                <p className="text-3xl font-bold mt-1 text-primary">{avgProductivity}%</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
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

        {/* Team Grid - Clean Cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => {
            const status = statusConfig[member.status];
            const totalTasks = member.tasksCompleted + member.pendingTasks + member.inProgressTasks;
            const productivity = totalTasks > 0 ? Math.round((member.tasksCompleted / totalTasks) * 100) : 0;

            return (
              <div 
                key={member.id} 
                className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                {/* Card Header */}
                <div className="p-5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card',
                        member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground truncate">{member.name}</p>
                        <Badge className={cn("text-[10px] font-medium", status.color)}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Último acesso: {formatTime(member.lastActivity)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="px-5 pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-secondary/50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-foreground">{member.tasksToday}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Hoje</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-primary">{member.activeProcesses}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Processos</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-foreground">{member.avgExecutionTime}d</p>
                      <p className="text-[10px] text-muted-foreground uppercase leading-tight">Tempo/Tarefa</p>
                    </div>
                  </div>
                </div>

                {/* Task Summary */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between text-sm">
                    {member.overdueTasks > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-destructive font-medium">{member.overdueTasks} atraso</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-muted-foreground">{member.pendingTasks} pendentes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{member.tasksCompleted} feitas</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Meta mensal</span>
                    <span className="font-semibold text-primary">{member.targetProgress}%</span>
                  </div>
                  <Progress value={member.targetProgress} className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-secondary/30 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {member.weeklyGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      member.weeklyGrowth >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {member.weeklyGrowth >= 0 ? '+' : ''}{member.weeklyGrowth}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs semana</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">{member.streak}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
          {selectedMember && (
            <>
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {selectedMember.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-1">{selectedMember.name}</DialogTitle>
                    <p className="text-muted-foreground">{selectedMember.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn("text-xs", statusConfig[selectedMember.status].color)}>
                        {statusConfig[selectedMember.status].label}
                      </Badge>
                      {selectedMember.personalInfo.oab && (
                        <Badge variant="outline" className="text-xs">
                          OAB {selectedMember.personalInfo.oab}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

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
                        variant={selectedMember.status === 'active' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedMember.status === 'active' && "bg-success hover:bg-success/90"
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Ativo
                      </Button>
                      <Button 
                        variant={selectedMember.status === 'vacation' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedMember.status === 'vacation' && "bg-warning hover:bg-warning/90 text-warning-foreground"
                        )}
                      >
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Férias
                      </Button>
                      <Button 
                        variant={selectedMember.status !== 'active' && selectedMember.status !== 'vacation' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedMember.status !== 'active' && selectedMember.status !== 'vacation' && "bg-muted-foreground hover:bg-muted-foreground/90"
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
                          <p className="text-sm font-medium truncate">{selectedMember.personalInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Telefone</p>
                          <p className="text-sm font-medium">{selectedMember.personalInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Departamento</p>
                          <p className="text-sm font-medium">{selectedMember.personalInfo.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Localização</p>
                          <p className="text-sm font-medium">{selectedMember.personalInfo.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Data de Início</p>
                          <p className="text-sm font-medium">
                            {selectedMember.personalInfo.startDate.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
                        <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Gestor</p>
                          <p className="text-sm font-medium">{selectedMember.personalInfo.manager}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4">Indicadores</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-2xl font-bold text-primary">{selectedMember.tasksToday}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Hoje</p>
                      </div>
                      <div className="text-center p-4 bg-success/5 rounded-xl border border-success/10">
                        <p className="text-2xl font-bold text-success">{selectedMember.tasksCompleted}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Concluídas</p>
                      </div>
                      <div className="text-center p-4 bg-warning/5 rounded-xl border border-warning/10">
                        <p className="text-2xl font-bold text-warning">{selectedMember.pendingTasks}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Pendentes</p>
                      </div>
                      <div className={cn(
                        "text-center p-4 rounded-xl border",
                        selectedMember.overdueTasks > 0 ? "bg-destructive/5 border-destructive/10" : "bg-muted/50 border-border"
                      )}>
                        <p className={cn(
                          "text-2xl font-bold",
                          selectedMember.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"
                        )}>{selectedMember.overdueTasks}</p>
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
                      <p className="text-xl font-bold">{selectedMember.activeProcesses}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Chats</span>
                      </div>
                      <p className="text-xl font-bold">{selectedMember.chatsAttended}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Documentos</span>
                      </div>
                      <p className="text-xl font-bold">{selectedMember.documentsCreated}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Tarefas Recentes</h4>
                    <Button variant="outline" size="sm">Ver todas</Button>
                  </div>
                  
                  {selectedMember.allTasks.length > 0 ? (
                    selectedMember.allTasks.slice(0, 5).map((task, idx) => (
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
                      <p className="text-3xl font-bold text-primary">{selectedMember.avgExecutionTime} dias</p>
                      <p className="text-sm text-muted-foreground mt-1">Por tarefa</p>
                    </div>
                    
                    <div className="p-5 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-warning" />
                        <span className="font-medium">Sequência</span>
                      </div>
                      <p className="text-3xl font-bold text-warning">{selectedMember.streak} dias</p>
                      <p className="text-sm text-muted-foreground mt-1">Produtivo</p>
                    </div>
                  </div>

                  {/* Weekly Growth */}
                  <div className="p-5 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {selectedMember.weeklyGrowth >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-success" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-destructive" />
                        )}
                        <span className="font-medium">Variação Semanal</span>
                      </div>
                      <span className={cn(
                        "text-xl font-bold",
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

                  {/* Monthly Target */}
                  <div className="p-5 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="font-medium">Meta Mensal</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{selectedMember.targetProgress}%</span>
                    </div>
                    <Progress value={selectedMember.targetProgress} className="h-2.5 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.tasksCompleted} de {selectedMember.monthlyTarget} tarefas concluídas
                    </p>
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
