# **JHR Photography — Services Hub Page Copy & Implementation Guide**

**Document Purpose:** Provide finalized copy for the top-level Services page. This is a discovery and routing page — not a service catalog. The goal is to help the hero (busy event planner) quickly identify which service fits their situation, then move confidently to the right detail page.

**Important for Agent:** This document contains COPY ONLY. Do not rewrite or restructure existing page layout, component architecture, or routing. Apply copy to existing elements. Where new structural elements are suggested, add them within the current component framework. Current service subpages remain at their existing routes.

---

## **Strategic Recommendation: "What Are You Planning?" Framework**

**The Problem with a Standard Services Page:** A typical services page lists what the company sells. But our hero — a busy, over-tasked event planner — doesn't think in our service taxonomy. They think in their own situation: "I'm planning a conference," "I'm exhibiting at a trade show," "I need headshots for my leadership team."

**The Recommendation:** Structure this page around the hero's event type, not JHR's service names. Each pathway acknowledges what the planner is trying to accomplish, names the uncertainty they're facing, and routes them to the right service page with confidence.

This does three things:

1. Reduces decision fatigue — the planner doesn't have to figure out which service maps to their need  
2. Reinforces JHR as the Guide — we're organizing around THEIR world, not ours  
3. Increases conversion — shorter path from "this is my situation" to "talk to the team"

**Current Service Routes (Preserved):**

* /services/headshot-activation  
* /services/corporate-event-coverage  
* /services/corporate-headshot-program  
* /services/event-video-systems

---

## **Document Conventions**

* `[COPY]` \= Finalized text. Apply directly.  
* `[ELEMENT]` \= HTML element type or component role.  
* `[IMAGE]` \= Image placement with art direction notes.  
* `[INTERACTION]` \= Scroll animation or dynamic behavior recommendation.  
* `[STYLE NOTE]` \= CSS/styling suggestion — apply only if compatible with existing design system.  
* `[ROUTE]` \= Links to existing service subpages.

---

## **SECTION 1: Page Hero**

### **Copy**

**\[Eyebrow Text\]** Our Services

**\[H1 Headline\]** The Right Media Partner for What You're Planning

**\[Lead Paragraph\]** Every event has different pressures, different stakeholders, and different definitions of success. We've structured our services around the situations event professionals actually face — so you can find exactly what you need without sorting through what you don't.

**\[Secondary Line — Optional\]** Not sure where to start? That's what we're here for.

**\[CTA Button — Below Lead\]** Talk With Our Team

### **Image Direction**

**\[IMAGE — Hero Background\]** A wide, atmospheric shot from a Nashville corporate event — slightly pulled back to show the scale and environment. Not focused on a single service, but on the professional event ecosystem JHR operates in. Think: a ballroom during a live event with professional lighting, or a trade show floor with energy and movement.

This image sets context — "we work in these environments" — before the visitor drills into specifics.

### **Implementation Notes**

* This hero should be shorter/lighter than the homepage hero. It's a wayfinding page, not a landing page. Don't compete with the homepage for attention.  
* Background image with dark overlay if text sits on top, OR a split layout with image on one side.  
* Single CTA here — "Talk With Our Team" — for visitors who already know they want to connect.

---

## **SECTION 2: Discovery Pathways ("What Are You Planning?")**

This is the core of the page. Four pathway cards, each framed around the hero's situation.

### **Section Copy**

**\[H2 Heading\]** What Are You Planning?

**\[Lead Paragraph\]** Select the scenario that's closest to your situation. We'll show you exactly how we support it.

---

### **Pathway Card 1: Conferences & Corporate Events**

**\[ROUTE → /services/corporate-event-coverage\]**

**\[Card Label / Eyebrow\]** Conferences · Summits · Corporate Meetings

**\[Card Heading\]** You're running a multi-day conference and need media that actually gets used afterward.

**\[Card Body\]** Months of planning shouldn't vanish when the lights go down. We capture the keynotes, the connections, and the moments between — and deliver a professional media library your team can use for marketing, recruiting, and stakeholder communications all year.

You focus on the event. We handle the documentation.

**\[What This Covers — Subtle Inline List\]** Corporate Event Coverage™ · Event Video Systems™ · Same-Day Highlights

**\[Card CTA Link\]** See How Event Coverage Works →

**\[IMAGE — Card Image\]** Corporate conference environment — keynote stage, networking moment, or session in progress. Real JHR work, not stock.

---

### **Pathway Card 2: Trade Shows & Exhibitor Activations**

**\[ROUTE → /services/headshot-activation\]**

**\[Card Label / Eyebrow\]** Trade Shows · Conventions · Exhibitor Booths

**\[Card Heading\]** You're exhibiting and need your booth to actually drive engagement — not just exist on the floor.

**\[Card Body\]** Badge scans and branded pens don't move the needle. Our Headshot Activation creates a professional experience attendees line up for — giving your sales team natural conversations, qualified contact data, and assets people actually keep and share.

Your booth becomes the destination, not the one people walk past.

**\[What This Covers — Subtle Inline List\]** Headshot Activation™ · Trade-Show Media Services™ · Social Recap System™

**\[Card CTA Link\]** See How Booth Activations Work →

**\[IMAGE — Card Image\]** Active headshot activation at a trade show booth — attendee in the chair, professional lighting visible, energy and engagement. Show the crowd, not just the portrait.

---

### **Pathway Card 3: Leadership & Team Headshots**

**\[ROUTE → /services/corporate-headshot-program\]**

**\[Card Label / Eyebrow\]** Executive Portraits · Team Headshots · Brand Imaging

**\[Card Heading\]** Your leadership team needs updated headshots that actually represent the organization well.

**\[Card Body\]** Whether it's five executives or fifty team members, we bring the setup, the direction, and the experience to you — on your schedule, aligned to your brand standards, and delivered efficiently so your people aren't pulled away from work longer than necessary.

Professional imaging without the production hassle.

**\[What This Covers — Subtle Inline List\]** Executive Imaging™ · Executive Group Imaging Experience™ · Camera Ready Touchup Service™

**\[Card CTA Link\]** See How Headshot Programs Work →

**\[IMAGE — Card Image\]** A polished executive portrait — clean, professional, brand-appropriate. Or a behind-the-scenes moment from a group headshot session showing the streamlined, organized setup.

---

### **Pathway Card 4: Event Video & Content Systems**

**\[ROUTE → /services/event-video-systems\]**

**\[Card Label / Eyebrow\]** Highlight Reels · Executive Stories · Social Content

**\[Card Heading\]** You need video content from your event that works for marketing, social, and leadership messaging.

**\[Card Body\]** A single event can produce months of content — if it's captured with the right intent. Our video systems are built to work alongside photography coverage, so you get a complete media library from one coordinated team. No separate vendors, no conflicting timelines.

One event. A full year of content.

**\[What This Covers — Subtle Inline List\]** Event Highlight System™ · Executive Story System™ · Social Recap System™

**\[Card CTA Link\]** See How Video Systems Work →

**\[IMAGE — Card Image\]** A videographer working an event environment — could be capturing a keynote, an executive interview setup, or B-roll during a networking session. Shows intentional, professional video production.

---

### **Interaction Recommendations for Pathway Cards**

**\[INTERACTION — Scroll \+ Hover\]**

* Cards fade in on scroll, staggered (150ms between each).  
* On hover: subtle lift (translateY \-4px), warm border accent appears, card link arrow translates right.  
* Cards should be large enough to breathe — generous padding, clear hierarchy between label, heading, body, and CTA link.

**\[STYLE NOTE — Card Layout\]** Two layout options depending on existing grid:

**Option A — Full-Width Cards (Recommended):** Each card takes the full content width as a horizontal block — image on one side, copy on the other, alternating left/right. This gives more room for the body copy and feels like a guided walk-through rather than a catalog grid. Better for storytelling.

**Option B — 2x2 Grid:** Four cards in a standard grid. More compact, faster to scan. Works if the current page uses card-based layouts already. Image sits at top of each card (landscape).

Option A is stronger for this page's purpose (discovery, not browsing), but Option B works if the site's component library already supports it cleanly.

---

## **SECTION 3: "Not Sure?" — Reassurance Block**

This section catches visitors who looked at the pathways and still aren't sure. It's a soft net.

### **Copy**

**\[H2 Heading\]** Not Sure Which Fits Your Event?

**\[Body Paragraph\]** That's completely fine — most of the planners we work with start with a quick conversation. Tell us about your event, your timeline, and what matters most. We'll recommend the right approach and give you a clear picture of what to expect.

No pressure. No long proposals. Just a straightforward conversation with someone who's done this before.

**\[CTA Button\]** Talk With Our Team

### **Implementation Notes**

* Center-aligned, generous padding above and below.  
* Light background (cream or off-white) to create a calm, open feel.  
* This section should feel like a hand extended — not a sales push.  
* Single CTA. No secondary option needed here.

---

## **SECTION 4: How We're Different — Guide Credibility**

Short section reinforcing why JHR is the right guide for any of the above pathways. This is NOT a features list — it's authority through familiarity.

### **Copy**

**\[Eyebrow Text\]** Why Event Teams Choose JHR

**\[H2 Heading\]** Built for the Way Events Actually Work

**\[Body — 4 Short Value Blocks\]**

**Certified, Not Contracted** Every JHR operator is certified, vetted, and trained to represent national brands in high-stakes environments. You're not getting whoever is available — you're getting someone who's prepared for your specific event.

**Nashville Venues, Known by Heart** Gaylord Opryland, Music City Center, the Renaissance, the Ryman — we've worked these rooms hundreds of times. That means no orientation, no guesswork on logistics, and no surprises about what works where.

**Aligned to Your Timeline, Not Ours** We deliver on your schedule. Photography galleries in 72 hours. Video in 21 business days. Same-day highlights when you need them. Clear timelines you can plan around.

**One Team, Complete Coverage** Photography, video, headshot activations, and social content — all coordinated through a single partner. No separate vendors to manage. No conflicting schedules. One team that handles the full scope.

### **Image Direction**

**\[IMAGE — Optional Background or Accent\]** If using imagery here, a subtle Nashville venue interior (wide, slightly blurred or low-opacity) works as a background texture. Or skip the image entirely — the credibility comes from the words here, not visuals.

### **Implementation Notes**

* Four blocks in a 2x2 grid on desktop, single column on mobile.  
* Each block: bold heading \+ short paragraph. No icons needed unless the design system already uses them.  
* Light or white background. This section should feel clean and factual.

---

## **SECTION 5: Services Quick Reference**

A compact, scannable reference for visitors who already know what they're looking for and just want to navigate. This sits below the discovery content as a practical utility — not the primary pathway.

### **Copy**

**\[Eyebrow Text\]** All Services

**\[H2 Heading\]** Quick Reference

| Service | Best For | Link |
| ----- | ----- | ----- |
| Corporate Event Coverage™ | Conferences, summits, corporate meetings, multi-day events | /services/corporate-event-coverage |
| Headshot Activation™ | Trade show booths, exhibitor activations, sponsor engagement | /services/headshot-activation |
| Executive Imaging™ & Group Programs | Leadership headshots, team photos, department updates | /services/corporate-headshot-program |
| Event Video Systems™ | Highlight reels, executive stories, social content, testimonials | /services/event-video-systems |
| Trade-Show Media Services™ | Multi-day trade show documentation, sponsor deliverables | /services/corporate-event-coverage |
| Social & Networking Media | Happy hours, receptions, networking events, community events | /services/corporate-event-coverage |

### **Implementation Notes**

* This can be rendered as a clean table, a compact list, or a minimal card row — whatever the existing component library supports.  
* This section is utility, not storytelling. Keep it tight and scannable.  
* On mobile: stack as a simple list with service name \+ one-line description \+ link.  
* Some services may currently share a detail page (Trade-Show Media under Corporate Event Coverage, etc.). Route to the closest existing page. As individual pages get built, update routes.

---

## **SECTION 6: Final CTA**

### **Copy**

**\[Micro-Tagline\]** Media execution confidence for Nashville corporate events

**\[H2 Heading\]** Every Event Deserves a Media Partner Who Gets It Right.

**\[Lead Paragraph\]** Tell us what you're working on. We'll tell you exactly how we can help — and what it looks like when the media matches the event.

**\[Primary CTA Button\]** Talk With Our Team

**\[Secondary CTA Button\]** Check Availability

### **Implementation Notes**

* Dark gradient background matching homepage final CTA — visual consistency across site.  
* Center-aligned, generous vertical padding.  
* Same CTA button styling as homepage. Consistency reinforces trust.

---

## **SECTION 7: Footer**

Footer copy is identical to homepage. No changes needed — maintain consistency across all pages.

---

## **Page-Level Interaction Summary**

| Section | Animation Type | Trigger |
| ----- | ----- | ----- |
| Page Hero | Subtle fade-in (headline → sub → CTA) | Page load |
| Discovery Pathways | Staggered fade \+ hover lift per card | 30% viewport entry |
| "Not Sure?" Block | None (static) | — |
| Guide Credibility | Subtle fade-in (all blocks together) | 30% viewport entry |
| Quick Reference | None (static) | — |
| Final CTA | None (static) | — |

---

## **Routing & Page Hierarchy Note for Agent**

Current service subpage routes (do not change):

* /services/headshot-activation  
* /services/corporate-event-coverage  
* /services/corporate-headshot-program  
* /services/event-video-systems

The discovery pathway cards route to these existing pages. As JHR builds out dedicated pages for Trade-Show Media Services, Social & Networking Media, and individual video systems, the routing can be updated. For now, route to the closest parent service page.

The services hub page (/services) should be treated as a discovery layer — it does NOT need to duplicate content from the subpages. Its job is to get the visitor to the right subpage quickly and with confidence.

---

## **Copy Quality Checklist (For Review Before Deployment)**

1. ✅ Every pathway card starts with the **hero's situation**, not JHR's service name  
2. ✅ JHR is positioned as the **Guide** — organizing around the planner's world  
3. ✅ The villain (uncertainty, decision fatigue) is addressed through clear structure  
4. ✅ No photography jargon, freelancer language, or technical specs  
5. ✅ Service names appear as supporting detail, never as the primary framing  
6. ✅ CTAs are "Talk With Our Team" or "Check Availability" — supportive, not transactional  
7. ✅ The page answers: "I'm planning \[X\] — does JHR handle that?" within 5 seconds of scanning

---

*End of document. All copy is final and approved for deployment unless Jayson directs otherwise.*

