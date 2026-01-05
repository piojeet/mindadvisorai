"use client"
import { 
    Brain, 
    Sparkles, 
    FlaskConical, 
    Target, 
    TrendingUp, 
    Coins, 
    Flame,
    ArrowRight,
    ChevronRight,
    Zap,
    CheckCircle2
  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHome() {

  const {user} = useAuth();

    const todaysFocus = "Building daily consistency in your career growth journey";
  const growthScore = 72;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Good morning! {user?.user_metadata?.full_name ?? "there"} 👋</h1>
          <p className="text-muted-foreground">Ready to grow today? Here&apos;s your personalized dashboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Growth Score</span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-lg text-primary">{growthScore}</span>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-semibold text-lg mb-1">Today&apos;s Focus</h2>
              <p className="text-muted-foreground mb-4">{todaysFocus}</p>
              <Button variant="hero" size="sm" asChild>
                <Link href="/dashboard/mentor">
                  Start with AI Mentor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Mentor Card */}
        <Link href="/dashboard/mentor">
          <Card className="card-hover group cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Sparkles className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="mt-3">AI Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Get personalized guidance for your real-life problems</p>
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4 text-secondary" />
                <span>2 credits per message</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Decision Lab Card */}
        <Link href="/dashboard/decision-lab">
          <Card className="card-hover group cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <FlaskConical className="w-5 h-5 text-secondary group-hover:text-secondary-foreground" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
              <CardTitle className="mt-3">Decision Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Simulate outcomes before you commit to a decision</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-secondary" />
                <span>New: Risk Analysis</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Daily Challenge Card */}
        <Link href="/dashboard/challenges">
          <Card className="card-hover group cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Target className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="mt-3">Daily Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Complete today&apos;s thinking and action tasks</p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>1 of 3 completed</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-secondary" />
            </div>
            <div className="font-display text-3xl font-bold mb-1">7</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="font-display text-3xl font-bold mb-1">23</div>
            <p className="text-sm text-muted-foreground">Challenges Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
              <FlaskConical className="w-6 h-6 text-teal-600" />
            </div>
            <div className="font-display text-3xl font-bold mb-1">12</div>
            <p className="text-sm text-muted-foreground">Decisions Analyzed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/mentor">Ask AI Mentor</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/decision-lab">New Decision</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/challenges">View Challenges</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">Update Goals</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
