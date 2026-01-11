"use client"
import { Coins, CreditCard } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRazorpay } from "@/hooks/useRazorpay";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreditPacks() {
    const { user } = useAuth();
    const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();
    const { profile, refreshProfile } = useProfile();
    const { toast } = useToast();
    const router = useRouter();

    const handleBuyCredits = (credits: number, amount: number) => {
        if (!user) {
          router.push("/signup");
          return;
        }
    
        initiatePayment({
          amount,
          planType: "credits",
          credits,
          userId: user.id,
          userEmail: user.email || undefined,
          userName: profile?.name || undefined,
          onSuccess: () => {
            refreshProfile();
            toast({
              title: "Credits Added!",
              description: `${credits} credits have been added to your account.`,
            });
          },
          onError: (error) => {
            toast({
              title: "Payment Failed",
              description: error,
              variant: "destructive",
            });
          },
        });
      };

    const creditPacks = [
        { credits: 20, price: 99, label: "Starter Pack" },
        { credits: 50, price: 199, label: "Growth Pack" },
        { credits: 150, price: 499, label: "Power Pack" },
      ];

  return (
    // {/* Credit Packs */}
    <section className="py-20 px-6">
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold mb-4">
          Need Extra Credits?
        </h2>
        <p className="text-muted-foreground">
          Purchase credit packs anytime for more AI Mentor conversations
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {creditPacks.map((pack, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{pack.label}</h3>
              <p className="text-3xl font-bold text-primary mb-1">{pack.credits}</p>
              <p className="text-sm text-muted-foreground mb-4">credits</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleBuyCredits(pack.credits, pack.price)}
                disabled={isPaymentLoading || !user}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                ₹{pack.price}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {!user && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/signup" className="text-primary hover:underline">Sign up</Link> to purchase credit packs
        </p>
      )}
    </div>
  </section>
  )
}
