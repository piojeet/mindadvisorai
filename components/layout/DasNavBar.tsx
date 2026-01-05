"use client";

import { Coins, Flame, FlaskConical, LayoutDashboard, LogOut, Sparkles, Target, User, Users, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useRouter, usePathname } from "next/navigation";

interface DasNavBarProps {
  sidebarOpen: boolean;
  onClose: () => void;
}


export default function DasNavBar({
  sidebarOpen,
  onClose,
}: DasNavBarProps) {


  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  // 🔒 Redirect if not authenticated or onboarding not completed
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    // Redirect to onboarding if user is logged in but hasn't completed onboarding
    if (!authLoading && user && !profileLoading && profile && !profile.onboarding_completed) {
      router.push("/onboarding");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Mentor", href: "/dashboard/mentor", icon: Sparkles },
    { name: "Decision Lab", href: "/dashboard/decision-lab", icon: FlaskConical },
    { name: "Challenges", href: "/dashboard/challenges", icon: Target },
    { name: "Community", href: "/dashboard/community", icon: Users },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // ⏳ Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const credits = profile?.credits ?? 0;
  const maxCredits = 20;

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MindAdvisor" width={100} height={100} />
            </Link>
          </div>

          {/* Credits Display */}
          <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Credits</span>
              <Coins className="w-4 h-4 text-secondary" />
            </div>
            {profileLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-primary">{credits}</span>
                  <span className="text-sm text-muted-foreground">available</span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (credits / maxCredits) * 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Streak */}
          <div className="p-4 mx-4 mb-4 rounded-xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">7 Day Streak</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
        sidebarOpen ? "visible" : "invisible"
      )}>
        <div 
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />
        <aside className={cn(
          "absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MindAdvisor" width={100} height={100} />
            </Link>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        </aside>
      </div>


    </>
  )
}
