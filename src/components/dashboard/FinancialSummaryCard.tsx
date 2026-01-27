import { mockPayments, mockDashboardMetrics } from '@/data/mockData';
import { Wallet, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FinancialSummaryCard() {
  const totalReceived = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalPending = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalOverdue = mockPayments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Resumo Financeiro</h3>
        </div>
        <span className="text-xs text-muted-foreground">Este mês</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-foreground">Recebido</span>
          </div>
          <span className="text-lg font-bold text-emerald-700">
            {formatCurrency(totalReceived)}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-foreground">A Receber</span>
          </div>
          <span className="text-lg font-bold text-amber-700">
            {formatCurrency(totalPending)}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-foreground">Em Atraso</span>
          </div>
          <span className="text-lg font-bold text-red-700">
            {formatCurrency(totalOverdue)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Meta do mês</span>
          <span className="text-sm font-medium">{formatCurrency(50000)}</span>
        </div>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min((mockDashboardMetrics.monthlyRevenue / 50000) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {Math.round((mockDashboardMetrics.monthlyRevenue / 50000) * 100)}% da meta alcançada
        </p>
      </div>
    </div>
  );
}
