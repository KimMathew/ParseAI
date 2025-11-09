"use client";

import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  glowColor: string;
  outerClass?: string;
  cardStyle?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function FeatureCard({
  title,
  description,
  glowColor,
  outerClass = "relative group",
  cardStyle = {},
  children,
}: FeatureCardProps) {
  return (
    <div className={outerClass}>
      <div
        aria-hidden
        className="absolute inset-1 rounded-xl blur-lg opacity-80 transition-opacity duration-300 group-hover:opacity-95"
        style={{ backgroundColor: glowColor }}
      />

      <div
        className="relative z-10 rounded-2xl overflow-hidden p-8 transition-transform duration-300 ease-out transform-gpu hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-4 cursor-pointer md:h-56 h-full flex flex-col justify-center"
        style={cardStyle}
        tabIndex={0}
        role="article"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-white/90">{description}</p>
        {children}
      </div>
    </div>
  );
}
