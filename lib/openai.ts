import OpenAI from 'openai';

// Lazy initialization to avoid runtime errors when env vars aren't loaded yet
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface AIEditRequest {
  currentContent: string;
  instruction: string;
  contentType: 'heading' | 'paragraph' | 'tagline' | 'cta' | 'feature' | 'testimonial';
  context?: string; // Additional context about the section/page
}

export interface AIEditResponse {
  newContent: string;
  explanation?: string;
}

const SYSTEM_PROMPT = `You are an expert copywriter for JHR Photography, a premium corporate headshot and event photography business in Nashville.

Your writing style:
- Professional yet approachable
- Focused on business value and ROI
- Confident without being pushy
- Clear and concise
- Uses power words that convey trust, expertise, and results

Brand voice guidelines:
- Emphasize the transformation photography provides
- Focus on client outcomes, not technical details
- Use "you" language to speak directly to the reader
- Maintain a premium, high-end feel
- Include subtle urgency when appropriate

When editing content, maintain the original intent while improving:
- Clarity and impact
- Emotional resonance
- Call-to-action effectiveness
- SEO relevance (naturally include relevant keywords)

Always respond with ONLY the new content text, no explanations or quotes unless specifically asked.`;

export async function generateAIEdit(request: AIEditRequest): Promise<AIEditResponse> {
  const userPrompt = buildUserPrompt(request);
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const newContent = completion.choices[0]?.message?.content?.trim() || request.currentContent;

  return {
    newContent,
  };
}

function buildUserPrompt(request: AIEditRequest): string {
  let prompt = `Content type: ${request.contentType}\n`;
  prompt += `Current content: "${request.currentContent}"\n`;
  prompt += `Instruction: ${request.instruction}\n`;

  if (request.context) {
    prompt += `Additional context: ${request.context}\n`;
  }

  prompt += `\nProvide the improved version of this content based on the instruction. Return ONLY the new text, nothing else.`;

  return prompt;
}

// Quick action presets
export const AI_QUICK_ACTIONS = {
  makeShorter: 'Make this more concise while keeping the core message',
  makeLonger: 'Expand this with more detail and persuasive elements',
  moreCompelling: 'Make this more compelling and action-oriented',
  moreProfessional: 'Make this sound more professional and authoritative',
  addUrgency: 'Add subtle urgency to encourage action',
  simplify: 'Simplify this for easier reading',
  seoOptimize: 'Optimize this for search engines while keeping it natural',
  addEmotionalAppeal: 'Add emotional appeal to connect with the reader',
} as const;

export type AIQuickAction = keyof typeof AI_QUICK_ACTIONS;
