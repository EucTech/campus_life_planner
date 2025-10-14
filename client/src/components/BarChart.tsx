interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
}

export function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Last 7 Days Activity</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-card relative flex-1 flex items-end">
              <div
                className="w-full bg-primary rounded-t-sm transition-all"
                style={{ height: `${(item.value / max) * 100}%` }}
                data-testid={`bar-${item.label}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
