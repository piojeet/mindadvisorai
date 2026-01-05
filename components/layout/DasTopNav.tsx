"use client"
import { Coins, Flame, Menu } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useProfile } from "@/hooks/useProfile";

interface DasTopNavProps {
  onMenuClick: () => void;
}
export default function DasTopNav({ onMenuClick }: DasTopNavProps) {

    const { isLoading: profileLoading, profile } = useProfile();

    const credits = profile?.credits ?? 0;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
    <button 
      className="lg:hidden p-2 -ml-2"
      onClick={onMenuClick}
    >
      <Menu className="w-5 h-5" />
    </button>

    <div className="flex items-center gap-4 ml-auto">
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
        <Flame className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium">7 Day Streak</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <Coins className="w-4 h-4 text-primary" />
        {profileLoading ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="text-sm font-medium">{credits} Credits</span>
        )}
      </div>
    </div>
  </header>
  )
}
