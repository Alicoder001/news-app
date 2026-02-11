'use client';

/**
 * Minimal AI-themed SVG background decoration
 * Neural network inspired dot grid with subtle connections
 */
export function TechPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Neon Mesh Grid Overlay */}
      <div className="absolute inset-0 neon-grid opacity-[0.2] dark:opacity-[0.4]" />
      
      {/* Floating Neon Scanning Lines */}
      <div className="neon-line top-0" style={{ animationDelay: '0s', opacity: 0.05 }} />
      <div className="neon-line top-[30%]" style={{ animationDelay: '-3s', opacity: 0.03 }} />
      <div className="neon-line top-[70%]" style={{ animationDelay: '-7s', opacity: 0.04 }} />

      <svg
        className="w-full h-full text-foreground opacity-[0.04] dark:opacity-[0.1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Neural Network Nodes - distributed across screen */}
        <g fill="currentColor" className="filter drop-shadow-[0_0_2px_rgba(59,130,246,0.5)]">
          {/* Row 1 */}
          <circle cx="10" cy="8" r="0.3" className="animate-pulse-neon" style={{ animationDelay: '0s' }} />
          <circle cx="25" cy="12" r="0.4" className="animate-pulse-neon text-blue-400" style={{ animationDelay: '0.5s' }} />
          <circle cx="45" cy="6" r="0.25" className="animate-pulse-neon" style={{ animationDelay: '1s' }} />
          <circle cx="70" cy="10" r="0.35" className="animate-pulse-neon text-cyan-400" style={{ animationDelay: '1.5s' }} />
          <circle cx="88" cy="5" r="0.3" />
          
          {/* Row 2 */}
          <circle cx="5" cy="25" r="0.25" />
          <circle cx="20" cy="30" r="0.35" className="animate-pulse-neon text-blue-400" style={{ animationDelay: '2s' }} />
          <circle cx="38" cy="22" r="0.3" />
          <circle cx="55" cy="28" r="0.4" className="animate-pulse-neon text-indigo-400" style={{ animationDelay: '0.5s' }} />
          <circle cx="75" cy="25" r="0.3" />
          <circle cx="92" cy="32" r="0.35" />
          
          {/* Row 3 - Center area */}
          <circle cx="12" cy="48" r="0.35" className="animate-pulse-neon" style={{ animationDelay: '1.5s' }} />
          <circle cx="30" cy="45" r="0.3" className="animate-pulse-neon text-blue-400" style={{ animationDelay: '1s' }} />
          <circle cx="48" cy="52" r="0.4" className="animate-pulse-neon text-cyan-400" style={{ animationDelay: '0s' }} />
          <circle cx="65" cy="48" r="0.25" className="animate-pulse-neon text-indigo-400" style={{ animationDelay: '3s' }} />
          <circle cx="82" cy="55" r="0.35" />
          <circle cx="95" cy="45" r="0.3" />
          
          {/* Row 4 */}
          <circle cx="8" cy="70" r="0.3" />
          <circle cx="22" cy="68" r="0.4" className="animate-pulse-neon text-blue-400" style={{ animationDelay: '0.8s' }} />
          <circle cx="42" cy="75" r="0.3" />
          <circle cx="58" cy="72" r="0.35" className="animate-pulse-neon text-cyan-400" style={{ animationDelay: '2.2s' }} />
          <circle cx="78" cy="68" r="0.25" />
          <circle cx="90" cy="75" r="0.35" className="animate-pulse-neon text-indigo-400" style={{ animationDelay: '1s' }} />
          
          {/* Row 5 - Bottom */}
          <circle cx="15" cy="90" r="0.35" className="animate-pulse-neon" style={{ animationDelay: '1.2s' }} />
          <circle cx="35" cy="88" r="0.3" />
          <circle cx="52" cy="95" r="0.25" className="animate-pulse-neon text-blue-400" style={{ animationDelay: '2.5s' }} />
          <circle cx="68" cy="92" r="0.4" className="animate-pulse-neon text-cyan-400" style={{ animationDelay: '0.3s' }} />
          <circle cx="85" cy="88" r="0.3" />
        </g>
        
        {/* Subtle connecting lines */}
        <g stroke="currentColor" strokeWidth="0.08" opacity="0.4" className="filter drop-shadow-[0_0_1px_currentColor]">
          {/* Top connections */}
          <line x1="10" y1="8" x2="25" y2="12" className="text-blue-500/30" />
          <line x1="25" y1="12" x2="45" y2="6" className="text-cyan-500/30" />
          <line x1="70" y1="10" x2="88" y2="5" className="text-indigo-500/30" />
          
          {/* Diagonal connections */}
          <line x1="25" y1="12" x2="20" y2="30" />
          <line x1="45" y1="6" x2="55" y2="28" />
          <line x1="70" y1="10" x2="75" y2="25" />
          
          {/* Center connections */}
          <line x1="20" y1="30" x2="30" y2="45" strokeDasharray="1 1" />
          <line x1="55" y1="28" x2="48" y2="52" strokeDasharray="1.5 1.5" />
          <line x1="75" y1="25" x2="82" y2="55" />
          
          {/* Lower connections */}
          <line x1="30" y1="45" x2="22" y2="68" />
          <line x1="48" y1="52" x2="42" y2="75" />
          <line x1="65" y1="48" x2="58" y2="72" strokeDasharray="1 2" />
          
          {/* Bottom connections */}
          <line x1="22" y1="68" x2="35" y2="88" />
          <line x1="58" y1="72" x2="68" y2="92" className="text-blue-500/30" />
          <line x1="78" y1="68" x2="85" y2="88" className="text-cyan-500/30" />
        </g>
        
        {/* Accent larger nodes */}
        <g fill="currentColor" opacity="0.8" className="filter blur-[1px]">
          <circle cx="48" cy="52" r="0.6" className="animate-pulse-neon text-cyan-400" />
          <circle cx="25" cy="12" r="0.5" className="animate-pulse-neon text-blue-400" style={{ animationDelay: '1s' }} />
          <circle cx="75" cy="25" r="0.5" className="animate-pulse-neon text-indigo-400" style={{ animationDelay: '2s' }} />
        </g>
      </svg>
    </div>
  );
}
