'use client';

/**
 * Animated Neon Orbs Component
 * 
 * Provides constantly moving, glowing background elements
 * inspired by "Liquid Glass" and modern SaaS design trends.
 */
export function NeonOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Primary Cyan Orb */}
      <div 
        className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full 
                   bg-cyan-500/15 dark:bg-cyan-500/10 blur-[100px] animate-float-slow" 
      />
      
      {/* Secondary Indigo Orb */}
      <div 
        className="absolute bottom-[10%] -right-[5%] w-[60%] h-[60%] rounded-full 
                   bg-indigo-500/15 dark:bg-indigo-500/10 blur-[120px] animate-float-medium" 
      />
      
      {/* Accent Violet Orb */}
      <div 
        className="absolute top-[40%] right-[10%] w-[30%] h-[40%] rounded-full 
                   bg-violet-500/10 dark:bg-violet-500/5 blur-[80px] animate-float-fast" 
      />

      {/* Blue Gloomy Orb */}
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[45%] h-[45%] rounded-full 
                   bg-blue-600/10 dark:bg-blue-600/5 blur-[100px] animate-float-slow"
        style={{ animationDirection: 'reverse', animationDuration: '25s' }}
      />
    </div>
  );
}
