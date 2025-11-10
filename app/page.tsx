"use client";

import { useFadeUpAnimation } from "@/lib/useFadeUpAnimation";
import NavBar from "../components/NavBar";
import Aurora from "../components/Aurora";
import FeatureCard from "../components/FeatureCard";
import ScrollStackCard from "../components/ScrollStackCard";
import Footer from "../components/Footer";
import SectionBackground from "../components/SectionBackground";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/route";

export default function Home() {
  // Fade-up animation refs for each section
  const heroRef = useFadeUpAnimation({ delay: 0, stagger: 0.15 });
  const featuresHeaderRef = useFadeUpAnimation({ delay: 0.1, stagger: 0.1 });
  const featureCardsRef = useFadeUpAnimation({ delay: 0.2, stagger: 0.2 });
  const howItWorksHeaderRef = useFadeUpAnimation({ delay: 0.1, stagger: 0.1 });

  const router = useRouter();
  
  const handleTrySummarization = () => {
    router.push(ROUTES.SIGNIN);
    
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0C10] text-white">
      <NavBar />

      {/* Hero section */}
      <section className="relative min-h-screen" id="hero">
          {/* aurora canvas positioned behind content (no negative z so it stays above page background) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden min-h-screen">
            <Aurora colorStops={["#6366F1", "#22D3EE", "#8B5CF6"]} amplitude={1.2} blend={0.6} />
          </div>

          <div ref={heroRef} className="relative z-20 max-w-5xl mx-auto px-6 pt-28">
            <div className="rounded-xl px-6 py-20">
              <div className="text-center">
              <p className="inline-block px-4 py-1 rounded-full bg-white/6 text-sm mb-6">Instant AI research summarization</p>
              <h1 className="text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-tight"> Understand any research paper — instantly.</h1>
              <p className="mt-6 text-white/70 max-w-2xl mx-auto">Upload a PDF or paste text. Get structured summaries, keywords, and plain-English explanations powered by PARSe AI.</p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <a
                  className="inline-block w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-medium transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 cursor-pointer text-center"
                  role="button"
                  onClick={handleTrySummarization}
                >
                  Try Summarization
                </a>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-block w-full sm:w-auto px-6 py-3 rounded-full border border-white/10 text-white/80 cursor-pointer transition-all duration-200 ease-out hover:bg-white/4 hover:border-white/20 text-center"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features and How It Works Container with Shared Grid Background */}
      <div className="relative">
        {/* Vignette and Ambient Light Orbs */}
        <SectionBackground />

        {/* Shared Grid Pattern Background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)'
          }}
        ></div>

        {/* Features section */}
        <section className="relative py-16 scroll-mt-20" id="features">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center relative z-10">
            <div ref={featuresHeaderRef}>
              <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-4">
                Powerful tools that make research simple.
              </h2>
              <p className="text-center text-white/60 text-lg mb-16 max-w-2xl mx-auto">
                Three intelligent tools designed to simplify the way you read, understand, and interact with research papers.
              </p>
            </div>

            <div ref={featureCardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left large card (spans 2 cols on md) - uses first aurora color */}
            <FeatureCard
              outerClass="relative md:col-span-2 group h-full"
              glowColor="#6366F1"
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)',
                boxShadow: '0 36px 80px rgba(99,102,241,0.16), inset 0 1px 0 rgba(255,255,255,0.03)'
              }}
              title="Understand any paper in seconds"
              description="PARSe AI instantly extracts the Abstract, Methods, Results, and Conclusion of any research paper — turning dense studies into clear, structured insights you can digest fast."
            />

            {/* Right small card - uses second aurora color */}
            <FeatureCard
              outerClass="relative group h-full"
              glowColor="#22D3EE"
              cardStyle={{
                background: 'linear-gradient(160deg, rgba(34,211,238,0.8) 0%, rgba(24,170,190,0.8) 60%, rgba(8,120,130,1) 100%)',
                boxShadow: '0 36px 80px rgba(34,211,238,0.14), inset 0 1px 0 rgba(255,255,255,0.03)'
              }}
              title="Plain‑English Summaries"
              description="Automatically simplify jargon and explain complex ideas for quick understanding."
            />

            {/* Bottom full-width card - uses third aurora color */}
            <FeatureCard
              outerClass="relative md:col-span-3 group"
              glowColor="#8B5CF6"
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(105,70,200,0.8) 60%, rgba(70,42,160,1) 100%)',
                boxShadow: '0 36px 80px rgba(139,92,246,0.16), inset 0 1px 0 rgba(255,255,255,0.03)'
              }}
              title="Chat with your paper like a real expert"
              description="Once logged in, start an AI-powered chat that lets you ask follow-up questions, clarify concepts, or explore related ideas — directly based on the paper's content."
            />
          </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="relative pt-16 pb-32 scroll-mt-20" id="how-it-works">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center relative z-10">
          <div ref={howItWorksHeaderRef}>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-4">
              How It Works
            </h2>
            <p className="text-center text-white/60 text-lg mb-16 max-w-2xl mx-auto">
              Three simple steps to transform your research experience
            </p>
          </div>

          <div className="w-full relative space-y-6">
            <ScrollStackCard
              stepNumber={1}
              totalSteps={3}
              glowColor="#6366F1"
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)',
                boxShadow: '0 36px 80px rgba(99,102,241,0.16), inset 0 1px 0 rgba(255,255,255,0.03)'
              }}
              title="Upload Your Research"
              description="Easily upload a PDF or paste your research paper text directly into PARSe AI. Our system accepts multiple formats and handles files of any length."
            />

            <ScrollStackCard
              stepNumber={2}
              totalSteps={3}
              glowColor="#22D3EE"
              cardStyle={{
                background: 'linear-gradient(160deg, rgba(34,211,238,0.8) 0%, rgba(24,170,190,0.8) 60%, rgba(8,120,130,1) 100%)',
                boxShadow: '0 36px 80px rgba(34,211,238,0.14), inset 0 1px 0 rgba(255,255,255,0.03)'
              }}
              title="AI Analyzes in Seconds"
              description="Our advanced AI engine instantly processes your paper, extracting key findings, methodologies, and results. Powered by state-of-the-art language models."
            />

            <ScrollStackCard
              stepNumber={3}
              totalSteps={3}
              glowColor="#8B5CF6"
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(105,70,200,0.8) 60%, rgba(70,42,160,1) 100%)',
                boxShadow: '0 36px 80px rgba(139,92,246,0.16), inset 0 1px 0 rgba(255,255,255,0.03)'
              }}
              title="Get Clear Insights"
              description="Receive a beautifully formatted summary with key takeaways, plain-English explanations, and the ability to chat with an AI expert about the paper."
            />
          </div>
        </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
