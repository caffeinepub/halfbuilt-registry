import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // TYPES

  public type GithubId = Text;
  public type HandoverType = {
    #fullAdoption;
    #equityPartnership;
    #codeSwap;
  };

  public type ProjectStatus = {
    #pending;
    #approved;
    #adopted;
  };

  public type User = {
    githubId : GithubId;
    githubUsername : Text;
    githubAvatarUrl : Text;
    createdAt : Time.Time;
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      Text.compare(user1.githubId, user2.githubId);
    };
  };

  public type Project = {
    id : Nat;
    title : Text;
    repoUrl : Text;
    techStack : [Text];
    handoverType : HandoverType;
    pitch : Text;
    status : ProjectStatus;
    submitterGithubId : GithubId;
    createdAt : Time.Time;
  };

  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };
  };

  public type Proposal = {
    id : Nat;
    projectId : Nat;
    proposerGithubId : GithubId;
    message : Text;
    createdAt : Time.Time;
  };

  module Proposal {
    public func compare(proposal1 : Proposal, proposal2 : Proposal) : Order.Order {
      Nat.compare(proposal1.id, proposal2.id);
    };
  };

  public type UserProfile = {
    githubId : GithubId;
    githubUsername : Text;
    githubAvatarUrl : Text;
  };

  // STORAGE
  let users = Map.empty<GithubId, User>();
  let projects = Map.empty<Nat, Project>();
  let proposals = Map.empty<Nat, Proposal>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let principalToGithubId = Map.empty<Principal, GithubId>();
  var projectIdCounter = 0;
  var proposalIdCounter = 0;

  // USER PROFILE MANAGEMENT (Required by frontend)

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    principalToGithubId.add(caller, profile.githubId);
  };

  // APPLICATION FUNCTIONS

  public shared ({ caller }) func connectUser(
    githubId : Text,
    githubUsername : Text,
    githubAvatarUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can connect");
    };

    // Verify the caller's profile matches the githubId they're trying to connect
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.githubId != githubId) {
          Runtime.trap("Unauthorized: GitHub ID mismatch with user profile");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found. Please save your profile first.");
      };
    };

    let newUser : User = {
      githubId;
      githubUsername;
      githubAvatarUrl;
      createdAt = Time.now();
    };
    users.add(githubId, newUser);
  };

  public shared ({ caller }) func submitProject(
    title : Text,
    repoUrl : Text,
    techStack : [Text],
    handoverTypeText : Text,
    pitch : Text,
    submitterGithubId : GithubId,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit projects");
    };

    // Verify the caller's GitHub ID matches the submitter
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.githubId != submitterGithubId) {
          Runtime.trap("Unauthorized: Submitter GitHub ID must match your profile");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found. Please save your profile first.");
      };
    };

    let handoverType = switch (handoverTypeText) {
      case ("Full Adoption") { #fullAdoption };
      case ("Equity Partnership") { #equityPartnership };
      case ("Code Swap") { #codeSwap };
      case (_) { Runtime.trap("Invalid handover type") };
    };

    let newProject : Project = {
      id = projectIdCounter;
      title;
      repoUrl;
      techStack;
      handoverType;
      pitch;
      status = #pending;
      submitterGithubId;
      createdAt = Time.now();
    };

    projects.add(projectIdCounter, newProject);
    projectIdCounter += 1;
    newProject.id;
  };

  public shared ({ caller }) func submitProposal(
    projectId : Nat,
    proposerGithubId : GithubId,
    message : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit proposals");
    };

    // Verify the caller's GitHub ID matches the proposer
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.githubId != proposerGithubId) {
          Runtime.trap("Unauthorized: Proposer GitHub ID must match your profile");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found. Please save your profile first.");
      };
    };

    // Verify the project exists
    switch (projects.get(projectId)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?_) {};
    };

    let newProposal : Proposal = {
      id = proposalIdCounter;
      projectId;
      proposerGithubId;
      message;
      createdAt = Time.now();
    };

    proposals.add(proposalIdCounter, newProposal);
    proposalIdCounter += 1;
    newProposal.id;
  };

  public shared ({ caller }) func updateProjectStatus(id : Nat, statusText : Text) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update project status");
    };
    let status = switch (statusText) {
      case ("pending") { #pending };
      case ("approved") { #approved };
      case ("adopted") { #adopted };
      case (_) { Runtime.trap("Invalid project status text") };
    };

    switch (projects.get(id)) {
      case (null) { false };
      case (?project) {
        let updatedProject = {
          project with status
        };
        projects.add(id, updatedProject);
        true;
      };
    };
  };

  public query ({ caller }) func getApprovedProjects() : async [Project] {
    projects.values().toArray().filter(
      func(p) { p.status == #approved }
    ).sort();
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch all projects");
    };
    projects.values().toArray().sort();
  };

  public query ({ caller }) func getProjectById(id : Nat) : async ?Project {
    projects.get(id);
  };

  public query ({ caller }) func getStats() : async {
    listed : Nat;
    inAudit : Nat;
    adopted : Nat;
  } {
    var listed = 0;
    var inAudit = 0;
    var adopted = 0;

    for ((_, project) in projects.entries()) {
      switch (project.status) {
        case (#approved) { listed += 1 };
        case (#pending) { inAudit += 1 };
        case (#adopted) { adopted += 1 };
      };
    };

    {
      listed;
      inAudit;
      adopted;
    };
  };

  public query ({ caller }) func getUserByGithubId(githubId : GithubId) : async ?User {
    users.get(githubId);
  };

  public query ({ caller }) func getProposalsByProject(projectId : Nat) : async [Proposal] {
    proposals.values().toArray().filter(
      func(p) { p.projectId == projectId }
    ).sort();
  };
};
