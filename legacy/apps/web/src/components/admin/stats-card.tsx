import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02]",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold font-serif">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-foreground/5">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">so'ngi haftadan</span>
        </div>
      )}
    </div>
  );
}

interface DataCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function DataCard({ title, children, action, className }: DataCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-foreground/5 bg-foreground/[0.02] overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <h3 className="font-serif font-bold">{title}</h3>
        {action}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'running' | 'completed' | 'failed' | 'cancelled';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    running: { label: 'Ishlayapti', className: 'bg-blue-500/10 text-blue-500' },
    completed: { label: 'Tugadi', className: 'bg-green-500/10 text-green-500' },
    failed: { label: 'Xato', className: 'bg-red-500/10 text-red-500' },
    cancelled: { label: 'Bekor', className: 'bg-gray-500/10 text-gray-500' },
  };

  const { label, className } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
      className
    )}>
      {status === 'running' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      )}
      {label}
    </span>
  );
}
