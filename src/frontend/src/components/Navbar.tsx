import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { useAuth } from "../context/AuthContext";
import { ConnectModal } from "./ConnectModal";

export function Navbar() {
  const { user, isConnected, disconnect } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { label: "Registry", href: "/", ocid: "nav.link.1" },
    { label: "Submit", href: "/submit", ocid: "nav.link.2" },
    { label: "About", href: "/about", ocid: "nav.link.3" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0b]/90 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="HalfBuilt home"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center shadow-indigo-glow-sm">
              <span className="text-white font-bold text-xs leading-none">
                H
              </span>
            </div>
            <span className="font-bold text-indigo-50 text-[15px] tracking-tight group-hover:text-white transition-colors">
              HalfBuilt
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={link.ocid}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-white/[0.06]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-2">
            {isConnected && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.03] hover:bg-white/[0.06] transition-all text-sm text-zinc-300 hover:text-white"
                    data-ocid="nav.dropdown_menu"
                    aria-label="User menu"
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage
                        src={user.githubAvatarUrl}
                        alt={user.githubUsername}
                      />
                      <AvatarFallback className="text-[10px] bg-indigo-800 text-white">
                        {user.githubUsername.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-mono text-xs">
                      {user.githubUsername}
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#0f0f11] border border-white/[0.1] text-white min-w-[140px]"
                >
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-500/5 cursor-pointer gap-2"
                    data-ocid="nav.disconnect_button"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConnectOpen(true)}
                className="hidden md:flex items-center gap-2 border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/60 bg-transparent text-xs h-8"
                data-ocid="nav.connect_button"
              >
                <SiGithub className="w-3.5 h-3.5" />
                Connect GitHub
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a0b] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={link.ocid}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-white/[0.06]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/[0.06] mt-2">
              {isConnected && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={user.githubAvatarUrl}
                        alt={user.githubUsername}
                      />
                      <AvatarFallback className="text-[10px] bg-indigo-800 text-white">
                        {user.githubUsername.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-mono text-xs text-zinc-300">
                      {user.githubUsername}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setMobileOpen(false);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    data-ocid="nav.disconnect_button"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setConnectOpen(true);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-600/10 rounded-md transition-colors"
                  data-ocid="nav.connect_button"
                >
                  <SiGithub className="w-4 h-4" />
                  Connect GitHub
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </>
  );
}
