import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ConnectModal } from "./ConnectModal";

const navLinks = [
  { label: "Registry", href: "/", ocid: "nav.link.1" },
  { label: "Manifesto", href: "/about", ocid: "nav.link.2" },
  { label: "Guidelines", href: "/submit", ocid: "nav.link.3" },
  { label: "The Lab", href: "/lab", ocid: "nav.link.4" },
];

/* ── Tiny dot indicator shown below hovered nav links ── */
function NavLink({
  href,
  label,
  ocid,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  ocid: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      data-ocid={ocid}
      onClick={onClick}
      className="group relative flex flex-col items-center px-3 py-1.5"
      style={{ textDecoration: "none" }}
    >
      <span
        style={{
          color: isActive ? "#FFFFFF" : "#9CA3AF",
          fontSize: "14px",
          fontWeight: 500,
          transition: "color 0.18s ease",
        }}
        className="group-hover:!text-white"
      >
        {label}
      </span>
      {/* Indigo dot — fades in below text on hover */}
      <span
        className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200${isActive ? " !opacity-100" : ""}`}
        style={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "#4F46E5",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />
    </Link>
  );
}

/* ── Three-dot hamburger icon ── */
function ThreeDotsIcon() {
  return (
    <span className="flex flex-col items-center gap-[3px]" aria-hidden="true">
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#9CA3AF",
          display: "block",
        }}
      />
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#9CA3AF",
          display: "block",
        }}
      />
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#9CA3AF",
          display: "block",
        }}
      />
    </span>
  );
}

/* ── "Join the Brotherhood" button ── */
function JoinButton({
  onClick,
  ocid = "nav.join_button",
  fullWidth = false,
}: {
  onClick: () => void;
  ocid?: string;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={hovered ? "animate-glow-pulse" : ""}
      style={{
        background: hovered ? "#4F46E5" : "transparent",
        border: "1px solid #4F46E5",
        color: hovered ? "#FFFFFF" : "#4F46E5",
        padding: "8px 18px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.18s ease, color 0.18s ease",
        whiteSpace: "nowrap",
        width: fullWidth ? "100%" : undefined,
      }}
    >
      Join the Brotherhood
    </button>
  );
}

export function Navbar() {
  const { user, isConnected, disconnect } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* ── Fixed glass header ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 70,
          background: "rgba(10, 10, 11, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(79, 70, 229, 0.3)",
        }}
      >
        <nav
          className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between"
          style={{ height: "100%" }}
        >
          {/* ── LEFT: Logo ── */}
          <div className="relative group flex-shrink-0">
            <Link to="/" aria-label="HalfBuilt home">
              <span
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#4F46E5",
                  fontSize: "15px",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                HALFBUILT
              </span>
            </Link>
            {/* Tooltip on logo hover */}
            <span
              className="pointer-events-none absolute left-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                fontSize: "11px",
                color: "#9CA3AF",
                whiteSpace: "nowrap",
                background: "rgba(10,10,11,0.9)",
                padding: "3px 7px",
                borderRadius: "4px",
                border: "1px solid rgba(79,70,229,0.2)",
              }}
              aria-hidden="true"
            >
              [ status: building_the_future ]
            </span>
          </div>

          {/* ── CENTER: Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                ocid={link.ocid}
                isActive={isActive(link.href)}
              />
            ))}
          </div>

          {/* ── RIGHT: Auth + mobile toggle ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop: connected user dropdown */}
            {isConnected && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.03] hover:bg-white/[0.06] transition-all text-sm"
                    data-ocid="nav.dropdown_menu"
                    aria-label="User menu"
                    style={{ color: "#9CA3AF" }}
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage
                        src={user.githubAvatarUrl}
                        alt={user.githubUsername}
                      />
                      <AvatarFallback
                        className="text-[10px] text-white"
                        style={{ background: "#312e81" }}
                      >
                        {user.githubUsername.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      style={{
                        fontFamily: "'Geist Mono', ui-monospace, monospace",
                        fontSize: "12px",
                      }}
                    >
                      {user.githubUsername}
                    </span>
                    <ChevronDown className="w-3 h-3" style={{ opacity: 0.5 }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="text-white min-w-[140px]"
                  style={{
                    background: "rgba(10,10,11,0.97)",
                    border: "1px solid rgba(79,70,229,0.2)",
                  }}
                >
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="cursor-pointer gap-2"
                    data-ocid="nav.disconnect_button"
                    style={{ color: "#9CA3AF" }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Desktop: Join button (opens ConnectModal) */
              <div className="hidden md:block">
                <JoinButton
                  ocid="nav.join_button"
                  onClick={() => setConnectOpen(true)}
                />
              </div>
            )}

            {/* Mobile: three-dot hamburger */}
            <button
              type="button"
              className="md:hidden p-2.5 rounded-md transition-colors hover:bg-white/[0.05]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-ocid="nav.mobile_toggle"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" style={{ color: "#9CA3AF" }} />
              ) : (
                <ThreeDotsIcon />
              )}
            </button>
          </div>
        </nav>

        {/* ── Mobile menu panel ── */}
        {mobileOpen && (
          <div
            data-ocid="nav.mobile_menu"
            style={{
              background: "rgba(10, 10, 11, 0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(79, 70, 229, 0.2)",
            }}
            className="md:hidden px-4 py-4 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={link.ocid}
                onClick={() => setMobileOpen(false)}
                className="group block px-3 py-2.5 rounded-md transition-colors"
                style={{
                  color: isActive(link.href) ? "#FFFFFF" : "#9CA3AF",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile auth section */}
            <div
              className="pt-3 mt-2"
              style={{ borderTop: "1px solid rgba(79,70,229,0.15)" }}
            >
              {isConnected && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={user.githubAvatarUrl}
                        alt={user.githubUsername}
                      />
                      <AvatarFallback
                        className="text-[10px] text-white"
                        style={{ background: "#312e81" }}
                      >
                        {user.githubUsername.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      style={{
                        fontFamily: "'Geist Mono', ui-monospace, monospace",
                        fontSize: "12px",
                        color: "#9CA3AF",
                      }}
                    >
                      {user.githubUsername}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setMobileOpen(false);
                    }}
                    className="text-xs transition-colors"
                    style={{ color: "#f87171" }}
                    data-ocid="nav.disconnect_button"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="px-1 pt-1">
                  <JoinButton
                    ocid="nav.connect_button"
                    fullWidth
                    onClick={() => {
                      setConnectOpen(true);
                      setMobileOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
    </>
  );
}
