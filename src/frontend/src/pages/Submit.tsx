import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { type KeyboardEvent, useRef, useState } from "react";
import { ConnectModal } from "../components/ConnectModal";
import { useAuth } from "../context/AuthContext";
import { useSubmitProject } from "../hooks/useQueries";

const HANDOVER_OPTIONS = [
  { value: "fullAdoption", label: "Full Adoption" },
  { value: "equityPartnership", label: "Equity Partnership" },
  { value: "codeSwap", label: "Code Swap" },
];

export function Submit() {
  const { user, isConnected } = useAuth();
  const [connectOpen, setConnectOpen] = useState(false);
  const {
    mutateAsync: submitProject,
    isPending,
    isError,
    isSuccess,
  } = useSubmitProject();

  const [title, setTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [handoverType, setHandoverType] = useState("");
  const [pitch, setPitch] = useState("");
  const [validationError, setValidationError] = useState("");

  const tagInputRef = useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const cleaned = val.trim().replace(/,/g, "");
    if (!cleaned) return;
    if (techStack.includes(cleaned)) return;
    if (techStack.length >= 10) return;
    setTechStack((prev) => [...prev, cleaned]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && techStack.length > 0) {
      setTechStack((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !repoUrl.trim() || !handoverType || !pitch.trim()) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    setValidationError("");

    await submitProject({
      title: title.trim(),
      repoUrl: repoUrl.trim(),
      techStack,
      handoverTypeText: handoverType,
      pitch: pitch.trim(),
      submitterGithubId: user.githubId,
    });
  };

  // Auth gate
  if (!isConnected) {
    return (
      <>
        <main className="min-h-screen pt-28 px-4 sm:px-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              data-ocid="submit.auth_gate.card"
              className="max-w-sm w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                <span className="text-indigo-400 text-xl">⌘</span>
              </div>
              <h2 className="text-white font-semibold text-lg mb-2">
                Authentication Required
              </h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Connect your GitHub to submit a project to the registry.
              </p>
              <Button
                onClick={() => setConnectOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white w-full h-10 gap-2"
                data-ocid="nav.connect_button"
              >
                Connect GitHub
              </Button>
            </div>
          </motion.div>
        </main>
        <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
      </>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <main className="min-h-screen pt-28 px-4 sm:px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          data-ocid="submit.success_state"
          className="max-w-md w-full bg-white/[0.03] border border-emerald-500/20 rounded-xl p-8 text-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-xl mb-3">
            Project Submitted
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Your project has been submitted for review. You'll be notified once
            it's approved.
          </p>
          <div className="flex gap-3">
            <Link to="/" className="flex-1">
              <Button
                variant="ghost"
                className="w-full border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              >
                Back to Registry
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <p className="text-indigo-400 text-xs font-medium uppercase tracking-widest mb-2">
              Submit Portal
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              List Your Project
            </h1>
            <p className="text-zinc-400 text-sm">
              Submitting as{" "}
              <span className="font-mono text-indigo-300">
                @{user?.githubUsername}
              </span>
              . Projects are reviewed before going live.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-zinc-300 text-sm font-medium"
              >
                Project Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. Abandoned SaaS Analytics Dashboard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-600 focus:border-indigo-500/60 h-11"
                required
                data-ocid="submit.title.input"
              />
            </div>

            {/* Repo URL */}
            <div className="space-y-2">
              <Label
                htmlFor="repo-url"
                className="text-zinc-300 text-sm font-medium"
              >
                Repository URL <span className="text-red-400">*</span>
              </Label>
              <Input
                id="repo-url"
                type="url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-600 focus:border-indigo-500/60 h-11 font-mono text-sm"
                required
                data-ocid="submit.repo_url.input"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">
                Tech Stack
              </Label>
              <div
                className="min-h-11 bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-2 flex flex-wrap gap-2 items-center cursor-text focus-within:border-indigo-500/60 transition-colors"
                onClick={() => tagInputRef.current?.focus()}
                onKeyDown={() => tagInputRef.current?.focus()}
                role="presentation"
              >
                {techStack.map((tag, i) => (
                  <span
                    key={tag}
                    data-ocid={`submit.tech_stack.tag.${i + 1}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/[0.12] text-indigo-300 text-xs font-mono border border-indigo-500/[0.2]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                      className="text-indigo-400/60 hover:text-indigo-300 transition-colors ml-0.5"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => addTag(tagInput)}
                  placeholder={
                    techStack.length === 0
                      ? "Type a technology and press Enter (React, Python, Rust...)"
                      : ""
                  }
                  className="flex-1 min-w-[120px] bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
                  data-ocid="submit.tech_stack.input"
                />
              </div>
              <p className="text-zinc-600 text-xs">
                Press Enter or comma to add each technology. {techStack.length}
                /10
              </p>
            </div>

            {/* Handover Type */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">
                Handover Type <span className="text-red-400">*</span>
              </Label>
              <Select value={handoverType} onValueChange={setHandoverType}>
                <SelectTrigger
                  className="bg-white/[0.04] border-white/[0.1] text-white h-11 data-[placeholder]:text-zinc-600"
                  data-ocid="submit.handover_type.select"
                >
                  <SelectValue placeholder="Select how you want to hand over…" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f11] border border-white/[0.1] text-white">
                  {HANDOVER_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-zinc-300 hover:text-white focus:text-white focus:bg-white/[0.06]"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pitch */}
            <div className="space-y-2">
              <Label
                htmlFor="pitch"
                className="text-zinc-300 text-sm font-medium"
              >
                The Pitch <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="pitch"
                placeholder="Why should someone take this over? What's the state of the code? What did you build?"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                rows={5}
                className="bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-600 focus:border-indigo-500/60 resize-none leading-relaxed"
                required
                data-ocid="submit.pitch.textarea"
              />
              <p className="text-zinc-600 text-xs text-right">
                {pitch.length} chars
              </p>
            </div>

            {/* Validation error */}
            {validationError && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {validationError}
              </div>
            )}

            {/* Mutation error */}
            {isError && (
              <div
                data-ocid="submit.error_state"
                className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                Failed to submit project. Please try again.
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-indigo-glow transition-all gap-2 disabled:opacity-50"
                data-ocid="submit.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span data-ocid="submit.loading_state">Submitting…</span>
                  </>
                ) : (
                  <>
                    Submit for Review
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-zinc-600 text-xs text-center mt-3">
                Your project will be reviewed before appearing in the registry.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
