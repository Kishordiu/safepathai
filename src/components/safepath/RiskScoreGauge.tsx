import { cn } from '@/lib/utils';

interface RiskScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RiskScoreGauge({ score, label = 'Risk Score', size = 'md', className }: RiskScoreGaugeProps) {
  const dimensions = { sm: 80, md: 120, lg: 160 };
  const dim = dimensions[size];
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s <= 30) return 'hsl(var(--safe))';
    if (s <= 55) return 'hsl(var(--monitoring))';
    if (s <= 75) return 'hsl(var(--suspicious))';
    return 'hsl(var(--high-risk))';
  };

  const getLabel = (s: number) => {
    if (s <= 30) return 'Low';
    if (s <= 55) return 'Moderate';
    if (s <= 75) return 'Elevated';
    return 'High';
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
          <circle
            cx={dim / 2} cy={dim / 2} r={radius} fill="none"
            stroke={getColor(score)} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl')}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground">{getLabel(score)}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
