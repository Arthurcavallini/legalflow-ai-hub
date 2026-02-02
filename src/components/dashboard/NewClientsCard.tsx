import { mockClients, mockLeads } from '@/data/mockData';
import { UserPlus, TrendingUp, Phone, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function NewClientsCard() {
  // Get clients created this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const newClients = mockClients.filter(c => new Date(c.createdAt) >= thisMonth);
  const closedLeads = mockLeads.filter(l => l.status === 'finished');
  
  // Calculate growth (mock data)
  const lastMonthClients = 3;
  const growth = Math.round(((newClients.length - lastMonthClients) / lastMonthClients) * 100);

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100">
            <UserPlus className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-foreground">Novos Clientes</h3>
        </div>
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{growth}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-2xl font-bold text-foreground">{newClients.length}</p>
          <p className="text-xs text-muted-foreground">Este mês</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-2xl font-bold text-foreground">{closedLeads.length}</p>
          <p className="text-xs text-muted-foreground">Leads convertidos</p>
        </div>
      </div>
      
      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
        Últimos clientes
      </p>
      
      <div className="space-y-2">
        {newClients.slice(0, 3).map((client) => (
          <div
            key={client.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{client.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(client.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {client.email && (
                <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium hover:underline">
        Ver todos os clientes
      </button>
    </div>
  );
}
