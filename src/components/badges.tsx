'use client';

interface ImportanceBadgeProps {
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const importanceConfig = {
  LOW: {
    label: "Ma'lumot",
    color: '#6B7280',
    bg: '#6B728010',
  },
  MEDIUM: {
    label: 'Bilish kerak',
    color: '#3B82F6',
    bg: '#3B82F610',
  },
  HIGH: {
    label: 'Juda muhim',
    color: '#F59E0B',
    bg: '#F59E0B10',
  },
  CRITICAL: {
    label: 'Game-changer',
    color: '#EF4444',
    bg: '#EF444410',
  },
};

export function ImportanceBadge({ importance }: ImportanceBadgeProps) {
  const config = importanceConfig[importance];

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
      {config.label}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

const difficultyConfig = {
  BEGINNER: {
    label: 'Boshlovchi',
    color: '#10B981',
  },
  INTERMEDIATE: {
    label: "O'rta",
    color: '#3B82F6',
  },
  ADVANCED: {
    label: 'Murakkab',
    color: '#F59E0B',
  },
  EXPERT: {
    label: 'Ekspert',
    color: '#8B5CF6',
  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <span
      className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70"
      style={{ color: config.color }}
    >
      {config.label}
    </span>
  );
}
