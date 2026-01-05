import { Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function CommunityHome() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
    <h1 className="font-display text-2xl font-bold mb-2">Community</h1>
    <p className="text-muted-foreground mb-8">Connect with like-minded thinkers anonymously</p>
    
    <Card className="text-center py-16">
      <CardContent>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Anonymous topic-based discussions are being built. Join thousands of thinkers sharing insights without the social noise.
        </p>
      </CardContent>
    </Card>
  </div>
  )
}
