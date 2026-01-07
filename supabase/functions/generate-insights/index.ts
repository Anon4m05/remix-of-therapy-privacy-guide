import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert in Ontario healthcare privacy law, therapeutic jurisprudence, and the Information and Privacy Commissioner (IPC) of Ontario's decisions. Your role is to generate educational insights about privacy in healthcare settings.

You have deep knowledge of:

**IPC DECISIONS - Key Patterns:**
- PHIPA Decision 298: $12,500 in AMPs for physician using hospital EHR to target newborn parents for private clinic marketing - abuse of legitimate access
- PHIPA Decision 290: Nurse viewed patient charts without authorization; lockbox requests triggered investigation
- PHIPA Decision 287: EMR prescription messaging system inadvertently disclosed PHI to users with elevated privileges
- PHIPA Decision 281: Sunnybrook Foundation fundraising - hospital's use of PHI for fundraising via foundation as agent
- PHIPA Decision 296: Missing medical records after physician retirement - duty to maintain records
- Access request patterns: 30-day response requirements, deemed refusals under s.54(7)
- Correction request patterns: s.55(9)(b) exception for professional opinions made in good faith
- Administrative Monetary Penalties (AMPs) for serious contraventions

**PHIPA KEY PROVISIONS:**
- Section 12: Reasonable steps to protect PHI from unauthorized access, use, disclosure
- Section 17: Lock-box (consent directives) allowing patients to restrict access
- Section 29: Consent requirements and exceptions
- Section 37-38: Permitted uses and disclosures
- Section 52-54: Access rights and timelines
- Section 55: Correction rights
- Section 58, 61: Enforcement and AMPs
- Circle of care concept: sharing within healthcare team for direct care

**FIPPA/MFIPPA Connections:**
- Public sector institutions subject to FIPPA
- Municipalities and local boards under MFIPPA
- Interplay when healthcare delivered by government bodies

**THERAPEUTIC JURISPRUDENCE PRINCIPLES:**
- Privacy law as therapeutic agent that can heal or harm
- Anti-therapeutic effects of privacy misapplication
- Relational autonomy - respecting patient control within relational context
- Informational asymmetry and trust erosion
- Strategic omission - what remains unsaid can harm as much as breaches
- Capacity as decision-specific, not blanket determination
- Transparency-accountability relationship

Generate insights that are:
1. Specific and actionable - cite real provisions and decision patterns
2. Therapeutically framed - connect legal requirements to patient wellbeing
3. Varied in format - facts, tips, case lessons, legal insights
4. Grounded in Ontario law - PHIPA, FIPPA, MFIPPA as appropriate
5. Clinically relevant - connect to real healthcare scenarios`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const categoryPrompts = {
      did_you_know: "Generate a surprising 'Did You Know?' fact about Ontario healthcare privacy law. Include a specific legal reference, IPC decision pattern, or therapeutic jurisprudence insight. Make it memorable and educational. 1-2 sentences maximum.",
      privacy_tip: "Generate a practical 'Privacy Tip' for healthcare providers navigating PHIPA. Focus on actionable guidance that balances legal compliance with therapeutic outcomes. Reference specific sections or principles. 1-2 sentences maximum.",
      quick_insight: "Generate a 'Quick Insight' connecting privacy law to therapeutic outcomes. Draw on therapeutic jurisprudence principles, relational autonomy, or IPC decision patterns. Make it thought-provoking. 1-2 sentences maximum."
    };

    const userPrompt = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.did_you_know;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_insight",
              description: "Generate a privacy insight with optional source citation",
              parameters: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description: "The insight content (1-2 sentences)"
                  },
                  source: {
                    type: "string",
                    description: "Optional source type: 'IPC Decision', 'PHIPA', 'FIPPA', 'MFIPPA', 'Therapeutic Jurisprudence', or null"
                  },
                  citation: {
                    type: "string",
                    description: "Optional specific citation (e.g., 'PHIPA s.12', 'Decision 298', 'HR24-00321')"
                  }
                },
                required: ["content"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_insight" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    // Extract the tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const insight = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify({
      category,
      content: insight.content,
      source: insight.source || null,
      citation: insight.citation || null,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating insight:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
