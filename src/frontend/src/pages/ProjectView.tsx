import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ConnectModal } from "../components/ConnectModal";
import { HandoverBadge } from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import {
  useProjectById,
  useSubmitProposal,
  useUserByGithubId,
} from "../hooks/useQueries";

export function ProjectView() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { user, isConnected } = useAuth();
  const [connectOpen, setConnectOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalValidationError, setProposalValidationError] = useState("");
  const [proposalSuccess, setProposalSuccess] = useState(false);

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useProjectById(id);

  const { data: submitter } = useUserByGithubId(
    project?.submitterGithubId ?? undefined,
  );

  const {
    mutateAsync: submitProposal,
    isPending: proposalPending,
    isError: proposalError,
  } = useSubmitProposal();

  const handleRequestHandover = () => {
    if (!isConnected) {
      setConnectOpen(true);
    } else {
      setProposalOpen(true);
    }
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !project) return;

    if (!proposalMessage.trim()) {
      setProposalValidationError("Please write your adoption proposal.");
      return;
    }

    setProposalValidationError("");

    try {
      await submitProposal({
        projectId: project.id,
        proposerGithubId: user.githubId,
        message: proposalMessage.trim(),
      });
      setProposalSuccess(true);
    } catch {
      // Error handled by mutation state
    }
  };

  const closeProposalModal = () => {
    setProposalOpen(false);
    setProposalMessage("");
    setProposalValidationError("");
    setProposalSuccess(false);
  };

  if (projectLoading) {
    return (
      <main className="min-h-screen pt-24 px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto" data-ocid="project.loading_state">
          <Skeleton className="h-4 w-24 bg-white/[0.06] mb-8" />
          <Skeleton className="h-10 w-3/4 bg-white/[0.06] mb-4" />
          <Skeleton className="h-5 w-1/2 bg-white/[0.04] mb-8" />
          <div className="flex gap-2 mb-8">
            <Skeleton className="h-6 w-20 bg-white/[0.04] rounded-full" />
            <Skeleton className="h-6 w-20 bg-white/[0.04] rounded-full" />
          </div>
          <Skeleton className="h-32 w-full bg-white/[0.04]" />
        </div>
      </main>
    );
  }

  if (projectError || !project) {
    return (
      <main className="min-h-screen pt-24 px-4 sm:px-6 flex items-center justify-center">
        <div data-ocid="project.error_state" className="max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">
            Project Not Found
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            This project doesn't exist or has been removed from the registry.
          </p>
          <Link to="/">
            <Button
              variant="ghost"
              className="border border-white/[0.08] text-zinc-400 hover:text-white gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registry
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen pt-24 px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registry
            </Link>

            <article data-ocid="project.section" className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <HandoverBadge type={project.handoverType} />
                  <span className="text-zinc-600 text-xs font-mono self-center">
                    #{String(project.id)}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {project.title}
                </h1>

                {/* Repo URL */}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-300 font-mono text-sm transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                  {project.repoUrl}
                </a>
              </div>

              <div className="border-t border-white/[0.06]" />

              {/* Tech Stack */}
              {project.techStack.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/[0.08] text-indigo-300 text-sm font-mono border border-indigo-500/[0.12]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pitch */}
              <div className="space-y-3">
                <h2 className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                  The Pitch
                </h2>
                <p className="text-zinc-300 leading-relaxed text-base whitespace-pre-wrap">
                  {project.pitch}
                </p>
              </div>

              {/* Submitter */}
              <div className="space-y-3">
                <h2 className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                  Listed By
                </h2>
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 border border-white/[0.08]">
                    <AvatarImage
                      src={
                        submitter?.githubAvatarUrl ??
                        `https://avatars.githubusercontent.com/${project.submitterGithubId}`
                      }
                      alt={
                        submitter?.githubUsername ?? project.submitterGithubId
                      }
                    />
                    <AvatarFallback className="text-xs bg-indigo-800 text-white">
                      {project.submitterGithubId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white text-sm font-medium font-mono">
                      @{submitter?.githubUsername ?? project.submitterGithubId}
                    </p>
                    <a
                      href={`https://github.com/${project.submitterGithubId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 text-xs hover:text-indigo-400 transition-colors"
                    >
                      View on GitHub ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="border-t border-white/[0.06] pt-6">
                <Button
                  onClick={handleRequestHandover}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-11 px-8 shadow-indigo-glow transition-all gap-2 text-base"
                  data-ocid="project.request_handover.button"
                >
                  <Send className="w-4 h-4" />
                  Request Handover
                </Button>
                {!isConnected && (
                  <p className="text-zinc-600 text-xs mt-2 ml-1">
                    You'll need to connect your GitHub first.
                  </p>
                )}
              </div>
            </article>
          </motion.div>
        </div>
      </main>

      {/* Proposal Modal */}
      <Dialog open={proposalOpen} onOpenChange={closeProposalModal}>
        <DialogContent
          className="bg-[#0f0f11] border border-white/[0.08] text-white max-w-lg"
          data-ocid="project.proposal.modal"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Send Your Adoption Proposal
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              Write a compelling case for why you should take over{" "}
              <span className="text-zinc-300 font-medium">{project.title}</span>
              .
            </DialogDescription>
          </DialogHeader>

          {proposalSuccess ? (
            <div
              data-ocid="project.proposal.success_state"
              className="py-6 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Proposal Sent!</p>
              <p className="text-zinc-400 text-sm">
                The project owner will review your message.
              </p>
              <Button
                onClick={closeProposalModal}
                className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white"
                data-ocid="project.proposal.close_button"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSendProposal} className="space-y-4 mt-1">
              <Textarea
                placeholder="Describe your background, why you want to take this over, and what you plan to do with it..."
                value={proposalMessage}
                onChange={(e) => {
                  setProposalMessage(e.target.value);
                  if (proposalValidationError) setProposalValidationError("");
                }}
                rows={6}
                className="bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-600 focus:border-indigo-500/60 resize-none"
                data-ocid="project.proposal.textarea"
              />

              {(proposalValidationError || proposalError) && (
                <div
                  data-ocid="project.proposal.error_state"
                  className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {proposalValidationError ||
                    "Failed to send proposal. Please try again."}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeProposalModal}
                  className="flex-1 border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  data-ocid="project.proposal.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={proposalPending || !proposalMessage.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white gap-2 disabled:opacity-50"
                  data-ocid="project.proposal.submit_button"
                >
                  {proposalPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span data-ocid="project.proposal.loading_state">
                        Sending…
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Proposal
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Connect modal (opened when not authenticated) */}
      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </>
  );
}
