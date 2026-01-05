"use client";
import { AlertCircle, Coins, Send, Sparkles, User } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useProfile } from "@/hooks/useProfile";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function MentorHome() {
    const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Mentor. I'm here to help you think through real-life problems — career decisions, money choices, focus issues, or anything else on your mind.\n\nWhat's on your mind today? Share what you're working through, and I'll help you break it down and find clarity.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const idRef = useRef(0);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;


    const userMessage: Message = {
        id: (++idRef.current).toString(),
        role: "user",
        content: input,
        timestamp: new Date(), // ✅ required
      };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input.trim()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    // Placeholder responses - will be replaced with actual AI
    const responses = [
      "That's a thoughtful question. Let me ask you something first: What outcome would make you feel most satisfied? Understanding your ideal outcome helps us work backwards.\n\n**Consider these angles:**\n1. What's the worst-case scenario, and can you handle it?\n2. What would you advise a friend in this situation?\n3. What's holding you back from the decision right now?",
      "I hear you. This sounds like a situation where multiple factors are pulling you in different directions. Let's break this down:\n\n**The core question seems to be:** What matters most to you right now — security or growth?\n\nBefore we go deeper, tell me: What would change in your life if you chose path A versus path B?",
      "This is exactly the kind of problem where structured thinking helps. Here's what I notice:\n\n1. **The immediate concern:** What you're feeling right now\n2. **The underlying issue:** What's really driving this situation\n3. **The path forward:** What you can actually control\n\nWhich of these would you like to explore first?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const examplePrompts = [
    "Should I switch jobs for 20% higher pay?",
    "How do I deal with imposter syndrome?",
    "I can't focus — where do I start?",
    "How to ask for a promotion?",
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">AI Mentor</h1>
          <p className="text-sm text-muted-foreground">
            Get personalized guidance for real-life problems
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
          <Coins className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">{profile?.credits || 0} credits left</span>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={cn(
                  "flex-1 max-w-[80%] rounded-2xl p-4",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                )}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Example Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              className="min-h-[60px] max-h-[150px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              className="h-[60px] w-[60px]"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Each message uses 2 credits</span>
            </div>
            <span>Press Enter to send</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
