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

    // Create scroll stack animation
    const cleanup = createScrollStackAnimation({
      element: card,
      containerElement: container,
      stepNumber,
      totalSteps,
    });

    return cleanup;
  }, [stepNumber, totalSteps]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex">
      <div
        ref={cardRef}
        className="relative group flex-1 flex flex-col"
        style={{ transformOrigin: "center bottom" }}
      >
        {/* Glow background - simplified for better performance */}
        <div
          aria-hidden
          className="scroll-stack-glow absolute inset-1 rounded-2xl blur-xl opacity-40 pointer-events-none"
          style={{ backgroundColor: glowColor }}
        />

        {/* Card content */}
        <div
          className="relative z-10 rounded-2xl overflow-hidden p-6 md:p-8 transition-all duration-200 ease-out hover:scale-[1.02] focus:outline-none focus:ring-2 cursor-pointer flex flex-col justify-between h-full min-h-[220px]"
          style={cardStyle}
          tabIndex={0}
          role="article"
        >
          {/* Top section with step badge and icon */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="relative shrink-0">
              {/* Main badge container */}
              <div
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl transition-transform duration-200 group-hover:scale-110 shadow-lg"
                style={{
                  backgroundColor: glowColor,
                  color: '#FFFFFF',
                  border: `2px solid rgba(255,255,255,0.2)`,
                  boxShadow: `0 4px 20px ${glowColor}50`,
                }}
              >
                {stepNumber}
              </div>
            </div>
            {icon && (
              <div className="text-3xl opacity-40 transition-opacity duration-200 mt-1">
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
          <p className="text-sm md:text-base text-white/80 leading-relaxed grow">
            {description}
          </p>

          {/* Bottom accent line */}
          <div
            className="mt-4 h-1 w-16 rounded-full"
            style={{ backgroundColor: glowColor, opacity: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
