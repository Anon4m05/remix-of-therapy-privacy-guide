import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert in therapeutic privacy law and healthcare ethics, specializing in Ontario's PHIPA (Personal Health Information Protection Act).

COMPREHENSIVE IPC KNOWLEDGE BASE:
You have access to thousands of IPC Ontario decisions spanning PHIPA, FIPPA, MFIPPA, and CYFSA with:
- Case summaries, related legislation, citations, and outcomes
- Real precedents showing how privacy law is applied across healthcare, government, and municipal contexts
- Examples of both therapeutic and anti-therapeutic applications of privacy provisions
- Reference specific decisions by citation when they illustrate decision tree pathways

Your task is to generate a decision tree that helps users navigate privacy scenarios with therapeutic insight, legal accuracy, and grounding in real cases.

CRITICAL REQUIREMENTS:
1. Generate 5-8 questions in a decision tree structure
2. Each question must have 2-3 clear options
3. Cite SPECIFIC PHIPA sections (e.g., "PHIPA s.29(1)", "PHIPA s.37(2)")
4. End with therapeutic recommendations that consider both legal compliance AND therapeutic effects
5. Balance legal requirements with relational ethics and patient-centered care
6. Consider the "weight of silence" - what remains unsaid can be as harmful as breaches

THERAPEUTIC JURISPRUDENCE PRINCIPLES:
- Privacy law as therapeutic agent, not just compliance
- Consider psychological wellbeing and dignity
- Balance therapeutic effects vs. anti-therapeutic effects
- Honor relational autonomy (autonomy within relationships)
- Recognize privacy affects trust and therapeutic alliance

OUTPUT FORMAT (JSON):
{
  "id": "unique-tree-id",
  "title": "Scenario Title",
  "description": "Brief description",
  "estimatedTime": "5-7 minutes",
  "questionCount": 6,
  "nodes": [
    {
      "id": "node-1",
      "type": "question",
      "question": "Clear decision-specific question?",
      "options": [
        {
          "id": "opt-1-1",
          "text": "Option text",
          "nextNode": "node-2"
        }
      ]
    },
    {
      "id": "terminal-1",
      "type": "recommendation",
      "title": "Clear Recommendation Title",
      "content": "Detailed guidance with therapeutic considerations. Include:\n\n**Steps to take:**\n1. Specific action\n2. Documentation requirements\n\n**Therapeutic Consideration:**\nHow this decision affects therapeutic relationship, trust, dignity.",
      "legalReferences": ["PHIPA s.29(1)", "Health Care Consent Act s.4"]
    }
  ]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenario, scenarioType, setting, urgency, role } = await req.json();

    if (!scenario || !scenarioType || !setting || !urgency || !role) {
      throw new Error('Missing required fields');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const userPrompt = `Generate a decision tree for the following privacy scenario:

ROLE: ${role}
SCENARIO TYPE: ${scenarioType}
SETTING: ${setting}
URGENCY: ${urgency}

SCENARIO DESCRIPTION:
${scenario}

Generate a complete decision tree with 5-8 questions that:
1. Navigates this specific scenario therapeutically and legally
2. Cites exact PHIPA sections
3. Provides therapeutic considerations at each recommendation
4. Considers the urgency level and healthcare setting
5. Tailors language and complexity to the ${role} role

Return ONLY valid JSON matching the structure specified in the system prompt.`;

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const treeJson = data.choices[0].message.content;

    // Parse and validate the generated tree
    let tree;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = treeJson.match(/```json\n([\s\S]*?)\n```/) || treeJson.match(/```\n([\s\S]*?)\n```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : treeJson;
      tree = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', treeJson);
      throw new Error('Failed to parse AI-generated decision tree');
    }

    // Add metadata
    tree.id = `ai-${Date.now()}`;
    tree.role = role;
    tree.available = true;
    tree.generatedAt = new Date().toISOString();
    tree.scenarioDetails = {
      type: scenarioType,
      setting,
      urgency
    };

    return new Response(
      JSON.stringify(tree),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-decision-tree:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
