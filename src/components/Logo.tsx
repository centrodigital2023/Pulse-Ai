import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`font-bold tracking-tighter text-xl ${className}`}>
      PULSE<span className="text-primary"> AI</span>
    </Link>
  );
}
