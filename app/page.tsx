"use client";

import NavBar from "../components/NavBar";
import Aurora from "../components/Aurora";

export default function Home() {
  // Placeholder click handler — replace with router.push('/summarize') or a <Link> when the page exists
  const handleTrySummarization = () => {
    // TODO: navigate to the summarization page, e.g. using Next.js router:
    // const router = useRouter();
    // router.push('/summarize');
    // For now this is a no-op placeholder so you can paste the actual path later.
    /* eslint-disable no-console */
    console.log('Try Summarization clicked — replace with navigation');
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0C10] text-white">
      <NavBar />

      {/* Hero section */}
      <section className="relative min-h-screen">
          {/* aurora canvas positioned behind content (no negative z so it stays above page background) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Aurora colorStops={["#6366F1", "#22D3EE", "#8B5CF6"]} amplitude={1.2} blend={0.6} />
          </div>

          <div className="relative z-20 max-w-5xl mx-auto px-6 pt-28">
            <div className="rounded-xl px-6 py-20">
              <div className="text-center">
              <p className="inline-block px-4 py-1 rounded-full bg-white/6 text-sm mb-6">Instant AI research summarization</p>
              <h1 className="text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-tight"> Understand any research paper — instantly.</h1>
              <p className="mt-6 text-white/70 max-w-2xl mx-auto">Upload a PDF or paste text. Get structured summaries, keywords, and plain-English explanations powered by PARSe AI.</p>

              <div className="mt-10 flex items-center justify-center gap-6">
                <a
                  className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-medium transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 cursor-pointer"
                  role="button"
                  onClick={handleTrySummarization}
                >
                  Try Summarization
                </a>
                <a className="inline-block px-6 py-3 rounded-full border border-white/10 text-white/80">Explore Features</a>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
