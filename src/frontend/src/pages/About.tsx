import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount only
  useEffect(() => {
    if (text.length === 0) return;
    let i = 0;
    setDisplayed("");
    setDone(false);

    let tid: ReturnType<typeof setTimeout>;

    const tick = () => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        return;
      }
      tid = setTimeout(tick, speed);
    };

    tid = setTimeout(tick, speed);
    return () => clearTimeout(tid);
  }, []);

  return { displayed, done };
}

// ─── ManifestoParagraph ────────────────────────────────────────────────────────
interface ManifestoParagraphProps {
  text: string;
  type: "paragraph" | "heading";
}

function ManifestoParagraph({ text, type }: ManifestoParagraphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOpacity(entry.isIntersecting ? 1 : 0.3);
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (type === "heading") {
    return (
      <div ref={ref}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.4,
            marginTop: "48px",
            marginBottom: "20px",
            opacity,
            color: "#FFFFFF",
            transition: "opacity 0.5s ease",
          }}
        >
          {text}
        </h2>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <p
        style={{
          fontSize: "18px",
          lineHeight: 1.85,
          marginBottom: "36px",
          opacity,
          color: "#F3F4F6",
          transition: "opacity 0.5s ease",
        }}
      >
        {text}
      </p>
    </div>
  );
}

// ─── Manifesto content ─────────────────────────────────────────────────────────
const BLOCKS: Array<{ type: "paragraph" | "heading"; text: string }> = [
  {
    type: "paragraph",
    text: 'The internet is becoming a pretty lonely place for people like us. Everywhere you look, it\'s all about "The Exit," "The Monetization," and "The Scaling." Everyone is trying to look perfect. If you haven\'t raised ten million dollars or built a world-changing app by Tuesday, the world makes you feel like you\'re failing.',
  },
  {
    type: "paragraph",
    text: "I'm calling BS on that.",
  },
  {
    type: "paragraph",
    text: "Think about your computer right now. How many folders do you have filled with projects that are 40% done? A script that almost works. A 3D model that's missing a texture. A business idea you wrote on a napkin.",
  },
  {
    type: "paragraph",
    text: 'Usually, those things just sit there. They die in the dark because you\'re afraid to show them. You think, "It\'s not ready yet," or "People will think I\'m a joke."',
  },
  {
    type: "heading",
    text: 'HalfBuilt is for the "In-Between."',
  },
  {
    type: "paragraph",
    text: 'We built this place — this Obsidian-glass clubhouse — to be the home for your unfinished genius. This is the space where you can drop a half-broken piece of code and say, "Hey, I\'m working on this," and instead of a "Like" button, you get a Brotherhood.',
  },
  {
    type: "heading",
    text: "Why is it so... expensive looking?",
  },
  {
    type: "paragraph",
    text: "Because just because your code is \"half-built\" doesn't mean you don't deserve a stage that looks like a billion dollars. We're using the Indigo Glow and the Obsidian blur because we respect the hustle. We want you to feel like a CEO the moment you log in.",
  },
  {
    type: "heading",
    text: 'The "No Greed" Policy.',
  },
  {
    type: "paragraph",
    text: "You'll see a donation button. It's capped at $50. Why? Because I don't want a \"Board of Directors.\" I want a $2 coffee and a server that doesn't lag. If this place ever becomes a Unicorn, it'll be because you guys kept the lights on, not because some suit in a skyscraper bought us out.",
  },
  {
    type: "heading",
    text: 'The "CEO\'s Brothers."',
  },
  {
    type: "paragraph",
    text: "The first 100 of you? You're the foundation. You aren't \"users.\" You're the ones who were here when this was just a dream in a room in Gurugram. Your profiles will stay unique forever. You're the OGs.",
  },
  {
    type: "heading",
    text: "So, here's the deal:",
  },
  {
    type: "paragraph",
    text: "Stop waiting for it to be perfect. Stop listening to the people who say you're failing just because you haven't \"finished\" yet.",
  },
  {
    type: "paragraph",
    text: "Post the project. Join the family.",
  },
  {
    type: "paragraph",
    text: "It's HalfBuilt vs. The Internet.",
  },
  {
    type: "paragraph",
    text: "We're already winning.",
  },
];

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-white/[0.06] py-8 mt-8">
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
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function About() {
  const navigate = useNavigate();
  const [ctaHovered, setCtaHovered] = useState(false);
  const FIRST_SENTENCE = "Look, let's be real for a second.";
  const { displayed, done } = useTypewriter(FIRST_SENTENCE, 35);

  const handleCtaClick = () => {
    void navigate({ to: "/" });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      data-ocid="manifesto.section"
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "80px",
        background: "#050505",
      }}
    >
      {/* Inner column — personal letter width */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginBottom: "48px" }}
        >
          <p
            style={{
              fontFamily: '"Geist Mono", ui-monospace, monospace',
              color: "#9CA3AF",
              letterSpacing: "0.3em",
              fontSize: "11px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {"[ HALFBUILT // MANIFESTO ]"}
          </p>
          <p
            style={{
              fontStyle: "italic",
              color: "#9CA3AF",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            A Note from the CEO Guy
          </p>
          {/* Indigo divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(79,70,229,0.8) 0%, rgba(79,70,229,0.1) 100%)",
              width: "100%",
            }}
          />
        </motion.div>

        {/* ── Typewriter first sentence ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ marginBottom: "36px" }}
        >
          <p
            style={{
              fontSize: "20px",
              color: "#F3F4F6",
              fontWeight: 500,
              lineHeight: 1.85,
            }}
          >
            {displayed}
            {!done && (
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1.1em",
                  background: "#4F46E5",
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  animation: "blink-cursor 0.8s step-end infinite",
                }}
                aria-hidden="true"
              />
            )}
          </p>
        </motion.div>

        {/* ── Scroll-lit blocks ─────────────────────────────────── */}
        <div>
          {BLOCKS.map((block) => (
            <ManifestoParagraph
              key={block.text}
              type={block.type}
              text={block.text}
            />
          ))}
        </div>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: "80px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: '"Geist Mono", ui-monospace, monospace',
              color: "#9CA3AF",
              fontSize: "14px",
              marginBottom: "24px",
              letterSpacing: "0.02em",
            }}
          >
            You made it to the end. That means something.
          </p>
          <button
            type="button"
            data-ocid="manifesto.cta_button"
            onClick={handleCtaClick}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              background: "#4F46E5",
              color: "#FFFFFF",
              padding: "14px 40px",
              borderRadius: "4px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              transform: ctaHovered ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              animation: ctaHovered
                ? "glowPulse 3s ease-in-out infinite"
                : "none",
            }}
          >
            I&apos;M IN, BOSS.
          </button>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <Footer />
      </div>
    </motion.main>
  );
}
