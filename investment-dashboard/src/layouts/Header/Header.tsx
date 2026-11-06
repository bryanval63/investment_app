import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNav, Nav, SettingsLink } from "./Nav/Nav";
import { NetWorthChip } from "./NetWorthChip";

export const Header = () => {
  return (
    <header className="relative z-50 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/70 bg-white/70 px-4 shadow-[0_1px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:px-8">
      <div className="flex flex-1 items-center">
        <Link
          to="/investments"
          className="flex items-center gap-2.5"
          aria-label="InvestTrack, accueil"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/25">
            <TrendingUp className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Invest
            <span className="bg-linear-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Track
            </span>
          </span>
        </Link>
      </div>

      <Nav />

      <div className="flex flex-1 items-center justify-end gap-2">
        <NetWorthChip />
        <SettingsLink />
        <MobileNav />
      </div>
    </header>
  );
};
