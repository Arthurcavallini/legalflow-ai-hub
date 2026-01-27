import { cn } from '@/lib/utils';
import { mockLeads } from '@/data/mockData';

const stages = [
  { id: 'new', label: 'Novos', color: 'bg-blue-500' },
  { id: 'qualified', label: 'Qualificados', color: 'bg-emerald-500' },
  { id: 'proposal', label: 'Proposta', color: 'bg-amber-500' },
  { id: 'negotiation', label: 'Negociação', color: 'bg-purple-500' },
  { id: 'closed', label: 'Fechados', color: 'bg-emerald-600' },
];

export function LeadsPipeline() {
  const getLeadsByStage = (stageId: string) =>
    mockLeads.filter((lead) => lead.status === stageId);

  const totalLeads = mockLeads.length;

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Pipeline de Leads</h3>
          <p className="text-sm text-muted-foreground">
            {totalLeads} leads ativos
          </p>
        </div>
        <button className="text-sm text-accent font-medium hover:underline">
          Ver CRM
        </button>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => {
          const leads = getLeadsByStage(stage.id);
          const percentage = (leads.length / totalLeads) * 100 || 0;

          return (
            <div key={stage.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={cn('w-2.5 h-2.5 rounded-full', stage.color)}
                  />
                  <span className="font-medium">{stage.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {leads.length} leads
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', stage.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick preview of recent leads */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground mb-3">
          LEADS RECENTES
        </p>
        <div className="space-y-2">
          {mockLeads.slice(0, 3).map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {lead.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.caseType}</p>
                </div>
              </div>
              <span
                className={cn(
                  'status-badge',
                  lead.urgency === 'high' && 'status-new',
                  lead.urgency === 'medium' && 'status-proposal',
                  lead.urgency === 'low' && 'status-qualified'
                )}
              >
                {lead.urgency === 'high' ? 'Urgente' : lead.urgency === 'medium' ? 'Médio' : 'Baixo'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
