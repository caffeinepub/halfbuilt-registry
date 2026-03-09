import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface User {
    createdAt: Time;
    githubId: GithubId;
    githubUsername: string;
    githubAvatarUrl: string;
}
export interface Project {
    id: bigint;
    status: ProjectStatus;
    title: string;
    createdAt: Time;
    repoUrl: string;
    pitch: string;
    handoverType: HandoverType;
    submitterGithubId: GithubId;
    techStack: Array<string>;
}
export interface Proposal {
    id: bigint;
    proposerGithubId: GithubId;
    createdAt: Time;
    projectId: bigint;
    message: string;
}
export interface UserProfile {
    githubId: GithubId;
    githubUsername: string;
    githubAvatarUrl: string;
}
export type GithubId = string;
export enum HandoverType {
    fullAdoption = "fullAdoption",
    equityPartnership = "equityPartnership",
    codeSwap = "codeSwap"
}
export enum ProjectStatus {
    pending = "pending",
    approved = "approved",
    adopted = "adopted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    connectUser(githubId: string, githubUsername: string, githubAvatarUrl: string): Promise<void>;
    getAllProjects(): Promise<Array<Project>>;
    getApprovedProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProjectById(id: bigint): Promise<Project | null>;
    getProposalsByProject(projectId: bigint): Promise<Array<Proposal>>;
    getStats(): Promise<{
        inAudit: bigint;
        listed: bigint;
        adopted: bigint;
    }>;
    getUserByGithubId(githubId: GithubId): Promise<User | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProject(title: string, repoUrl: string, techStack: Array<string>, handoverTypeText: string, pitch: string, submitterGithubId: GithubId): Promise<bigint>;
    submitProposal(projectId: bigint, proposerGithubId: GithubId, message: string): Promise<bigint>;
    updateProjectStatus(id: bigint, statusText: string): Promise<boolean>;
}
