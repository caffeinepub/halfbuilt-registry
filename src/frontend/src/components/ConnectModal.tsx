import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { useAuth } from "../context/AuthContext";
import { useConnectUser } from "../hooks/useQueries";

interface ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectModal({ open, onOpenChange }: ConnectModalProps) {
  const { setUserData } = useAuth();
  const { mutateAsync: connectUser, isPending } = useConnectUser();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter your GitHub username.");
      return;
    }
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
      setError("Please enter a valid GitHub username.");
      return;
    }

    setError("");
    try {
      const avatarUrl = `https://avatars.githubusercontent.com/${trimmed}`;
      await connectUser({
        githubId: trimmed,
        githubUsername: trimmed,
        githubAvatarUrl: avatarUrl,
      });
      setUserData({
        githubId: trimmed,
        githubUsername: trimmed,
        githubAvatarUrl: avatarUrl,
      });
      setUsername("");
      onOpenChange(false);
    } catch (err) {
      console.error("Connect error:", err);
      setError("Failed to connect. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#0f0f11] border border-white/[0.08] text-white max-w-md"
        data-ocid="connect.modal"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <SiGithub className="w-4 h-4 text-indigo-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              Connect GitHub
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
            Enter your GitHub username to identify yourself on HalfBuilt. No
            OAuth required — just your handle.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-username" className="text-zinc-300 text-sm">
              GitHub Username
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">
                @
              </span>
              <Input
                id="github-username"
                type="text"
                placeholder="yourhandle"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                className="pl-7 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-indigo-500/20 font-mono"
                autoFocus
                autoComplete="username"
                data-ocid="connect.input"
              />
            </div>
            {error && (
              <p
                className="text-red-400 text-xs mt-1"
                data-ocid="connect.error_state"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
              onClick={() => onOpenChange(false)}
              data-ocid="connect.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !username.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50"
              data-ocid="connect.confirm_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
