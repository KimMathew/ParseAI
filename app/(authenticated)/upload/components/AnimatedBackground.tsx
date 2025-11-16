"use client";

import React from 'react';

type AnimatedBackgroundProps = {
  isDarkMode: boolean;
};

export default function AnimatedBackground({ isDarkMode }: AnimatedBackgroundProps) {
  return (
    <>
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base Gradient Layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
              : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), linear-gradient(180deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
          }}
        ></div>
        
        Subtle Vignette Effect
        <div 
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
              : 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.05) 100%)'
          }}
        ></div>
        
        {/* Ambient Light Orbs - Enhanced & Balanced */}
        {/* Large Indigo Orb - Top Left Corner */}
        <div 
          className="absolute top-[8%] left-[8%] w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        
        {/* Large Purple Orb - Bottom Right Corner */}
        <div 
          className="absolute bottom-[8%] right-[8%] w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
            transform: 'translate(50%, 50%)',
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        ></div>
        
        {/* Medium Cyan Orb - Top Right */}
        <div 
          className="absolute top-[12%] right-[12%] w-[380px] h-[380px] rounded-full blur-3xl opacity-45"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.1) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, rgba(34, 211, 238, 0.06) 40%, transparent 70%)',
            transform: 'translate(50%, -50%)',
            animation: 'float 30s ease-in-out infinite'
          }}
        ></div>
        
        {/* Medium Pink Orb - Bottom Left */}
        <div 
          className="absolute bottom-[12%] left-[12%] w-[380px] h-[380px] rounded-full blur-3xl opacity-45"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.06) 40%, transparent 70%)',
            transform: 'translate(-50%, 50%)',
            animation: 'float 28s ease-in-out infinite reverse'
          }}
        ></div>
        
        {/* Small Blue-Violet Orb - Left Edge Middle */}
        <div 
          className="absolute top-[45%] left-[5%] w-[320px] h-[320px] rounded-full blur-3xl opacity-40"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.12) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'float 24s ease-in-out infinite'
          }}
        ></div>
        
        {/* Small Purple Accent - Right Edge Middle */}
        <div 
          className="absolute top-[55%] right-[5%] w-[320px] h-[320px] rounded-full blur-3xl opacity-40"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, rgba(126, 34, 206, 0.12) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(147, 51, 234, 0.14) 0%, rgba(126, 34, 206, 0.06) 40%, transparent 70%)',
            transform: 'translate(50%, -50%)',
            animation: 'float 26s ease-in-out infinite reverse'
          }}
        ></div>
        
        {/* Tiny Indigo Accent - Top Edge */}
        <div 
          className="absolute top-[5%] left-[35%] w-[250px] h-[250px] rounded-full blur-3xl opacity-35"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'float 22s ease-in-out infinite'
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}
        ></div>
      </div>
      
    </>
  );
}
