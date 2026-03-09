import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { usePing, useStats } from "../hooks/useQueries";

export function Home() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: ping } = usePing();

  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!glowRef.current || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = mousePos.current.x - rect.left;
      const y = mousePos.current.y - rect.top;
      glowRef.current.style.transform = `translate(${x - 450}px, ${y - 450}px)`;
    });
  }, []);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <main>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        data-ocid="hero.section"
        className="relative flex flex-col items-center justify-center px-4 sm:px-6 pb-24 pt-20 bg-[#050505] bg-grid-pattern overflow-hidden"
        style={{ minHeight: "85vh" }}
      >
        {/* Cursor-following gradient */}
        <div
          ref={glowRef}
          className="absolute top-0 left-0 pointer-events-none"
          aria-hidden="true"
          style={{
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
            transition: "transform 0.15s ease-out",
            willChange: "transform",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs uppercase mb-6 text-[#9CA3AF]"
            style={{ letterSpacing: "0.3em" }}
          >
            {"[ EST. 2026 // SECTOR 50 ]"}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="font-bold text-white leading-none mb-6"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 82px)",
              letterSpacing: "-0.04em",
              textShadow:
                "0 0 40px rgba(79,70,229,0.5), 0 0 80px rgba(79,70,229,0.25)",
            }}
          >
            HalfBuilt vs. The Internet.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-xl leading-[1.6] text-[#9CA3AF] max-w-[700px] text-center mx-auto mb-10"
          >
            The web is littered with unfinished genius. We&rsquo;re building a
            clubhouse to save it. No ads. No corporate BS. Just code, soul, and
            the brotherhood.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link to="/registry">
              <Button
                data-ocid="hero.primary_button"
                className="bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-[4px] px-8 h-12 font-semibold text-sm tracking-wider transition-all duration-200 hover:animate-glow-pulse"
              >
                EXPLORE THE REGISTRY
              </Button>
            </Link>
            <Link to="/about">
              <Button
                data-ocid="hero.secondary_button"
                variant="ghost"
                className="border border-[#9CA3AF] text-[#9CA3AF] hover:border-white hover:text-white hover:bg-transparent bg-transparent rounded-[4px] px-8 h-12 font-semibold text-sm tracking-wider transition-all duration-200"
              >
                READ THE MANIFESTO
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Live Connection Status */}
        <div
          data-ocid="hero.status_panel"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[#10B981] text-[12px] whitespace-nowrap"
        >
          {"status: FOUNDATIONS_LIVE // ping: "}
          {ping !== undefined && ping !== null ? `${ping}ms` : "...ms"}
        </div>
      </section>

      {/* Impact Ticker — instrument panel */}
      <div
        data-ocid="impact.ticker"
        className="border-y border-white/[0.07] bg-[#0c0c0e]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3">
            {statsLoading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 px-6 py-6 border-r border-white/[0.06] last:border-r-0"
                    data-ocid="impact.loading_state"
                  >
                    <Skeleton className="h-8 w-16 bg-white/[0.06]" />
                    <Skeleton className="h-3 w-24 bg-white/[0.03]" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <TickerItem
                  value={stats?.listed ?? 0}
                  label="Projects Listed"
                  delay={0}
                />
                <TickerItem
                  value={stats?.inAudit ?? 0}
                  label="In Audit"
                  delay={0.08}
                />
                <TickerItem
                  value={stats?.adopted ?? 0}
                  label="Foundations Adopted"
                  delay={0.16}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

function TickerItem({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col gap-1.5 px-5 sm:px-8 py-5 sm:py-6 border-r border-white/[0.06] last:border-r-0 border-l-[2px] border-l-indigo-500/30 first:border-l-indigo-500/50"
    >
      <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums tracking-tighter leading-none">
        {value.toLocaleString()}
      </span>
      <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
        {label}
      </span>
    </motion.div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-white/[0.06] py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-zinc-500">HalfBuilt</span>
          <span className="mx-2">·</span>
          <span>Zero fees. Zero fake data.</span>
        </div>
        <p>
          © {year}. Built with <span className="text-red-400">♥</span> using{" "}
          <a
            href={caffLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
