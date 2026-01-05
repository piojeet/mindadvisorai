"use client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Check, CreditCard, Loader2, LogOut, Target, User } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const AVAILABLE_GOALS = [
  "Career",
  "Money",
  "Focus",
  "Confidence",
  "Mental Clarity",
  "Relationships",
  "Health",
];
export default function ProfileHome() {
  const { toast } = useToast();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { profile, isLoading, error, updateProfile } = useProfile();
  
  const [name, setName] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  // Populate form with profile data when profile changes
  useEffect(() => {
    if (!profile) return;

    // Defer state sync to a microtask to avoid synchronous setState in the effect body.
    queueMicrotask(() => {
      setName(profile.name || "");
      setGoals(profile.goals || []);
    });
  }, [profile]);

  // Calculate trial days remaining
  const getTrialDaysRemaining = () => {
    if (!profile?.trial_ends_at) return 0;
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ name });
    setIsSaving(false);

    if (error) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
      return;
    }

    toast({ 
      title: "Profile Updated", 
      description: "Your changes have been saved." 
    });
  };

  const handleSaveGoals = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ goals });
    setIsSaving(false);

    if (error) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
      return;
    }

    setIsEditingGoals(false);
    toast({ 
      title: "Goals Updated", 
      description: "Your growth goals have been saved." 
    });
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been signed out.",
    });
    router.push("/login");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : ((error as { message?: string } | null | undefined)?.message ?? "Unknown error");

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold">Profile & Settings</h1>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load profile: {errorMessage}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trialDays = getTrialDaysRemaining();
  const isPro = profile?.plan === "pro";
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Profile & Settings</h1>

      {/* Account Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              value={profile?.email || user?.email || ""} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Goals Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" /> Goals
          </CardTitle>
          <CardDescription>Your growth focus areas</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditingGoals ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      goals.includes(goal)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {goals.includes(goal) && <Check className="w-3 h-3 inline mr-1" />}
                    {goal}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveGoals} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Goals"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setGoals(profile?.goals || []);
                    setIsEditingGoals(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {goals.length > 0 ? (
                  goals.map((g) => (
                    <span 
                      key={g} 
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {g}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No goals set yet</p>
                )}
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsEditingGoals(true)}
              >
                Edit Goals
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">
                {isPro ? (
                  <span className="text-primary">Pro Plan</span>
                ) : (
                  <span>Free Trial</span>
                )}
              </p>
              {!isPro && trialDays > 0 && (
                <p className="text-sm text-muted-foreground">
                  {trialDays} days remaining
                </p>
              )}
              {!isPro && trialDays === 0 && (
                <p className="text-sm text-destructive">
                  Trial expired
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{profile?.credits || 0}</p>
              <p className="text-xs text-muted-foreground">Credits</p>
            </div>
          </div>
          {!isPro && (
            <Button variant="hero" className="w-full">
              Upgrade to Pro
            </Button>
          )}
          {isPro && (
            <p className="text-sm text-muted-foreground">
              Thank you for being a Pro member!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        variant="outline" 
        className="w-full text-destructive hover:text-destructive" 
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" /> Log Out
      </Button>
    </div>
  )
}
