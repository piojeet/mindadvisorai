"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  DollarSign,
  Focus,
  Globe,
  HeartHandshake,
  Sparkles,
  Target,
} from "lucide-react";

type Goal = "career" | "money" | "focus" | "confidence" | "clarity";
type Availability = "5" | "10" | "15";
type Language = "english" | "hindi" | "hinglish";

export default function Onboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshProfile } = useProfile();

  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const goals: {
    id: Goal;
    label: string;
    icon: React.ElementType;
    description: string;
  }[] = [
    { id: "career", label: "Career Growth", icon: Briefcase, description: "Advance professionally" },
    { id: "money", label: "Financial Wisdom", icon: DollarSign, description: "Better money decisions" },
    { id: "focus", label: "Deep Focus", icon: Focus, description: "Eliminate distractions" },
    { id: "confidence", label: "Confidence", icon: HeartHandshake, description: "Trust yourself more" },
    { id: "clarity", label: "Mental Clarity", icon: Sparkles, description: "Think more clearly" },
  ];

  const handleGoalToggle = (goal: Goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedGoals.length === 0) {
      toast({
        title: "Select at least one goal",
        description: "Choose what you want to work on.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !availability) {
      toast({
        title: "Select your availability",
        description: "How much time can you dedicate daily?",
        variant: "destructive",
      });
      return;
    }

    if (step < 3) setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!language) {
      toast({
        title: "Select your language",
        description: "Choose your preferred language.",
        variant: "destructive",
      });
      return;
    }
  
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const profileGoals = selectedGoals.map((goal) => {
        const goalMap: Record<Goal, string> = {
          career: "Career",
          money: "Money",
          focus: "Focus",
          confidence: "Confidence",
          clarity: "Mental Clarity",
        };
        return goalMap[goal];
      });
  
      const { error } = await supabase
        .from("profiles")
        .update({
          goals: profileGoals,
          onboarding_completed: true,
          plan: "free",
          credits: 20,
          trial_ends_at: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
  
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
  
      await refreshProfile();
  
      toast({
        title: "Profile Created! 🎉",
        description: "Your personalized growth journey begins now.",
      });
  
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Image src="/logo.svg" alt="MindAdvisor" width={100} height={100} />

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "w-10 h-2 rounded-full transition-all duration-300",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-3">
                  What do you want to achieve?
                </h1>
                <p className="text-muted-foreground">
                  Select all the areas you want to grow in
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);

                  return (
                    <Card
                      key={goal.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "hover:border-primary/30 hover:bg-muted/50"
                      )}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <CardContent className="p-5 flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{goal.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Button variant="hero" size="lg" onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-3">
                  How much time can you give daily?
                </h1>
                <p className="text-muted-foreground">
                  We’ll customize your experience
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { value: "5" as Availability, label: "5 minutes", desc: "Quick & focused" },
                  { value: "10" as Availability, label: "10 minutes", desc: "Balanced growth" },
                  { value: "15" as Availability, label: "15+ minutes", desc: "Deep transformation" },
                ].map((option) => (
                  <Card
                    key={option.value}
                    className={cn(
                      "cursor-pointer transition-all duration-300",
                      availability === option.value
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "hover:border-primary/30 hover:bg-muted/50"
                    )}
                    onClick={() => setAvailability(option.value)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="font-display text-3xl font-bold text-primary mb-2">
                        {option.label}
                      </div>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="hero" size="lg" onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-3">
                  Choose your language
                </h1>
                <p className="text-muted-foreground">
                  Your AI mentor will communicate in this language
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { value: "english" as Language, label: "English", native: "English" },
                  { value: "hindi" as Language, label: "हिंदी", native: "Hindi" },
                  { value: "hinglish" as Language, label: "Hinglish", native: "Mix of both" },
                ].map((option) => (
                  <Card
                    key={option.value}
                    className={cn(
                      "cursor-pointer transition-all duration-300",
                      language === option.value
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "hover:border-primary/30 hover:bg-muted/50"
                    )}
                    onClick={() => setLanguage(option.value)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="font-display text-2xl font-bold mb-1">
                        {option.label}
                      </div>
                      <p className="text-sm text-muted-foreground">{option.native}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Complete Setup <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
