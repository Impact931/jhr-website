export interface BlogTemplate {
  id: string;
  name: string;
  description: string;
  variables: TemplateVariable[];
  body: string;
  defaultTags: string[];
  defaultCategories: string[];
  seoTitleTemplate: string;
  seoDescriptionTemplate: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

function replaceVars(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

export const blogTemplates: BlogTemplate[] = [
  {
    id: 'how-to-guide',
    name: 'How-To Guide',
    description: 'Step-by-step instructions for a specific topic.',
    variables: [
      { key: 'topic', label: 'Topic', placeholder: 'e.g., Plan a Corporate Headshot Day', required: true },
      { key: 'audience', label: 'Target Audience', placeholder: 'e.g., Event planners', required: false },
    ],
    body: `# How to {{topic}}

{{audience}} — here's everything you need to know about {{topic}}.

## What You'll Need

- Item 1
- Item 2
- Item 3

## Step 1: Getting Started

Describe the first step here.

## Step 2: Implementation

Describe the second step here.

## Step 3: Follow-Up

Describe the third step here.

## Tips for Success

- Tip 1
- Tip 2
- Tip 3

## Conclusion

Summarize the key takeaways and next steps.
`,
    defaultTags: ['how-to', 'guide'],
    defaultCategories: ['Guides'],
    seoTitleTemplate: 'How to {{topic}} | JHR Photography',
    seoDescriptionTemplate: 'Learn how to {{topic}} with this step-by-step guide from JHR Photography.',
  },
  {
    id: 'listicle',
    name: 'Listicle',
    description: 'Numbered list format for tips, ideas, or recommendations.',
    variables: [
      { key: 'count', label: 'Number of Items', placeholder: 'e.g., 10', required: true },
      { key: 'topic', label: 'Topic', placeholder: 'e.g., Corporate Event Photography Tips', required: true },
    ],
    body: `# {{count}} {{topic}}

Introduction paragraph about why {{topic}} matters.

## 1. First Item

Description of the first item.

## 2. Second Item

Description of the second item.

## 3. Third Item

Description of the third item.

## 4. Fourth Item

Description of the fourth item.

## 5. Fifth Item

Description of the fifth item.

## Final Thoughts

Wrap up with a summary and call to action.
`,
    defaultTags: ['tips', 'list'],
    defaultCategories: ['Tips & Advice'],
    seoTitleTemplate: '{{count}} {{topic}} | JHR Photography',
    seoDescriptionTemplate: 'Discover {{count}} {{topic}} from the experts at JHR Photography.',
  },
  {
    id: 'location-seo',
    name: 'Location-Based SEO',
    description: 'Service + city pattern for local search optimization.',
    variables: [
      { key: 'service', label: 'Service', placeholder: 'e.g., Corporate Event Photography', required: true },
      { key: 'city', label: 'City', placeholder: 'e.g., Nashville', required: true },
      { key: 'venue', label: 'Featured Venue', placeholder: 'e.g., Music City Center', required: false },
    ],
    body: `# {{service}} in {{city}}

Looking for professional {{service}} in {{city}}? JHR Photography delivers agency-grade results for corporate events, conferences, and headshot activations.

## Why Choose JHR for {{service}} in {{city}}

- Local expertise with deep knowledge of {{city}} venues
- Professional equipment and backup systems
- Same-day delivery options available
- Trusted by Fortune 500 companies

## Our {{service}} Services

### Event Coverage
Full-day photography coverage for conferences, trade shows, and corporate gatherings in {{city}}.

### Headshot Activations
On-site professional headshot stations with real-time editing and delivery.

### Video Services
Event highlight reels and speaker capture for {{city}} events.

${`## Featured Venue: {{venue}}

We frequently work at {{venue}} and know the venue inside and out — optimal lighting positions, power access points, and the best backgrounds for portraits.`}

## {{city}} Event Photography Pricing

Contact us for a custom quote tailored to your event needs in {{city}}.

## Book Your {{city}} Event Photographer

Ready to discuss your upcoming event in {{city}}? [Contact us](/contact) for a free consultation.
`,
    defaultTags: ['local-seo', '{{city}}'],
    defaultCategories: ['Local SEO'],
    seoTitleTemplate: '{{service}} in {{city}} | JHR Photography',
    seoDescriptionTemplate: 'Professional {{service}} in {{city}}. JHR Photography provides agency-grade event photography, headshots, and video services.',
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Challenge / Solution / Results format for showcasing work.',
    variables: [
      { key: 'client', label: 'Client Name', placeholder: 'e.g., ACME Corporation', required: true },
      { key: 'event', label: 'Event Name', placeholder: 'e.g., Annual Leadership Summit 2025', required: true },
      { key: 'venue', label: 'Venue', placeholder: 'e.g., Gaylord Opryland', required: false },
    ],
    body: `# Case Study: {{client}} — {{event}}

## Overview

JHR Photography provided comprehensive event photography services for {{client}} at their {{event}}.

## The Challenge

Describe the client's needs and any unique challenges:

- Challenge 1
- Challenge 2
- Challenge 3

## Our Solution

Detail how JHR approached the project:

### Pre-Event Planning
Describe the planning and preparation process.

### On-Site Execution
Describe the day-of photography approach.

### Post-Production
Describe editing, delivery, and any special processing.

## Results

- **Photos Delivered**: X
- **Turnaround Time**: X hours/days
- **Client Satisfaction**: Quote from client

> "Quote from the client about their experience with JHR Photography." — Client Name, Title

## Key Takeaways

1. Takeaway 1
2. Takeaway 2
3. Takeaway 3
`,
    defaultTags: ['case-study', 'portfolio'],
    defaultCategories: ['Case Studies'],
    seoTitleTemplate: '{{client}} {{event}} Photography | Case Study | JHR Photography',
    seoDescriptionTemplate: 'See how JHR Photography delivered professional event photography for {{client}} at {{event}}.',
  },
];

export function getTemplate(id: string): BlogTemplate | undefined {
  return blogTemplates.find((t) => t.id === id);
}

export function applyTemplate(
  template: BlogTemplate,
  variables: Record<string, string>
): { body: string; tags: string[]; categories: string[]; seoTitle: string; seoDescription: string } {
  return {
    body: replaceVars(template.body, variables),
    tags: template.defaultTags.map((t) => replaceVars(t, variables)),
    categories: template.defaultCategories,
    seoTitle: replaceVars(template.seoTitleTemplate, variables),
    seoDescription: replaceVars(template.seoDescriptionTemplate, variables),
  };
}
