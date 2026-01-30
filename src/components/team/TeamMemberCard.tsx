import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockTasks } from '@/data/mockData';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'vacation' | 'inactive';
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
};

export type ExtendedMemberData = TeamMember & {
  overdueTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  tasksToday: number;
  completedToday: number;
  waitingToStart: number;
  avgExecutionTime: number;
  activeProcesses: number;
  chatsAttended: number;
  documentsCreated: number;
  weeklyGrowth: number;
  monthlyTarget: number;
  targetProgress: number;
  streak: number;
  lastActivity: Date;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    department: string;
    location: string;
    startDate: Date;
    manager: string;
    oab: string | null;
  };
  allTasks: typeof mockTasks;
};

export const getExtendedMemberData = (member: TeamMember): ExtendedMemberData => {
  const baseTasks = mockTasks.filter(t => t.assignedTo === member.id);
  const overdueTasks = baseTasks.filter(t => t.status === 'overdue');
  const pendingTasks = baseTasks.filter(t => t.status === 'pending');
  const inProgressTasks = baseTasks.filter(t => t.status === 'in_progress');
  const completedTasks = baseTasks.filter(t => t.status === 'completed');
  
  const tasksToday = Math.floor(Math.random() * 6) + 2;
  const completedToday = Math.floor(Math.random() * (tasksToday - 1)) + 1;
  const waitingToStart = Math.max(0, tasksToday - completedToday - inProgressTasks.length);
  
  const avgExecutionTime = Math.floor(Math.random() * 3) + 1;
  const activeProcesses = Math.floor(Math.random() * 8) + 2;
  const chatsAttended = Math.floor(Math.random() * 15) + 5;
  const documentsCreated = Math.floor(Math.random() * 10) + 2;
  const weeklyGrowth = Math.floor(Math.random() * 40) - 10;
  const monthlyTarget = 50;
  const targetProgress = Math.min(100, Math.round((member.tasksCompleted / monthlyTarget) * 100));
  const streak = Math.floor(Math.random() * 15) + 1;
  
  const lastActivity = new Date(Date.now() - Math.random() * 3600000);

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
    completedTasks: completedTasks.length,
    tasksToday,
    completedToday,
    waitingToStart,
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

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-success/10 text-success' },
  vacation: { label: 'Férias', color: 'bg-warning/10 text-warning' },
  inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
};

interface TeamMemberCardProps {
  member: ExtendedMemberData;
  onClick?: () => void;
  compact?: boolean;
}

export function TeamMemberCard({ member, onClick, compact = false }: TeamMemberCardProps) {
  const status = statusConfig[member.status];
  const dailyProgress = member.tasksToday > 0 
    ? Math.round((member.completedToday / member.tasksToday) * 100) 
    : 0;

  if (compact) {
    return (
      <div 
        className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <span className={cn(
                'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card',
                member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate">{member.role}</p>
            </div>
          </div>
        </div>

        <div className="px-3 pb-2">
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="bg-primary/5 rounded-md p-1.5">
              <p className="text-sm font-bold text-primary">{member.tasksToday}</p>
              <p className="text-[9px] text-muted-foreground">Hoje</p>
            </div>
            <div className={cn(
              "rounded-md p-1.5",
              member.overdueTasks > 0 ? "bg-destructive/5" : "bg-secondary/50"
            )}>
              <p className={cn(
                "text-sm font-bold",
                member.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"
              )}>{member.overdueTasks}</p>
              <p className="text-[9px] text-muted-foreground">Atras.</p>
            </div>
            <div className={cn(
              "rounded-md p-1.5",
              member.pendingTasks > 0 ? "bg-warning/5" : "bg-secondary/50"
            )}>
              <p className={cn(
                "text-sm font-bold",
                member.pendingTasks > 0 ? "text-warning" : "text-muted-foreground"
              )}>{member.pendingTasks}</p>
              <p className="text-[9px] text-muted-foreground">Pend.</p>
            </div>
            <div className="bg-secondary/50 rounded-md p-1.5">
              <p className="text-sm font-bold text-muted-foreground">{member.waitingToStart}</p>
              <p className="text-[9px] text-muted-foreground">Aguard.</p>
            </div>
          </div>
        </div>

        <div className="px-3 pb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-muted-foreground">{member.completedToday}/{member.tasksToday}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/60 rounded-full transition-all duration-500"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <span className={cn(
              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
              member.status === 'active' ? 'bg-success' : member.status === 'vacation' ? 'bg-warning' : 'bg-muted-foreground'
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm text-foreground truncate">{member.name}</p>
              <Badge className={cn("text-[10px] font-medium shrink-0", status.color)}>
                {status.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-primary">{member.tasksToday}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Hoje</p>
          </div>
          
          <div className={cn(
            "rounded-lg p-2.5 text-center border",
            member.overdueTasks > 0 
              ? "bg-destructive/5 border-destructive/20" 
              : "bg-secondary/50 border-transparent"
          )}>
            <p className={cn(
              "text-lg font-bold",
              member.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              {member.overdueTasks}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">Atrasadas</p>
          </div>
          
          <div className={cn(
            "rounded-lg p-2.5 text-center border",
            member.pendingTasks > 0 
              ? "bg-warning/5 border-warning/20" 
              : "bg-secondary/50 border-transparent"
          )}>
            <p className={cn(
              "text-lg font-bold",
              member.pendingTasks > 0 ? "text-warning" : "text-muted-foreground"
            )}>
              {member.pendingTasks}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">Pendentes</p>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-muted-foreground">{member.waitingToStart}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Aguardando</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Progresso do dia</span>
          <span className="font-semibold">
            <span className="text-foreground">{member.completedToday}</span>
            <span className="text-muted-foreground">/{member.tasksToday} tarefas</span>
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${dailyProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">
            {dailyProgress === 100 ? '✓ Meta atingida' : `${dailyProgress}% concluído`}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {member.tasksToday - member.completedToday} restantes
          </span>
        </div>
      </div>
    </div>
  );
}
