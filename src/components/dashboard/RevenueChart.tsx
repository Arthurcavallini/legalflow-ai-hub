import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jul', receita: 32000, meta: 35000 },
  { month: 'Ago', receita: 38000, meta: 35000 },
  { month: 'Set', receita: 29000, meta: 35000 },
  { month: 'Out', receita: 42000, meta: 40000 },
  { month: 'Nov', receita: 48000, meta: 40000 },
  { month: 'Dez', receita: 52000, meta: 45000 },
  { month: 'Jan', receita: 45500, meta: 45000 },
];

export function RevenueChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Receita Mensal</h3>
          <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary/30" />
            <span className="text-muted-foreground">Meta</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
            />
            <Area
              type="monotone"
              dataKey="meta"
              stroke="hsl(222, 47%, 20%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#colorReceita)"
              dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
