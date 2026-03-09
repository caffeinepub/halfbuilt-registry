import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStats, useSubmitProject } from "../hooks/useQueries";

interface PostProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestAuth?: () => void;
}

/* ── Minimal field label ──────────────────────────────────────────────────── */
function FieldLabel({ text, htmlFor }: { text: string; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        color: "#9CA3AF",
        fontSize: "12px",
        letterSpacing: "0.05em",
        display: "block",
        marginBottom: "6px",
        userSelect: "none",
      }}
    >
      {text}
    </label>
  );
}

/* ── Bottom-border-only input styles ─────────────────────────────────────── */
const baseFieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 0,
  color: "#F3F4F6",
  outline: "none",
  width: "100%",
  padding: "8px 0",
  fontFamily: "inherit",
  fontSize: "14px",
  transition: "border-bottom-color 0.2s ease",
};

/* ── Focused field: indigo bottom border ─────────────────────────────────── */
const focusedFieldStyle: React.CSSProperties = {
  ...baseFieldStyle,
  borderBottomColor: "rgba(79,70,229,0.6)",
};

/* ── Deterministic loading stages ───────────────────────────────────────── */
type LoadStage = "idle" | "uploading" | "45" | "89" | "done";

const stageText: Record<LoadStage, string> = {
  idle: "[ EXECUTE_INITIALIZATION ]",
  uploading: "UPLOADING_GENIUS...",
  "45": "45%...",
  "89": "89%...",
  done: "DONE",
};

const stageProgress: Record<LoadStage, number> = {
  idle: 0,
  uploading: 20,
  "45": 45,
  "89": 89,
  done: 100,
};

/* ── Auth prompt shown when user isn't connected ─────────────────────────── */
function AuthPrompt({
  onClose,
  onRequestAuth,
}: {
  onClose: () => void;
  onRequestAuth?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          color: "#9CA3AF",
          fontSize: "14px",
          lineHeight: 1.7,
        }}
      >
        Connect GitHub to post your project.
        <br />
        <span style={{ color: "#F3F4F6", fontSize: "12px" }}>
          Your identity is how the Brotherhood knows you.
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          onClose();
          onRequestAuth?.();
        }}
        style={{
          background: "#4F46E5",
          color: "#FFFFFF",
          fontWeight: 700,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          letterSpacing: "0.08em",
          border: "none",
          padding: "12px 28px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        [ CONNECT_GITHUB ]
      </button>
    </div>
  );
}

export function PostProjectModal({
  open,
  onOpenChange,
  onRequestAuth,
}: PostProjectModalProps) {
  const { user, isConnected } = useAuth();
  const { data: stats } = useStats();
  const { mutateAsync: submitProject } = useSubmitProject();

  // Form state
  const [projectId, setProjectId] = useState("");
  const [soul, setSoul] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [genesisChecked, setGenesisChecked] = useState(false);

  // Focus tracking for bottom-border color
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Hover state for the modal card border
  const [cardHovered, setCardHovered] = useState(false);

  // Loading sequence state
  const [loadStage, setLoadStage] = useState<LoadStage>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  const remaining = Math.max(0, 100 - (stats?.listed ?? 0));

  // ESC key closes modal
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setProjectId("");
      setSoul("");
      setCurrentStatus("");
      setSourceLink("");
      setGenesisChecked(false);
      setLoadStage("idle");
      setErrorMsg("");
    }
  }, [open]);

  const isLoading = loadStage !== "idle";

  function getFieldStyle(fieldName: string): React.CSSProperties {
    return focusedField === fieldName ? focusedFieldStyle : baseFieldStyle;
  }

  async function handleExecute() {
    if (!isConnected || !user) return;
    if (!projectId.trim()) {
      setErrorMsg("PROJECT_ID is required.");
      return;
    }
    setErrorMsg("");

    // Deterministic loading sequence
    setLoadStage("uploading");
    await delay(800);
    setLoadStage("45");
    await delay(600);
    setLoadStage("89");
    await delay(400);
    setLoadStage("done");

    // Call backend
    try {
      await submitProject({
        title: projectId.trim(),
        repoUrl: sourceLink.trim(),
        techStack: [],
        handoverTypeText: "fullAdoption",
        pitch: [soul.trim(), currentStatus.trim()].filter(Boolean).join("\n\n"),
        submitterGithubId: user.githubId,
      });
    } catch (err) {
      console.error("Submit error:", err);
    }

    // Close after brief DONE display
    await delay(600);
    onOpenChange(false);
  }

  // Genesis glow on the card
  const genesisGlow = genesisChecked
    ? "0 8px 32px 0 rgba(0,0,0,0.8), 0 0 80px 20px rgba(79,70,229,0.15)"
    : undefined;

  const cardBorder = cardHovered
    ? "1px solid #4F46E5"
    : "1px solid rgba(255,255,255,0.08)";

  return (
    <AnimatePresence>
      {open && (
        /* ── Backdrop ── */
        <motion.div
          key="post-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(5,5,5,0.9)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
        >
          {/* ── Modal Card ── */}
          <motion.div
            key="post-modal-card"
            ref={cardRef}
            data-ocid="post_modal.modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => setCardHovered(false)}
            className={cardHovered ? "animate-glow-pulse" : ""}
            style={{
              position: "relative",
              maxWidth: "650px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              /* obsidian-glass */
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              background: "rgba(10, 10, 11, 0.85)",
              border: cardBorder,
              boxShadow: genesisGlow ?? "0 8px 32px 0 rgba(0,0,0,0.8)",
              borderRadius: "12px",
              padding: "40px 36px",
              transition: "border-color 0.25s ease, box-shadow 0.35s ease",
            }}
          >
            {/* ── ESC to cancel ── */}
            <button
              type="button"
              data-ocid="post_modal.close_button"
              onClick={() => onOpenChange(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                color: "#9CA3AF",
                fontSize: "11px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 6px",
                letterSpacing: "0.02em",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#F3F4F6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
              }}
              aria-label="Close modal"
            >
              [ esc_to_cancel ]
            </button>

            {/* ── Section header ── */}
            <div
              style={{
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                color: "#4F46E5",
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "28px",
              }}
            >
              &gt; INITIALIZE_PROJECT
            </div>

            {/* ── Auth prompt or form ── */}
            {!isConnected ? (
              <AuthPrompt
                onClose={() => onOpenChange(false)}
                onRequestAuth={onRequestAuth}
              />
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecute();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                }}
              >
                {/* Field 1: PROJECT_ID */}
                <div>
                  <FieldLabel text="> PROJECT_ID" htmlFor="pm-project-id" />
                  <input
                    id="pm-project-id"
                    type="text"
                    data-ocid="post_modal.project_id.input"
                    placeholder="e.g., Swift_Network_Utility"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    onFocus={() => setFocusedField("projectId")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("projectId")}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>

                {/* Field 2: THE_SOUL */}
                <div>
                  <FieldLabel text="> THE_SOUL (ONE LINER)" htmlFor="pm-soul" />
                  <input
                    id="pm-soul"
                    type="text"
                    data-ocid="post_modal.soul.input"
                    placeholder="What makes this genius?"
                    value={soul}
                    onChange={(e) => setSoul(e.target.value)}
                    onFocus={() => setFocusedField("soul")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("soul")}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>

                {/* Field 3: CURRENT_STATUS */}
                <div>
                  <FieldLabel
                    text="> CURRENT_STATUS (THE HALF-BUILT TRUTH)"
                    htmlFor="pm-status"
                  />
                  <textarea
                    id="pm-status"
                    rows={4}
                    data-ocid="post_modal.status.textarea"
                    placeholder="It works, but the UI is trash... or it's just a concept for now."
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    onFocus={() => setFocusedField("status")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...getFieldStyle("status"),
                      resize: "none",
                    }}
                    disabled={isLoading}
                  />
                </div>

                {/* Field 4: SOURCE_LINK */}
                <div>
                  <FieldLabel text="> SOURCE_LINK" htmlFor="pm-source-link" />
                  <input
                    id="pm-source-link"
                    type="url"
                    data-ocid="post_modal.source_link.input"
                    placeholder="https://github.com/..."
                    value={sourceLink}
                    onChange={(e) => setSourceLink(e.target.value)}
                    onFocus={() => setFocusedField("sourceLink")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("sourceLink")}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>

                {/* Genesis Toggle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    paddingTop: "4px",
                  }}
                >
                  <GenesisToggle
                    checked={genesisChecked}
                    onChange={setGenesisChecked}
                    disabled={isLoading}
                  />
                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      color: "#9CA3AF",
                      fontSize: "12px",
                    }}
                  >
                    Claim Genesis Status (Remaining: {remaining}/100)
                  </span>
                </div>

                {/* Error */}
                {errorMsg && (
                  <p
                    style={{
                      color: "#f87171",
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      fontSize: "12px",
                      marginTop: "-12px",
                    }}
                    data-ocid="post_modal.error_state"
                  >
                    {errorMsg}
                  </p>
                )}

                {/* Execute button */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <button
                    type="submit"
                    data-ocid="post_modal.submit_button"
                    disabled={isLoading}
                    style={{
                      background: isLoading ? "rgba(79,70,229,0.6)" : "#4F46E5",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      letterSpacing: "0.08em",
                      border: "none",
                      width: "100%",
                      padding: "14px",
                      borderRadius: "4px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {stageText[loadStage]}
                  </button>

                  {/* Progress bar */}
                  {isLoading && (
                    <div
                      data-ocid="post_modal.loading_state"
                      style={{
                        width: "100%",
                        height: "3px",
                        background: "rgba(79,70,229,0.15)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${stageProgress[loadStage]}%`,
                          background: "#4F46E5",
                          borderRadius: "2px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  )}

                  {/* DONE text */}
                  {loadStage === "done" && (
                    <div
                      data-ocid="post_modal.success_state"
                      style={{
                        fontFamily: "'Geist Mono', ui-monospace, monospace",
                        color: "#10B981",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textAlign: "center",
                      }}
                    >
                      &gt; PROJECT_INITIALIZED. WELCOME TO THE BROTHERHOOD.
                    </div>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Custom Genesis toggle ───────────────────────────────────────────────── */
function GenesisToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-ocid="post_modal.genesis.toggle"
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: "relative",
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        background: checked ? "#4F46E5" : "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.12)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
        flexShrink: 0,
        padding: 0,
        boxShadow: checked ? "0 0 10px rgba(79,70,229,0.4)" : "none",
      }}
      aria-label="Claim Genesis Status"
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "18px" : "2px",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "#FFFFFF",
          transition: "left 0.2s ease",
          display: "block",
        }}
      />
    </button>
  );
}

/* ── Tiny async delay helper ─────────────────────────────────────────────── */
function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
