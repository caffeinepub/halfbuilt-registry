import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { HandoverType, Project } from "../backend.d";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const HANDOVER_CONFIG: Record<
  HandoverType,
  { label: string; className: string; dot: string }
> = {
  fullAdoption: {
    label: "Full Adoption",
    className: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
    dot: "bg-indigo-400",
  },
  equityPartnership: {
    label: "Equity Partnership",
    className: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  codeSwap: {
    label: "Code Swap",
    className:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const handover = HANDOVER_CONFIG[project.handoverType] ?? {
    label: project.handoverType,
    className: "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20",
    dot: "bg-zinc-400",
  };

  return (
    <article
      data-ocid={`feed.item.${index}`}
      className="group relative flex flex-col h-full rounded-xl overflow-hidden
        bg-gradient-to-b from-white/[0.045] to-white/[0.02]
        border border-white/[0.08]
        transition-all duration-300
        hover:border-indigo-500/40 hover:shadow-indigo-glow hover:from-white/[0.06] hover:to-white/[0.025]"
    >
      {/* Top-left accent line — replaces generic top-border stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col flex-1 p-5 gap-3">
        {/* Handover type badge — top */}
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${handover.dot}`}
          />
          <Badge
            className={`text-[10px] px-2 py-0.5 font-medium rounded-full border-0 ${handover.className}`}
          >
            {handover.label}
          </Badge>
        </div>

        {/* Title — clear primary element */}
        <h3 className="font-semibold text-white text-[16px] leading-snug line-clamp-2 tracking-tight group-hover:text-indigo-50 transition-colors">
          {project.title}
        </h3>

        {/* Pitch — clearly subordinate */}
        <p className="text-zinc-500 text-[13px] leading-relaxed line-clamp-3 flex-1">
          {project.pitch}
        </p>

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-500/[0.07] text-indigo-400/70 text-[10px] font-mono border border-indigo-500/[0.1]"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.03] text-zinc-600 text-[10px] font-mono">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action strip — full-width bottom CTA, slides on hover */}
      <Link
        to="/project/$id"
        params={{ id: String(project.id) }}
        className="relative flex items-center justify-between px-5 py-3 border-t border-white/[0.06] group-hover:border-indigo-500/20
          bg-transparent group-hover:bg-indigo-500/[0.05]
          transition-all duration-300"
      >
        <span className="text-zinc-600 text-[11px] font-mono group-hover:text-zinc-500 transition-colors">
          #{String(project.id)}
        </span>
        <span className="flex items-center gap-1.5 text-indigo-400 text-xs font-medium group-hover:text-indigo-300 transition-colors">
          View Project
          <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>
    </article>
  );
}

// Handover badge for standalone use (e.g., in ProjectView)
export function HandoverBadge({ type }: { type: HandoverType }) {
  const config = HANDOVER_CONFIG[type] ?? {
    label: type,
    className: "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20",
    dot: "bg-zinc-400",
  };
  return (
    <Badge
      className={`text-xs px-2.5 py-0.5 font-medium rounded-full ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

// External link icon for use in project view
export { ExternalLink };
