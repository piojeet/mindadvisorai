"use client"
import { AlertTriangle, ArrowRight, CheckCircle2, Coins, FlaskConical, Plus, Scale, Sparkles, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "medium" | "high";

interface Decision {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  outcomes: {
    positive: string[];
    negative: string[];
  };
  regretProbability: number;
  recommendation: string;
}
export default function DecisionLabHome() {

    const [step, setStep] = useState<"input" | "analysis">("input");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);

  const handleAnalyze = () => {
    if (!title.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setDecision({
        id: Date.now().toString(),
        title,
        description,
        riskLevel,
        outcomes: {
          positive: [
            "Higher earning potential in the long term",
            "New skills and growth opportunities",
            "Better work-life balance potential",
            "Expanded professional network",
          ],
          negative: [
            "Initial learning curve and stress",
            "Loss of current job security",
            "Need to rebuild reputation",
            "Possible relocation requirements",
          ],
        },
        regretProbability: riskLevel === "low" ? 15 : riskLevel === "medium" ? 35 : 55,
        recommendation: riskLevel === "low" 
          ? "This appears to be a low-risk decision with good upside potential. Consider moving forward with proper preparation."
          : riskLevel === "medium"
          ? "This is a balanced decision. The potential gains are worth the moderate risks, but prepare a fallback plan."
          : "This is a high-risk decision. Consider starting small or testing the waters before fully committing.",
      });
      setIsAnalyzing(false);
      setStep("analysis");
    }, 2500);
  };

  const handleNewDecision = () => {
    setStep("input");
    setTitle("");
    setDescription("");
    setRiskLevel("medium");
    setDecision(null);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Decision Lab</h1>
          <p className="text-sm text-muted-foreground">Simulate outcomes before you commit</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
          <Coins className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">5 credits per analysis</span>
        </div>
      </div>

      {step === "input" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-secondary" />
                New Decision Analysis
              </CardTitle>
              <CardDescription>
                Describe your decision and we&apos;ll analyze possible outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">What decision are you facing?</Label>
                <Input
                  id="title"
                  placeholder="e.g., Should I switch jobs? Should I start a business?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Describe the situation (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Share any context that might help with the analysis..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label>How would you rate the risk level?</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "low" as RiskLevel, label: "Low Risk", desc: "Minor changes" },
                    { value: "medium" as RiskLevel, label: "Medium Risk", desc: "Significant change" },
                    { value: "high" as RiskLevel, label: "High Risk", desc: "Major life change" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRiskLevel(option.value)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        riskLevel === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="font-semibold mb-1">{option.label}</div>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleAnalyze}
                disabled={!title.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing Decision...
                  </>
                ) : (
                  <>
                    Analyze Decision
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Example Decisions */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Or try an example:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Should I switch jobs?",
                "Should I move to a new city?",
                "Should I start freelancing?",
                "Should I pursue an MBA?",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setTitle(example)}
                  className="px-4 py-2 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "analysis" && decision && (
        <div className="space-y-6 animate-slide-up">
          {/* Decision Summary */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold mb-2">{decision.title}</h2>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                    decision.riskLevel === "low" ? "bg-green-100 text-green-700" :
                    decision.riskLevel === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    <Scale className="w-3 h-3" />
                    {decision.riskLevel.charAt(0).toUpperCase() + decision.riskLevel.slice(1)} Risk
                  </div>
                </div>
                <Button variant="outline" onClick={handleNewDecision}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Decision
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outcomes Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Positive Outcomes */}
            <Card className="border-green-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  Potential Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {decision.outcomes.positive.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Negative Outcomes */}
            <Card className="border-red-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <TrendingDown className="w-5 h-5" />
                  Potential Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {decision.outcomes.negative.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Regret Probability */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Regret Probability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      decision.regretProbability < 30 ? "bg-green-500" :
                      decision.regretProbability < 50 ? "bg-amber-500" :
                      "bg-red-500"
                    )}
                    style={{ width: `${decision.regretProbability}%` }}
                  />
                </div>
                <span className="font-display font-bold text-xl w-16 text-right">
                  {decision.regretProbability}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Based on similar decisions, there&apos;s a {decision.regretProbability}% chance you might regret this decision in the future.
              </p>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">AI Recommendation</h3>
                  <p className="text-muted-foreground">{decision.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleNewDecision}>
              Analyze Another Decision
            </Button>
            <Button variant="hero" className="flex-1">
              Discuss with AI Mentor
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
