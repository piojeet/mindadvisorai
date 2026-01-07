import { Card, CardContent } from "../ui/card";

export default function Problem() {
  return (
    <section className="py-20 px-6 bg-muted/30">
        <div className="md:container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            This is NOT Just Another App
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            ChatGPT gives generic answers. Meditation apps calm you down temporarily. 
            MindForge actually helps you <strong className="text-foreground">think better and decide smarter</strong>.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">❌</div>
                <h3 className="font-semibold mb-2">Not ChatGPT</h3>
                <p className="text-sm text-muted-foreground">Generic answers don&apos;t solve real problems</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">❌</div>
                <h3 className="font-semibold mb-2">Not Meditation</h3>
                <p className="text-sm text-muted-foreground">Calming down isn&apos;t the same as thinking clearly</p>
              </CardContent>
            </Card>
            <Card className="bg-accent border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-semibold text-primary mb-2">MindForge</h3>
                <p className="text-sm text-muted-foreground">Personalized growth + decision intelligence</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}
