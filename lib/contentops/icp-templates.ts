// ContentOps Engine — ICP prompt templates

import type { ICPTag } from './types';

export interface ICPTemplate {
  tag: ICPTag;
  label: string;
  targetReader: string;
  painPoints: string[];
  languagePatterns: string[];
  writingInstructions: string;
}

const ICP_1_TEMPLATE: ICPTemplate = {
  tag: 'ICP-1',
  label: 'Convention & Conference Planners',
  targetReader:
    'Convention and conference planners — typically PCMA, MPI, or ASAE members who plan 5 to 50 events per year. They manage multi-day programs with hundreds to thousands of attendees and answer to boards, sponsors, and stakeholders who expect professional documentation.',
  painPoints: [
    'Justifying event spend to boards and sponsors with tangible deliverables',
    'Coordinating photography logistics across multi-track, multi-day programs',
    'Getting post-event content fast enough to maintain attendee engagement',
    'Finding a photographer who understands the flow of conferences without disrupting sessions',
    'Ensuring consistent quality across breakout sessions, keynotes, and networking events',
  ],
  languagePatterns: [
    'ROI on event spend',
    'stakeholder deliverables',
    'attendee engagement',
    'post-event marketing assets',
    'multi-track coverage',
    'session documentation',
    'sponsor visibility',
    'year-over-year comparison',
  ],
  writingInstructions:
    'Write with authority on large-scale event logistics. Reference specific conference challenges like multi-room coverage, sponsor documentation requirements, and post-event content turnaround. Use data-driven language that appeals to planners who must justify budgets. Emphasize reliability, scalability, and the photographer-as-partner model rather than vendor relationship.',
};

const ICP_2_TEMPLATE: ICPTemplate = {
  tag: 'ICP-2',
  label: 'Enterprise Marketing/Training/Ops Leaders',
  targetReader:
    'Enterprise marketing directors, training managers, and operations leaders at mid-to-large companies. They own the event budget, manage internal and external events, and are accountable to C-suite executives for brand consistency and content output.',
  painPoints: [
    'Maintaining brand consistency across all event photography and video',
    'Getting enough content from a single event to fuel weeks of marketing',
    'Coordinating photography with internal comms, social media, and PR teams',
    'Proving event marketing ROI to executive leadership',
    'Managing multiple vendor relationships for a single event',
  ],
  languagePatterns: [
    'brand guidelines',
    'content repurposing',
    'executive visibility',
    'internal communications',
    'employer branding',
    'content calendar',
    'marketing pipeline',
    'event-to-content ratio',
  ],
  writingInstructions:
    'Write to marketing professionals who think in campaigns, not single events. Emphasize content volume, repurposing potential, and brand alignment. Reference the challenge of satisfying multiple internal stakeholders. Position event photography as a content generation engine, not a line item. Use business metrics and marketing KPIs naturally.',
};

const ICP_3_TEMPLATE: ICPTemplate = {
  tag: 'ICP-3',
  label: 'Trade Show Exhibitors & Agencies',
  targetReader:
    'Trade show exhibitors, exhibit house managers, and experiential marketing agencies. They invest heavily in booth presence and need photography and video content for post-show marketing, lead nurture campaigns, and proving exhibit ROI to clients or leadership.',
  painPoints: [
    'Capturing booth traffic and engagement for post-show reports',
    'Getting professional content that makes a 10x10 booth look compelling',
    'Documenting product demos and live presentations on the show floor',
    'Turnaround speed — needing same-day social content from the show floor',
    'Coordinating photography around show schedules and booth staff availability',
  ],
  languagePatterns: [
    'booth traffic',
    'lead capture',
    'show floor coverage',
    'exhibit ROI',
    'post-show marketing',
    'product launch documentation',
    'experiential marketing',
    'same-day delivery',
  ],
  writingInstructions:
    'Write with trade show fluency — reference show floors, exhibit halls, booth design, and the fast pace of live events. Emphasize speed, adaptability, and the ability to make exhibits look their best on camera. Address the specific challenge of noisy, crowded environments. Position photography as a post-show marketing multiplier.',
};

const ICP_4_TEMPLATE: ICPTemplate = {
  tag: 'ICP-4',
  label: 'Nashville Venue & DMO Partners',
  targetReader:
    'Nashville venue managers, sales directors, convention and visitors bureau (CVB) staff, and destination marketing organization (DMO) partners. They are on the venue side, needing reliable photography vendor relationships to offer clients and to document their own spaces.',
  painPoints: [
    'Recommending a reliable photography vendor to clients booking their venue',
    'Getting updated venue photography that shows spaces in the best light',
    'Documenting diverse event setups to show venue versatility',
    'Maintaining a library of professional images for sales and marketing',
    'Coordinating with event planners who bring their own vendors',
  ],
  languagePatterns: [
    'preferred vendor',
    'venue marketing',
    'space versatility',
    'client recommendation',
    'venue portfolio',
    'event setup documentation',
    'destination marketing',
    'Nashville hospitality',
  ],
  writingInstructions:
    'Write with deep Nashville knowledge and venue industry understanding. Reference specific Nashville venues and the city\'s event ecosystem. Emphasize the value of a trusted, local photography partner who knows the venues intimately. Address the venue-side perspective of making spaces look exceptional and supporting client events seamlessly.',
};

const ICP_TEMPLATES: Record<ICPTag, ICPTemplate> = {
  'ICP-1': ICP_1_TEMPLATE,
  'ICP-2': ICP_2_TEMPLATE,
  'ICP-3': ICP_3_TEMPLATE,
  'ICP-4': ICP_4_TEMPLATE,
};

export function getICPTemplate(tag: ICPTag): ICPTemplate {
  return ICP_TEMPLATES[tag];
}

export function getICPPromptBlock(tag: ICPTag): string {
  const t = ICP_TEMPLATES[tag];
  return [
    `## Target Reader: ${t.label}`,
    '',
    t.targetReader,
    '',
    '### Pain Points',
    ...t.painPoints.map((p) => `- ${p}`),
    '',
    '### Language Patterns (use naturally)',
    ...t.languagePatterns.map((p) => `- "${p}"`),
    '',
    '### Writing Instructions',
    t.writingInstructions,
  ].join('\n');
}
