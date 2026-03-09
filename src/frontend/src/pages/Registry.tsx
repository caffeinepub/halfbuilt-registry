import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { usePostModal } from "../context/PostModalContext";
import { useApprovedProjects } from "../hooks/useQueries";

/* ── Inline keyframe for the plus glow pulse ─────────────────────────────── */
const plusGlowCSS = `
  @keyframes plusGlow {
    0%   { box-shadow: 0 0 5px rgba(79,70,229,0.2),  0 0 10px rgba(79,70,229,0.1); }
    50%  { box-shadow: 0 0 25px rgba(79,70,229,0.7), 0 0 50px rgba(79,70,229,0.3); }
    100% { box-shadow: 0 0 5px rgba(79,70,229,0.2),  0 0 10px rgba(79,70,229,0.1); }
  }
  .plus-glow-anim {
    animation: plusGlow 2.8s ease-in-out infinite;
  }
`;

/* ── CSS Plus Sign Icon ──────────────────────────────────────────────────── */
function PlusIcon() {
  return (
    <>
      <style>{plusGlowCSS}</style>
      {/* Outer wrapper — circular so box-shadow forms a round aura */}
      <div
        aria-hidden="true"
        className="plus-glow-anim"
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Inner cross container — 60×60 */}
        <div
          style={{
            position: "relative",
            width: "60px",
            height: "60px",
          }}
        >
          {/* Horizontal bar */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "8px",
              background: "#4F46E5",
              borderRadius: "2px",
              transform: "translateY(-50%)",
            }}
          />
          {/* Vertical bar */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "8px",
              background: "#4F46E5",
              borderRadius: "2px",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ── Ghost Card ──────────────────────────────────────────────────────────── */
function GhostCard({ rotate = 0 }: { rotate?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        opacity: 0.05,
        border: "1px dashed #4F46E5",
        borderRadius: "12px",
        height: "220px",
        width: "290px",
        flexShrink: 0,
        pointerEvents: "none",
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

/* ── Initialize CTA Button ───────────────────────────────────────────────── */
function InitializeButton() {
  const [hovered, setHovered] = useState(false);
  const { openPostModal } = usePostModal();

  return (
    <button
      type="button"
      data-ocid="registry.initialize_button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openPostModal()}
      style={{
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        color: "#F3F4F6",
        padding: "16px 32px",
        borderRadius: "6px",
        fontSize: "14px",
        letterSpacing: "0.1em",
        cursor: "pointer",
        background: "rgba(10, 10, 11, 0.7)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        border: hovered
          ? "1px solid #4F46E5"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered
          ? "0 8px 32px 0 rgba(0,0,0,0.8), 0 0 20px rgba(79,70,229,0.3)"
          : "0 8px 32px 0 rgba(0,0,0,0.8)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {hovered ? "LEAVE YOUR MARK, BOSS." : "[ INITIALIZE FIRST REPOSITORY ]"}
    </button>
  );
}

/* ── Vacuum State ────────────────────────────────────────────────────────── */
function VacuumState() {
  return (
    <div
      data-ocid="registry.empty_state"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 220px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 0 — Ghost cards spread behind the content */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          alignItems: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <GhostCard rotate={-2} />
        <GhostCard rotate={0.5} />
        <GhostCard rotate={1.5} />
      </div>

      {/* Layer 1 — Centered vacuum content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <PlusIcon />

        <div
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            letterSpacing: "0.2em",
            fontSize: "24px",
            textTransform: "uppercase",
          }}
        >
          THE REGISTRY IS SILENT.
        </div>

        <p
          style={{
            color: "#9CA3AF",
            fontSize: "16px",
            maxWidth: "400px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          100 slots for the &lsquo;CEO&rsquo;s Brothers&rsquo; are open. Be the
          one who starts the fire.
        </p>

        <div style={{ marginTop: "8px" }}>
          <InitializeButton />
        </div>
      </motion.div>
    </div>
  );
}

/* ── Skeleton Loading Cards ──────────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div
      data-ocid="registry.loading_state"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "12px",
        width: "100%",
      }}
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
  );
}

/* ── Registry Page ───────────────────────────────────────────────────────── */
export function Registry() {
  const { data: projects, isLoading, isError } = useApprovedProjects();

  const hasProjects = (projects?.length ?? 0) > 0;

  return (
    <main
      data-ocid="registry.section"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 70px)",
        paddingTop: "70px" /* offset for fixed navbar */,
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* ── Ambient rotating conic glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "700px",
          height: "700px",
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(79,70,229,0.12) 20%, transparent 40%, rgba(79,70,229,0.08) 60%, transparent 80%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          transformOrigin: "center center",
          animation: "rotate-glow 20s linear infinite",
        }}
      />

      {/* ── Grid / content container ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: hasProjects ? "80px 20px" : "40px 20px",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <SkeletonGrid />
            </div>
          </div>
        ) : isError ? (
          <div
            data-ocid="registry.error_state"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "80px",
              color: "#9CA3AF",
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: "14px",
              letterSpacing: "0.05em",
            }}
          >
            Failed to load projects.
          </div>
        ) : hasProjects ? (
          /* ── Populated grid ── */
          <div
            data-ocid="registry.grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "12px",
            }}
          >
            {projects!.map((project, i) => (
              <motion.div
                key={String(project.id)}
                data-ocid={`registry.card.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex"
              >
                <ProjectCard project={project} index={i + 1} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* ── Zero-project vacuum state ── */
          <VacuumState />
        )}
      </div>
    </main>
  );
}
