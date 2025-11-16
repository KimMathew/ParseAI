"use client";

import React from 'react';

export default function SectionBackground() {
  return (
    <>
      {/* Base Gradient Layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)'
        }}
      ></div>

      {/* Subtle Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)'
        }}
      ></div>
      
      {/* Ambient Light Orbs */}
      {/* Large Indigo Orb - Top Left */}
      <div 
        className="absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'float 20s ease-in-out infinite'
        }}
      ></div>
      
      {/* Large Purple Orb - Bottom Right */}
      <div 
        className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)',
          transform: 'translate(50%, 50%)',
          animation: 'float 25s ease-in-out infinite reverse'
        }}
      ></div>
      
      {/* Medium Cyan Orb - Top Right */}
      <div 
        className="absolute top-[20%] right-[15%] w-[320px] h-[320px] rounded-full blur-3xl opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.1) 40%, transparent 70%)',
          transform: 'translate(50%, -50%)',
          animation: 'float 30s ease-in-out infinite'
        }}
      ></div>
      
      {/* Medium Pink Orb - Bottom Left */}
      <div 
        className="absolute bottom-[20%] left-[15%] w-[320px] h-[320px] rounded-full blur-3xl opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
          transform: 'translate(-50%, 50%)',
          animation: 'float 28s ease-in-out infinite reverse'
        }}
      ></div>
      
      {/* Small Blue-Violet Orb - Left Edge Middle */}
      <div 
        className="absolute top-[50%] left-[8%] w-[280px] h-[280px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.12) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'float 24s ease-in-out infinite'
        }}
      ></div>
      
      {/* Small Purple Accent - Right Edge Middle */}
      <div 
        className="absolute top-[60%] right-[8%] w-[280px] h-[280px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, rgba(126, 34, 206, 0.12) 40%, transparent 70%)',
          transform: 'translate(50%, -50%)',
          animation: 'float 26s ease-in-out infinite reverse'
        }}
      ></div>
    </>
  );
}
