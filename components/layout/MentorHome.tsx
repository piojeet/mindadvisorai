"use client";
import { AlertCircle, Coins, Send, Sparkles, User } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function MentorHome() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Mentor. I'm here to help you think through real-life problems — career decisions, money choices, focus issues, or anything else on your mind.\n\nWhat's on your mind today? Share what you're working through, and I'll help you break it down and find clarity.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();

  const credits = profile?.credits ?? 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (credits < 2) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 2 credits to send a message. Please purchase more credits.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Build conversation history for context
    const conversationHistory = messages
      .filter((m) => m.id !== "1") // Skip initial welcome message
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    conversationHistory.push({ role: "user", content: userMessage.content });

    let assistantContent = "";

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CHAT_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add empty assistant message to update
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Deduct credits after successful response
      if (profile) {
        await updateProfile({ ...profile, credits: Math.max(0, credits - 2) });
      }
    } catch (error) {
      console.error("AI Mentor error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.content !== "" || m.role !== "assistant"));
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-sm text-muted-foreground">Get personalized guidance for real-life problems</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
          <Coins className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">{credits} credits left</span>
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
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                if (e.key === "Enter" && !e.shiftKey) {
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
