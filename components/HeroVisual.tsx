"use client";

import { useEffect, useState } from "react";

export default function HeroVisual() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Start visibility animation
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    // Animation sequence: 0 (initial) -> 1 (entering funnel) -> 2 (processing) -> 3 (output)
    const phaseTimers = [
      setTimeout(() => setAnimationPhase(1), 1500),  // Start entering funnel
      setTimeout(() => setAnimationPhase(2), 2500),  // Processing in funnel
      setTimeout(() => setAnimationPhase(3), 3500),  // Output bullet points
      setTimeout(() => setAnimationPhase(0), 6000),  // Loop back
    ];
    
    // Loop the animation
    const loopInterval = setInterval(() => {
      setAnimationPhase(0);
      setTimeout(() => setAnimationPhase(1), 1500);
      setTimeout(() => setAnimationPhase(2), 2500);
      setTimeout(() => setAnimationPhase(3), 3500);
    }, 6000);

    return () => {
      clearTimeout(timer);
      phaseTimers.forEach(t => clearTimeout(t));
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <div 
      className={`mt-16 max-w-5xl mx-auto transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Glass Stage Container */}
      <div className="relative rounded-3xl overflow-visible shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Animation Container */}
        <div className="relative flex items-center justify-center py-12 md:py-16 px-4">
          
          {/* Data Flow Connections */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0">
            {/* Left connection: Document to Orb */}
            <svg className="absolute left-[25%] md:left-[30%] w-[20%] md:w-[15%] h-1" viewBox="0 0 100 4" preserveAspectRatio="none">
              <line 
                x1="0" y1="2" x2="100" y2="2" 
                stroke="rgba(99, 102, 241, 0.3)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              {/* Animated particle traveling left to center */}
              {animationPhase >= 1 && animationPhase < 3 && (
                <circle r="2" fill="rgba(99, 102, 241, 0.8)" cy="2">
                  <animate 
                    attributeName="cx" 
                    from="0" 
                    to="100" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="0;1;1;0" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </svg>

            {/* Right connection: Orb to Results */}
            <svg className="absolute right-[25%] md:right-[30%] w-[20%] md:w-[15%] h-1" viewBox="0 0 100 4" preserveAspectRatio="none">
              <line 
                x1="0" y1="2" x2="100" y2="2" 
                stroke="rgba(139, 92, 246, 0.3)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              {/* Animated particle traveling center to right */}
              {animationPhase >= 2 && (
                <circle r="2" fill="rgba(139, 92, 246, 0.8)" cy="2">
                  <animate 
                    attributeName="cx" 
                    from="0" 
                    to="100" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="0;1;1;0" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </svg>

            {/* Gradient beam overlay for extra glow */}
            {animationPhase >= 1 && (
              <>
                <div className="absolute left-[25%] md:left-[30%] w-[20%] md:w-[15%] h-0.5 top-1/2 -translate-y-1/2 bg-linear-to-r from-transparent via-[#6366F1]/20 to-transparent blur-sm"></div>
              </>
            )}
            {animationPhase >= 2 && (
              <>
                <div className="absolute right-[25%] md:right-[30%] w-[20%] md:w-[15%] h-0.5 top-1/2 -translate-y-1/2 bg-linear-to-r from-transparent via-[#8B5CF6]/20 to-transparent blur-sm"></div>
              </>
            )}
          </div>

          {/* Left Side: Complex Document */}
        <div className="flex-1 flex justify-end pr-8 md:pr-16">
          <div>
            {/* Label above document */}
            <p className="text-white/50 text-xs mb-2 ml-1 uppercase tracking-wide">Research Paper</p>
            
            {/* Complex Document Icon */}
            <div className="relative">
              <div className="w-40 md:w-48 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm shadow-2xl p-5 md:p-6 relative overflow-hidden">
                {/* Document "text" lines - chaotic and dense */}
                <div className="space-y-2">
                  <div className="h-1.5 bg-white/40 rounded w-full"></div>
                  <div className="h-1 bg-white/30 rounded w-[92%]"></div>
                  <div className="h-1 bg-white/30 rounded w-full"></div>
                  <div className="h-1 bg-white/25 rounded w-[88%]"></div>
                  <div className="h-1 bg-white/30 rounded w-full"></div>
                  <div className="h-1 bg-white/25 rounded w-[95%]"></div>
                  <div className="h-1 bg-white/30 rounded w-full"></div>
                  <div className="h-1 bg-white/25 rounded w-[85%]"></div>
                  <div className="h-1 bg-white/30 rounded w-full"></div>
                  <div className="h-1 bg-white/25 rounded w-[90%]"></div>
                  <div className="h-1 bg-white/30 rounded w-full"></div>
                  <div className="h-1 bg-white/25 rounded w-[93%]"></div>
                  <div className="h-1 bg-white/30 rounded w-full"></div>
                  <div className="h-1 bg-white/25 rounded w-[87%]"></div>
                </div>
                
                {/* Document metadata badge */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                    <span className="text-[10px] text-white/60 font-medium">PDF</span>
                  </div>
                  <span className="text-[10px] text-white/40">50+ pages</span>
                </div>
              </div>
              
              {/* Floating particles around document */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#6366F1] rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#8B5CF6] rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>

        {/* Center: AI Processor Orb */}
        <div className="relative z-10">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            {/* Main Orb Container */}
            <div className="relative w-full h-full">
              {/* Outer rotating ring */}
              <div className={`absolute inset-0 rounded-full border-2 border-[#6366F1]/40 ${animationPhase === 2 ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#6366F1] rounded-full blur-sm"></div>
              </div>
              
              {/* Middle rotating ring */}
              <div className={`absolute inset-2 rounded-full border-2 border-[#8B5CF6]/40 ${animationPhase === 2 ? 'animate-spin' : ''}`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full blur-sm"></div>
              </div>
              
              {/* Core Orb */}
              <div className="absolute inset-4 rounded-full bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#22D3EE] shadow-2xl">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent"></div>
              </div>
              
              {/* AI Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">AI</span>
              </div>
            </div>

            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-[#6366F1]/30 via-[#8B5CF6]/30 to-[#22D3EE]/30 rounded-full blur-2xl -z-10 animate-pulse"></div>
            
            {/* Additional glow layers */}
            <div className="absolute inset-[-20%] bg-linear-to-br from-[#6366F1]/10 via-transparent to-[#22D3EE]/10 rounded-full blur-3xl -z-20"></div>
          </div>
        </div>

        {/* Right Side: Clean Bullet Points */}
        <div className="flex-1 flex justify-start pl-8 md:pl-16">
          <div>
            {/* Label above card */}
            <p className="text-white/50 text-xs mb-2 ml-1 uppercase tracking-wide">Analysis Results</p>
            
            {/* Clean Summary Output */}
            <div className="w-40 md:w-48 rounded-xl bg-linear-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-white/20 backdrop-blur-sm shadow-2xl p-5 md:p-6">
              {/* Title line */}
              <div className="mb-4">
                <div className="h-2 bg-white/80 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-white/60 rounded w-1/2"></div>
              </div>
              
              {/* Structured content sections */}
              <div className="space-y-4">
                {/* Section 1 - Abstract */}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-1 bg-white/60 rounded w-full"></div>
                    <div className="h-1 bg-white/50 rounded w-[90%]"></div>
                    <div className="h-1 bg-white/50 rounded w-[70%]"></div>
                  </div>
                </div>
                
                {/* Section 2 - Methods */}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-1.5 shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-1 bg-white/60 rounded w-full"></div>
                    <div className="h-1 bg-white/50 rounded w-[85%]"></div>
                    <div className="h-1 bg-white/50 rounded w-[60%]"></div>
                  </div>
                </div>
                
                {/* Section 3 - Results */}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1.5 shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-1 bg-white/60 rounded w-full"></div>
                    <div className="h-1 bg-white/50 rounded w-[95%]"></div>
                    <div className="h-1 bg-white/50 rounded w-[50%]"></div>
                  </div>
                </div>
                
                {/* Section 4 - Conclusion */}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-1 bg-white/60 rounded w-full"></div>
                    <div className="h-1 bg-white/50 rounded w-[75%]"></div>
                  </div>
                </div>
              </div>
              
              {/* Success badge - pill style */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] text-emerald-300 font-medium">Summarized</span>
                </div>
                <span className="text-[10px] text-white/40">2.3s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
