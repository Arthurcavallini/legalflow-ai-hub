import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockTeamMembers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  AlertTriangle,
  Users,
  Activity,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeamMemberCard, getExtendedMemberData } from '@/components/team/TeamMemberCard';
import { TeamMemberSheet } from '@/components/team/TeamMemberSheet';
import type { ExtendedMemberData } from '@/components/team/TeamMemberCard';

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<ExtendedMemberData | null>(null);
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

        {/* Team Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>
      </div>

      {/* Member Detail Sheet */}
      <TeamMemberSheet
        member={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />
    </MainLayout>
  );
}
