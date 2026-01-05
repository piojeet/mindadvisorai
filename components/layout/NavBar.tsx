"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const { user } = useAuth();

  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MindAdvisor" width={100} height={100} />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="hero" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link href="/signup">Start Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
