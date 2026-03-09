import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ProjectCard } from "../components/ProjectCard";
import { useApprovedProjects, useStats } from "../hooks/useQueries";

export function Home() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useApprovedProjects();

  const scrollToFeed = () => {
    document.getElementById("registry-feed")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <section
        data-ocid="hero.section"
        className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-24 bg-grid-pattern overflow-hidden"
      >
        {/* Animated glow blob */}
        <div
          className="hero-glow-blob absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        {/* Secondary subtle glow */}
        <div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Status mark — stark, not soft */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
            <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
              Registry&nbsp;&nbsp;/&nbsp;&nbsp;Open
            </span>
          </motion.div>

          {/* Headline — two deliberate lines, weight contrast */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="text-[clamp(2.6rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.03em] mb-7"
          >
            <span className="block text-white">Your unfinished projects</span>
            <span className="block text-indigo-400 italic font-bold">
              deserve a second life.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-11 tracking-wide"
          >
            Liquidity for Logic.{" "}
            <span className="text-zinc-400">
              We turn the GitHub Graveyard into a library of foundations for
              other builders.
            </span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Button
              onClick={scrollToFeed}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold px-7 h-11 shadow-indigo-glow transition-all duration-200 gap-2 text-[13px] tracking-wide"
            >
              View Registry
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/submit">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] h-11 px-7 transition-all text-[13px] tracking-wide"
              >
                List Your Project
              </Button>
            </Link>
          </motion.div>
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

      {/* Registry Feed */}
      <section
        id="registry-feed"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-indigo-400 text-xs font-medium uppercase tracking-widest mb-2">
              Open Source Intelligence
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The Registry
            </h2>
          </div>
          {(projects?.length ?? 0) > 0 && (
            <span className="text-zinc-600 text-sm font-mono">
              {projects?.length} project{projects?.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {projectsLoading ? (
          <div
            data-ocid="feed.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-3"
              >
                <Skeleton className="h-5 w-3/4 bg-white/[0.06]" />
                <Skeleton className="h-4 w-full bg-white/[0.04]" />
                <Skeleton className="h-4 w-5/6 bg-white/[0.04]" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 bg-white/[0.04] rounded-full" />
                  <Skeleton className="h-5 w-16 bg-white/[0.04] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : projectsError ? (
          <div
            data-ocid="feed.error_state"
            className="text-center py-16 text-zinc-500"
          >
            <p className="text-sm">Failed to load projects. Please refresh.</p>
          </div>
        ) : (projects?.length ?? 0) === 0 ? (
          <div data-ocid="feed.empty_state" className="flex justify-center">
            <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-400 text-lg">◈</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                The Genesis Drop is coming.
              </h3>
              <p className="text-zinc-400 text-sm mb-1">
                No projects are currently public.
              </p>
              <p className="text-zinc-500 text-sm mb-6">
                Be among the first 100 builders to list a project.
              </p>
              <Link to="/submit">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm h-9 px-5 gap-2">
                  Submit Your Project
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects?.map((project, i) => (
              <motion.div
                key={String(project.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex"
              >
                <ProjectCard project={project} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

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
