import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid place-items-center h-8 w-8 rounded-md bg-gradient-brand shadow-glow">
        <Zap className="h-4 w-4 text-background" fill="currentColor" strokeWidth={0} />
      </span>
      <span className="text-lg font-semibold tracking-tight">Nirpesh</span>
    </Link>
  );
}
