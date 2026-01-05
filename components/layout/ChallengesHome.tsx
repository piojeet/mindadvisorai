"use client"
import { Brain, CheckCircle2, ChevronRight, Flame, MessageSquare, Target, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
    id: string;
    type: "thinking" | "action" | "reflection";
    title: string;
    description: string;
    xp: number;
    completed: boolean;
  }
export default function ChallengesHome() {

    const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      type: "thinking",
      title: "Decision Audit",
      description: "Think of one decision you made yesterday. What information did you use? What did you ignore?",
      xp: 15,
      completed: true,
    },
    {
      id: "2",
      type: "action",
      title: "Focus Block",
      description: "Work on your most important task for 25 minutes without any distractions. Put your phone in another room.",
      xp: 25,
      completed: false,
    },
    {
      id: "3",
      type: "reflection",
      title: "Daily Insight",
      description: "What's one thing you learned about yourself today? Write at least 50 words.",
      xp: 20,
      completed: false,
    },
  ]);

  const [reflectionText, setReflectionText] = useState("");
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const getTypeIcon = (type: Challenge["type"]) => {
    switch (type) {
      case "thinking":
        return Brain;
      case "action":
        return Zap;
      case "reflection":
        return MessageSquare;
    }
  };

  const getTypeColor = (type: Challenge["type"]) => {
    switch (type) {
      case "thinking":
        return "text-primary bg-primary/10";
      case "action":
        return "text-secondary bg-secondary/10";
      case "reflection":
        return "text-teal-600 bg-teal-100";
    }
  };

  const handleComplete = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: true } : c))
    );
    const challenge = challenges.find((c) => c.id === id);
    toast({
      title: "Challenge Completed! 🎉",
      description: `You earned ${challenge?.xp} XP!`,
    });
    setActiveChallenge(null);
    setReflectionText("");
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.filter((c) => c.completed).reduce((acc, c) => acc + c.xp, 0);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Daily Challenges</h1>
          <p className="text-sm text-muted-foreground">Build mental muscles with daily practice</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold">{completedCount}/{challenges.length}</div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold">{totalXP} XP</div>
              <p className="text-sm text-muted-foreground">Earned Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold">7 Days</div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Today&apos;s Challenges</h2>
        
        {challenges.map((challenge) => {
          const Icon = getTypeIcon(challenge.type);
          const isActive = activeChallenge === challenge.id;
          
          return (
            <Card 
              key={challenge.id}
              className={cn(
                "transition-all duration-300",
                challenge.completed && "opacity-60",
                isActive && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    getTypeColor(challenge.type)
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-semibold text-lg">{challenge.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium capitalize">
                        {challenge.type}
                      </span>
                      <span className="text-sm text-secondary font-medium">+{challenge.xp} XP</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{challenge.description}</p>

                    {/* Action Area */}
                    {!challenge.completed && (
                      <>
                        {challenge.type === "reflection" && isActive && (
                          <div className="mb-4">
                            <Textarea
                              placeholder="Write your reflection here..."
                              value={reflectionText}
                              onChange={(e) => setReflectionText(e.target.value)}
                              rows={4}
                              className="mb-2"
                            />
                            <p className="text-xs text-muted-foreground">
                              {reflectionText.split(/\s+/).filter(Boolean).length} / 50 words
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <>
                              <Button 
                                variant="hero" 
                                onClick={() => handleComplete(challenge.id)}
                                disabled={challenge.type === "reflection" && reflectionText.split(/\s+/).filter(Boolean).length < 50}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark Complete
                              </Button>
                              <Button variant="outline" onClick={() => setActiveChallenge(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              onClick={() => setActiveChallenge(challenge.id)}
                            >
                              Start Challenge
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </>
                    )}

                    {challenge.completed && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* All Completed */}
      {completedCount === challenges.length && (
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">All Challenges Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Amazing work! You&apos;ve completed all your challenges for today. Come back tomorrow for new ones.
            </p>
            <div className="flex items-center justify-center gap-2 text-secondary">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">+{totalXP} XP earned today</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
