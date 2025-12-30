'use client';

import { Info, Flag, AlertTriangle, Flame, Sprout, BookOpen, GraduationCap, Trophy } from 'lucide-react';

interface ImportanceBadgeProps {
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const importanceConfig = {
  LOW: {
    label: "Ma'lumot",
    color: '#6B7280',
    bg: '#6B728010',
    Icon: Info,
  },
  MEDIUM: {
    label: 'Bilish kerak',
    color: '#3B82F6',
    bg: '#3B82F610',
    Icon: Flag,
  },
  HIGH: {
    label: 'Juda muhim',
    color: '#F59E0B',
    bg: '#F59E0B10',
    Icon: AlertTriangle,
  },
  CRITICAL: {
    label: 'Game-changer',
    color: '#EF4444',
    bg: '#EF444410',
    Icon: Flame,
  },
};

export function ImportanceBadge({ importance }: ImportanceBadgeProps) {
  const config = importanceConfig[importance];
  const Icon = config.Icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: `${config.color}30`,
      }}
    >
      <Icon className="w-3.5 h-3.5" />
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
    Icon: Sprout,
  },
  INTERMEDIATE: {
    label: "O'rta",
    color: '#3B82F6',
    Icon: BookOpen,
  },
  ADVANCED: {
    label: 'Murakkab',
    color: '#F59E0B',
    Icon: GraduationCap,
  },
  EXPERT: {
    label: 'Ekspert',
    color: '#8B5CF6',
    Icon: Trophy,
  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  const Icon = config.Icon;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium opacity-70"
      style={{ color: config.color }}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
