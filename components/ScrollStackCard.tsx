"use client";

import React, { useRef, useEffect } from "react";
import { createScrollStackAnimation } from "@/lib/scrollAnimations";

type ScrollStackCardProps = {
  title: string;
  description: string;
  glowColor: string;
  cardStyle?: React.CSSProperties;
  stepNumber: number;
  totalSteps: number;
  icon?: React.ReactNode;
};

export default function ScrollStackCard({
  title,
  description,
  glowColor,
  cardStyle = {},
  stepNumber,
  totalSteps,
  icon,
}: ScrollStackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;

    const card = cardRef.current;
    const container = containerRef.current;
    const glowElement = card.querySelector<HTMLElement>(
      "[aria-hidden='true']"
    ) || undefined;

    // Create scroll stack animation
    const cleanup = createScrollStackAnimation({
      element: card,
      containerElement: container,
      stepNumber,
      totalSteps,
      glowElement,
    });

    return cleanup;
  }, [stepNumber, totalSteps]);

  return (
    <div ref={containerRef} className="relative w-full h-72">
      <div
        ref={cardRef}
        className="absolute inset-0 group"
        style={{
          transformOrigin: "center bottom",
        }}
      >
        {/* Glow background */}
        <div
          aria-hidden
          className="absolute -inset-4 rounded-2xl blur-3xl opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl"
          style={{ backgroundColor: glowColor }}
        />

        {/* Decorative border accent */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            border: `1.5px solid ${glowColor}`,
          }}
        />

        {/* Card content */}
        <div
          className="relative z-10 rounded-2xl overflow-hidden p-6 md:p-8 transition-all duration-300 ease-out transform-gpu hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 cursor-pointer h-full flex flex-col justify-between"
          style={cardStyle}
          tabIndex={0}
          role="article"
        >
          {/* Top section with step badge and icon */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="relative shrink-0">
              {/* Outer glow ring for better visibility */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                style={{
                  backgroundColor: glowColor,
                  transform: "scale(1.15)",
                }}
              />
              
              {/* Inner shadow ring for depth */}
              <div
                className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                style={{
                  boxShadow: `inset 0 1px 3px rgba(0,0,0,0.3), 0 0 30px ${glowColor}60`,
                }}
              />
              
              {/* Main badge container */}
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 shadow-2xl"
                style={{
                  backgroundColor: glowColor,
                  color: '#FFFFFF',
                  border: `3px solid rgba(255,255,255,0.9)`,
                  boxShadow: `0 8px 32px ${glowColor}60, 0 0 30px ${glowColor}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  background: `linear-gradient(135deg, ${glowColor}ee 0%, ${glowColor}dd 100%)`,
                }}
              >
                {stepNumber}
                
                {/* Subtle shine effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
                  }}
                />
              </div>
            </div>
            {icon && (
              <div className="text-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 mt-1">
                {icon}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-2">
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-white/80 leading-relaxed line-clamp-3 grow">
            {description}
          </p>

          {/* Bottom accent line */}
          <div
            className="mt-4 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20"
            style={{ backgroundColor: glowColor, opacity: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
}
