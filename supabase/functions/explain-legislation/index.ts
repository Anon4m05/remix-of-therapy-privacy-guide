import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert in Ontario privacy legislation (PHIPA, FIPPA, M/FIPPA) with a focus on therapeutic jurisprudence and healthcare contexts.

Your task is to explain legislation sections in plain, accessible language while maintaining legal accuracy.

EXPLANATION REQUIREMENTS:
1. Explain the section in simple, everyday language
2. Provide real-world healthcare examples that illustrate how the section applies
3. Explain the therapeutic implications (how this affects patient care, trust, therapeutic relationships)
4. Identify practical considerations for implementation
5. Note any connections to other relevant sections

PRINCIPLES:
- Use plain language, not legal jargon
- Provide concrete, relatable examples
- Explain the "why" behind the law (therapeutic rationale)
- Acknowledge practical challenges
- Empower informed decision-making
- Be accurate and cite specific section numbers

OUTPUT FORMAT (JSON):
{
  "plainLanguageExplanation": "2-3 sentence explanation in everyday language",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "realWorldExamples": [
    "Example 1: [specific scenario]",
    "Example 2: [specific scenario]"
  ],
  "therapeuticImplications": "How this section affects therapeutic relationships and patient care",
  "practicalConsiderations": [
    "Consideration 1",
    "Consideration 2"
  ],
  "relatedSections": ["Section X", "Section Y"]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { legislationTitle, sectionNumber, sectionTitle, sectionContent } = await req.json();

    if (!legislationTitle || !sectionNumber || !sectionContent) {
      throw new Error('Missing required parameters');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const userPrompt = `Explain this section from ${legislationTitle}:

SECTION ${sectionNumber}${sectionTitle ? `: ${sectionTitle}` : ''}

CONTENT:
${sectionContent}

Provide a comprehensive explanation in the JSON format specified in the system prompt.`;

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
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const explanationJson = data.choices[0].message.content;

    let explanation;
    try {
      const jsonMatch = explanationJson.match(/```json\n([\s\S]*?)\n```/) || explanationJson.match(/```\n([\s\S]*?)\n```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : explanationJson;
      explanation = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', explanationJson);
      throw new Error('Failed to parse AI explanation');
    }

    return new Response(
      JSON.stringify(explanation),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in explain-legislation:', error);
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
