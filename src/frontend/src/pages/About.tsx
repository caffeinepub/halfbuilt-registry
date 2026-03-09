import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface ManifestoSection {
  title: string;
  body: string;
}

const sections: ManifestoSection[] = [
  {
    title: "The Problem",
    body: "Every year, millions of lines of code are abandoned. Not because they were bad — because life happened. A pivot. A new job. A lost co-founder. Burnout. The code sits in a private repo, gathering dust, while other builders spend months recreating what already exists.",
  },
  {
    title: "Our Mission: Liquidity for Logic",
    body: "HalfBuilt is a zero-cost community utility. We believe code is an asset. Like real estate or intellectual property, unfinished software has value — and that value shouldn't evaporate because a founder lost interest. We created a registry for that value to be transferred.",
  },
  {
    title: "The Zero-Fake Transparency Pact",
    body: "Every stat on this platform is real. Every project is real. Every founder who listed is real. We will never inflate numbers, fake traction, or manufacture social proof. If the registry is empty, we'll say so. If we have 3 users, we'll show 3. This is our founding commitment.",
  },
  {
    title: "The Founder 100",
    body: "The first 100 builders who list a project on HalfBuilt are the seeds of this community. They are the proof of concept. Their abandoned work is the genesis block of the registry. If you're reading this before the feed has 100 projects, you have a chance to be one of them.",
  },
  {
    title: "How It Works",
    body: "List your abandoned project. Describe the stack, the state, and your preferred handover type — Full Adoption, Equity Partnership, or Code Swap. Another builder finds it, sends an Adoption Proposal, and you connect. No fees. No intermediaries. Pure signal.",
  },
];

export function About() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-ocid="about.section"
        >
          {/* Header */}
          <div className="mb-14">
            <p className="text-indigo-400 text-xs font-medium uppercase tracking-widest mb-4">
              Manifesto
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              The HalfBuilt Manifesto
            </h1>
            <div className="w-12 h-0.5 bg-indigo-500/60 rounded-full" />
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                <h2 className="text-white font-semibold text-xl mb-4 leading-snug">
                  {section.title}
                </h2>
                <p className="text-zinc-400 leading-[1.85] text-[15px]">
                  {section.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 pt-10 border-t border-white/[0.06]"
          >
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8">
              <p className="text-indigo-400 text-xs font-medium uppercase tracking-widest mb-3">
                The Founder 100
              </p>
              <h3 className="text-white font-semibold text-xl mb-3">
                Ready to seed the registry?
              </h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                If you have an abandoned project that could become someone
                else's foundation, list it now. Be one of the first 100.
              </p>
              <Link to="/submit">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-10 px-5 gap-2 shadow-indigo-glow">
                  List Your Project
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 mt-20 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
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
    </main>
  );
}
