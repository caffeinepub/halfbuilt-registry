import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, User } from "../backend.d";
import { useActor } from "./useActor";

// ── Stats ──────────────────────────────────────────────────────────────────

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { listed: 0, inAudit: 0, adopted: 0 };
      const result = await actor.getStats();
      return {
        listed: Number(result.listed),
        inAudit: Number(result.inAudit),
        adopted: Number(result.adopted),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Projects ───────────────────────────────────────────────────────────────

export function useApprovedProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["approvedProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProjectById(id: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Project | null>({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProjectById(BigInt(id));
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// ── User ───────────────────────────────────────────────────────────────────

export function useUserByGithubId(githubId: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<User | null>({
    queryKey: ["user", githubId],
    queryFn: async () => {
      if (!actor || !githubId) return null;
      return actor.getUserByGithubId(githubId);
    },
    enabled: !!actor && !isFetching && !!githubId,
  });
}

// ── Connect user ───────────────────────────────────────────────────────────

export function useConnectUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      githubId,
      githubUsername,
      githubAvatarUrl,
    }: {
      githubId: string;
      githubUsername: string;
      githubAvatarUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.connectUser(githubId, githubUsername, githubAvatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ── Submit project ─────────────────────────────────────────────────────────

export function useSubmitProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      repoUrl,
      techStack,
      handoverTypeText,
      pitch,
      submitterGithubId,
    }: {
      title: string;
      repoUrl: string;
      techStack: string[];
      handoverTypeText: string;
      pitch: string;
      submitterGithubId: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitProject(
        title,
        repoUrl,
        techStack,
        handoverTypeText,
        pitch,
        submitterGithubId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["approvedProjects"] });
    },
  });
}

// ── Ping ───────────────────────────────────────────────────────────────────

export function usePing() {
  const { actor, isFetching } = useActor();
  return useQuery<number | null>({
    queryKey: ["ping"],
    queryFn: async () => {
      if (!actor) return null;
      const t0 = performance.now();
      await actor.getStats();
      return Math.round(performance.now() - t0);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

// ── Submit proposal ────────────────────────────────────────────────────────

export function useSubmitProposal() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      projectId,
      proposerGithubId,
      message,
    }: {
      projectId: bigint;
      proposerGithubId: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitProposal(projectId, proposerGithubId, message);
    },
  });
}
