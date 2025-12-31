'use client';

import { useTranslations } from 'next-intl';

interface ImportanceBadgeProps {
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const importanceColors = {
  LOW: { color: '#6B7280', bg: '#6B728010' },
  MEDIUM: { color: '#3B82F6', bg: '#3B82F610' },
  HIGH: { color: '#F59E0B', bg: '#F59E0B10' },
  CRITICAL: { color: '#EF4444', bg: '#EF444410' },
};

export function ImportanceBadge({ importance }: ImportanceBadgeProps) {
  const t = useTranslations('importance');
  const config = importanceColors[importance];
  const label = t(importance.toLowerCase() as 'low' | 'medium' | 'high' | 'critical');

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 hover:brightness-110"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: `${config.color}20`,
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full" 
        style={{ backgroundColor: config.color }}
      />
      {label}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

const difficultyColors = {
  BEGINNER: '#10B981',
  INTERMEDIATE: '#3B82F6',
  ADVANCED: '#F59E0B',
  EXPERT: '#8B5CF6',
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const t = useTranslations('difficulty');
  const color = difficultyColors[difficulty];
  const label = t(difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' | 'expert');

  return (
    <span
      className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70"
      style={{ color }}
    >
      {label}
    </span>
  );
}
