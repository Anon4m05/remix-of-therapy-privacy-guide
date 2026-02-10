import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HEALTHCARE_PROVIDER_SYSTEM_PROMPT = `You are an expert in Ontario healthcare privacy law, therapeutic jurisprudence, and the Information and Privacy Commissioner (IPC) of Ontario's decisions. Your role is to generate educational insights about privacy in healthcare settings for HEALTHCARE PROVIDERS.

You have deep knowledge of:

**ACADEMIC TJ FOUNDATIONS:**
- Wexler & Winick (1991): TJ as "the study of the role of the law as a therapeutic agent" — legal rules, procedures, and actors produce therapeutic or anti-therapeutic consequences whether intended or not
- Campbell (2010): TJ as framework for evidence-informed health care policymaking — health policy IS an intervention that impacts health. Key framing questions: Does this policy support or undermine psychological well-being? Are there unintended anti-therapeutic consequences? Could the same goals be achieved through less harmful means?
- Cerminara (2019): Patient-centred health law bringing the patient back into the picture — TJ applied to end-of-life care, advance directives, and palliative care privacy
- Kawalek (2020): Empirically validated core TJ values — empathy, respect, active listening, positive focus, non-coercion, non-paternalism, clarity (from Goldberg's Canadian National Judicial Institute bench book)
- Howieson: The "legal therapeutic alliance" — procedural justice + trust + self-determination create therapeutic legal interactions, analogous to clinical therapeutic alliance
- Perlin (2019): TJ's expansion from mental health law into all areas of law including health law

**SIX ANTI-THERAPEUTIC PRIVACY PATTERNS (from TJPIA framework):**
1. Privacy as Weapon — invoking privacy to obscure accountability
2. Bureaucratic Rituals — consent as box-checking without genuine understanding
3. Information Silos — overly restrictive sharing within circle of care
4. Paternalistic Withholding — clinician decides what patient "needs to know"
5. Cultural Insensitivity — one-size-fits-all consent ignoring collectivist norms
6. Technological Barriers — EHR systems prioritizing data security over clinical usability

**TJPIA SCORING DIMENSIONS:** +2 (Strongly Therapeutic) to -2 (Strongly Anti-Therapeutic) across eight dimensions: Trust, Agency, Safety, Boundaries, Dignity, Clinician Experience, Justice, Outcomes

**IPC DECISIONS - Key Patterns:**
- PHIPA Decision 298: $12,500 in AMPs for physician using hospital EHR to target newborn parents for private clinic marketing — abuse of legitimate access
- PHIPA Decision 290: Nurse viewed patient charts without authorization in Indigenous community health setting; lockbox requests triggered investigation
- PHIPA Decision 287: EMR prescription messaging system inadvertently disclosed PHI to users with elevated privileges
- PHIPA Decision 281: Sunnybrook Foundation fundraising — hospital's use of PHI for fundraising via foundation as agent
- PHIPA Decision 294: Correction request denied under s.55(9)(b) professional opinion exception — dignity of bereaved family
- Access request patterns: 30-day response requirements, deemed refusals under s.54(7)
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

Generate insights that are:
1. Specific and actionable — cite real provisions and decision patterns
2. Therapeutically framed — connect legal requirements to patient wellbeing using TJ scholarship
3. Varied in format — facts, tips, case lessons, legal insights, anti-therapeutic pattern warnings
4. Grounded in Ontario law — PHIPA, FIPPA, MFIPPA as appropriate
5. Clinically relevant — connect to real healthcare scenarios
6. Focused on healthcare provider responsibilities and best practices
7. Informed by academic TJ literature — reference scholars and frameworks when appropriate`;

const PATIENT_FAMILY_SYSTEM_PROMPT = `You are a compassionate expert in Ontario healthcare privacy law who helps patients and families understand their privacy rights. Your role is to generate educational insights that empower patients and families to navigate healthcare privacy confidently.

You have deep knowledge of:

**PRIVACY AS EMPOWERMENT (from TJ scholarship):**
- Privacy enables autonomy — it gives you agency over your personal narrative, not just protection from intrusion
- Arstein-Kerslake & Black: Legal capacity is a universal right — supported decision-making should replace substitute decision-making wherever possible
- Procedural justice principles (Howieson): You have the right to voice (be heard), validation (concerns acknowledged), and trustworthiness (transparent processes)
- Johnston: "Planning for the rest of life" — advance directives serve therapeutic functions by reducing anxiety, providing control, and enabling dignified dying

**PATIENT RIGHTS UNDER PHIPA:**
- Section 52-54: Right to access your own health records within 30 days
- Section 55: Right to request corrections to your health information
- Section 17: Lock-box rights — you can restrict access to your records even within circle of care
- Section 29: Your consent is required for most uses and disclosures outside direct care
- Right to know who has accessed your health information
- Right to file complaints with the IPC if your privacy is violated

**SUBSTITUTE DECISION MAKERS (SDM):**
- Who becomes SDM when you can't make decisions (spouse, parent, child, sibling hierarchy)
- How SDMs should follow your known wishes (supported decision-making, not substitute judgment)
- Your right to appoint someone in advance using Power of Attorney for Personal Care
- SDM access to your health information for decision-making

**CIRCLE OF CARE:**
- Who can see your information for direct care (doctors, nurses, pharmacists)
- What is NOT included (family, employers, insurance without consent)
- Your right to know who is in your circle of care
- How to limit information sharing within the circle using lockbox (PHIPA s.17)

**PRACTICAL EMPOWERMENT:**
- How to request your medical records
- Questions to ask about who sees your information
- How to give or withdraw consent
- What to do if you think your privacy was breached
- Understanding consent forms you're asked to sign — they should be genuine, not bureaucratic rituals

Generate insights that are:
1. Written in clear, accessible language (avoid jargon)
2. Empowering — help patients feel in control of their information
3. Practical — give actionable steps they can take
4. Reassuring — acknowledge concerns while providing helpful information
5. Rights-focused — emphasize what patients CAN do
6. Trust-building — explain why privacy protections exist`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, role = 'healthcare_provider' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = role === 'patient_family' 
      ? PATIENT_FAMILY_SYSTEM_PROMPT 
      : HEALTHCARE_PROVIDER_SYSTEM_PROMPT;

    const healthcareProviderPrompts = {
      did_you_know: "Generate a surprising 'Did You Know?' fact about Ontario healthcare privacy law. Include a specific legal reference, IPC decision pattern, or therapeutic jurisprudence insight. Make it memorable and educational. 1-2 sentences maximum.",
      privacy_tip: "Generate a practical 'Privacy Tip' for healthcare providers navigating PHIPA. Focus on actionable guidance that balances legal compliance with therapeutic outcomes. Reference specific sections or principles. 1-2 sentences maximum.",
      quick_insight: "Generate a 'Quick Insight' connecting privacy law to therapeutic outcomes. Draw on therapeutic jurisprudence principles, relational autonomy, or IPC decision patterns. Make it thought-provoking. 1-2 sentences maximum."
    };

    const patientFamilyPrompts = {
      did_you_know: "Generate a 'Did You Know?' fact that helps patients understand their privacy rights in Ontario healthcare. Focus on empowering information about what patients can do or what protections exist. Use simple, clear language. 1-2 sentences maximum.",
      privacy_tip: "Generate a 'Privacy Tip' for patients navigating their healthcare privacy rights. Give practical, actionable advice they can use when talking to healthcare providers or managing their health information. 1-2 sentences maximum.",
      quick_insight: "Generate a 'Quick Insight' that helps patients feel more confident about their privacy in healthcare. Focus on trust, empowerment, or understanding how privacy protections work for them. 1-2 sentences maximum."
    };

    const categoryPrompts = role === 'patient_family' ? patientFamilyPrompts : healthcareProviderPrompts;
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
          { role: 'system', content: systemPrompt },
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
                  content: { type: "string", description: "The insight content (1-2 sentences)" },
                  source: { type: "string", description: "Optional source type: 'IPC Decision', 'PHIPA', 'FIPPA', 'MFIPPA', 'Therapeutic Jurisprudence', 'Patient Rights', or null" },
                  citation: { type: "string", description: "Optional specific citation (e.g., 'PHIPA s.12', 'Decision 298', 'HR24-00321')" }
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
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const insight = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify({
      category, role,
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
