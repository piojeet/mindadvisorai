import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, riskLevel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert decision analyst. Analyze the user's decision and provide a structured analysis.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "outcomes": {
    "positive": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
    "negative": ["risk 1", "risk 2", "risk 3", "risk 4"]
  },
  "regretProbability": 35,
  "recommendation": "A clear, actionable recommendation of 2-3 sentences.",
  "keyQuestions": ["question 1 to consider", "question 2 to consider", "question 3 to consider"]
}

Guidelines:
- positive: 4 specific potential benefits tailored to this decision
- negative: 4 specific potential risks or downsides tailored to this decision
- regretProbability: A number 0-100 based on the risk level and decision complexity
- recommendation: Practical, specific advice for this exact situation
- keyQuestions: 3 questions the user should ask themselves before deciding`;

    const userMessage = `Analyze this decision:

Decision: ${title}
${description ? `Context: ${description}` : ""}
Risk Level: ${riskLevel}

Provide a comprehensive analysis with potential outcomes, regret probability, and a recommendation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let analysis;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis");
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Decision Lab error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
