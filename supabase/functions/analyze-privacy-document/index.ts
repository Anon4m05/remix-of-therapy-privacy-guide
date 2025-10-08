import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert in healthcare privacy law and patient rights, specializing in Ontario's PHIPA (Personal Health Information Protection Act).

COMPREHENSIVE IPC KNOWLEDGE BASE:
You have access to thousands of IPC Ontario decisions with case summaries, legislation references, and outcomes:
- Real cases demonstrating how privacy rights are enforced in practice
- Examples of consent issues, access requests, privacy breaches, and institutional compliance
- Precedents showing both good and problematic privacy practices
- Reference relevant IPC decisions by citation to support document analysis

Your task is to analyze healthcare documents (consent forms, privacy notices, etc.) and explain their privacy implications in plain language, informed by real case precedents.

ANALYSIS REQUIREMENTS:
1. Summarize what the document is and its purpose
2. Identify key privacy implications (what information can be shared, with whom, for what purposes)
3. Explain important terms in simple language
4. Provide recommendations for patients about what to consider
5. Cite relevant PHIPA sections where applicable

PRINCIPLES:
- Use plain language, not legal jargon
- Validate concerns and empower informed decision-making
- Explain both patient rights AND legitimate institutional needs
- Acknowledge when documents are standard practice vs. concerning
- Encourage patients to ask questions and advocate for themselves

OUTPUT FORMAT (JSON):
{
  "summary": "2-3 sentence summary of what this document is",
  "privacyImplications": [
    "Specific implication 1",
    "Specific implication 2"
  ],
  "keyTerms": [
    "Term name: Plain language explanation",
    "Another term: What it means for you"
  ],
  "recommendations": [
    "Specific action or consideration",
    "Another recommendation"
  ],
  "legalReferences": ["PHIPA s.X", "Relevant legislation"]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileType, fileData } = await req.json();

    if (!fileName || !fileType || !fileData) {
      throw new Error('Missing file data');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Decode base64 to get text content
    // Note: This is a simplified approach - in production you'd want proper PDF/Word parsing
    let textContent;
    try {
      textContent = atob(fileData);
      // If it's not readable text, we'll get garbage - handle that
      if (!/[\x20-\x7E\s]/.test(textContent.substring(0, 100))) {
        throw new Error('Binary file detected');
      }
    } catch {
      // For binary files (PDF, DOCX), we'd need additional processing
      // For now, provide a helpful error message
      throw new Error('This file type requires additional processing. Please upload a text file or contact support for help with PDF/Word documents.');
    }

    const userPrompt = `Analyze this healthcare document for privacy implications:

FILE NAME: ${fileName}
FILE TYPE: ${fileType}

DOCUMENT CONTENT:
${textContent.substring(0, 4000)} ${textContent.length > 4000 ? '...(truncated)' : ''}

Provide a comprehensive privacy analysis in the JSON format specified in the system prompt.`;

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
    const analysisJson = data.choices[0].message.content;

    // Parse the analysis
    let analysis;
    try {
      const jsonMatch = analysisJson.match(/```json\n([\s\S]*?)\n```/) || analysisJson.match(/```\n([\s\S]*?)\n```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : analysisJson;
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisJson);
      throw new Error('Failed to parse AI analysis');
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-privacy-document:', error);
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
