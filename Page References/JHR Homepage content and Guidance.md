# **JHR Photography — Homepage Copy & Implementation Guide**

**Document Purpose:** Provide finalized website copy for each homepage section, with clear implementation notes for a code agent updating an existing deployed site.

**Important for Agent:** This document contains COPY ONLY. Do not rewrite or restructure existing page layout, component architecture, or routing. Apply copy to existing elements. Where new elements are suggested (images, scroll behaviors), add them within the current component structure.

---

## **Document Conventions**

* `[COPY]` \= Finalized text. Apply directly.  
* `[ELEMENT]` \= HTML element type or component role.  
* `[IMAGE]` \= Image placement with art direction notes.  
* `[INTERACTION]` \= Scroll animation or dynamic behavior recommendation.  
* `[STYLE NOTE]` \= CSS/styling suggestion — apply only if compatible with existing design system.  
* `[PLACEHOLDER]` \= Content Jayson's team will supply (testimonials, stats, logos).

---

## **SECTION 0: Navigation**

### **Copy**

* **Logo Text:** JHR Photography  
* **Nav Links (in order):** Services | About | Nashville Insider | Contact  
* **Nav CTA Button:** Talk With Our Team

### **Implementation Notes**

* Nav CTA links to contact/booking page or opens scheduling modal.  
* Nav should be sticky on scroll. Keep it visually quiet — no background color shift needed unless readability requires it on light sections.  
* Mobile: hamburger menu with CTA persistent outside the drawer.

---

## **SECTION 1: Hero**

**🔒 LOCKED — Do not alter this copy under any circumstances.**

### **Copy**

**\[H1 Headline\]** Your Event Media Should Make You Look Like the Pro.

**\[Subheadline / Lead Paragraph\]** We help busy event planners deliver high-value event media and headshots with certified, Nashville-based operators who know the venues, represent national brands, and align with your production timeline — so every image reflects the experience and value you worked hard to create.

**\[Primary CTA Button\]** Talk With Our Team

**\[Secondary CTA Button\]** Check Availability

### **Image Direction**

**\[IMAGE — Hero Background / Right Panel\]** Real event environment showing a JHR operator working seamlessly alongside a production team. Not posed. Not stock. The image should feel like you're looking into an active, well-run event where the media team is already integrated.

Preferred subjects: operator with professional camera gear working a ballroom, trade show floor, or executive session. Nashville venue identifiable if possible.

**\[IMAGE — Optional Hero Accent\]** A secondary smaller image or image strip showing 2–3 quick context shots: a headshot activation in progress, an executive portrait being taken, a trade show floor moment. These should feel like visual proof — not decoration.

### **Interaction Recommendations**

**\[INTERACTION — Hero Entry\]**

* Headline fades in first (200ms delay), followed by subheadline (400ms delay), then CTAs (600ms delay). Staggered reveal, not simultaneous.  
* If hero images are used, they should have a subtle parallax or slow zoom-in (Ken Burns) effect on load — creates cinematic depth without being distracting.  
* Keep total animation duration under 1.2 seconds. Nothing should feel slow.

**\[STYLE NOTE\]** Hero section benefits from a dark, warm palette (deep navy/charcoal with warm gold or cream text). This visually communicates calm authority and sets the tone before the visitor reads a word.

---

## **SECTION 2: Trust Bar**

### **Copy**

**\[Label Text\]** Trusted by event teams at

**\[PLACEHOLDER — Logo Set\]** Display 5–7 grayscale client or venue logos. Priority order:

1. Gaylord Opryland  
2. Music City Center  
3. \[Major association or corporate client\]  
4. \[Major association or corporate client\]  
5. \[Major association or corporate client\]

### **Implementation Notes**

* Logos should be grayscale with subtle opacity hover (go to full color or increase opacity on hover).  
* On mobile: horizontal scroll or 2-row grid.  
* No animation needed. This section should feel static and grounded — it's a trust anchor, not a feature.

---

## **SECTION 3: Empathy & Villain (The Problem)**

### **Copy**

**\[Eyebrow Text\]** We Get It

**\[H2 Heading\]** Confidence Instead of Guesswork

**\[Lead Paragraph\]** You've invested months into this event. The last thing you need is to wonder whether the media will reflect the work you've put in — or whether it will become one more thing you have to manage.

**\[Card 1 — Brand Alignment Uncertainty\]**

* Heading: "Will it represent our brand?"  
* Body: You need media that matches the quality and standards your organization is known for. Not someone else's creative interpretation — your brand, represented the right way.

**\[Card 2 — Management Overhead Uncertainty\]**

* Heading: "Will I have to manage this?"  
* Body: You're already coordinating vendors, timelines, and stakeholders. Media should integrate into your production flow, not become another item on your checklist.

**\[Card 3 — Timeline Uncertainty\]**

* Heading: "Will it be ready when I need it?"  
* Body: Sponsors expect assets. Marketing has deadlines. You need delivery you can count on — not a timeline that depends on someone else's schedule.

### **Image Direction**

**\[IMAGE — Per Card (Optional)\]** If adding images to blurb/card elements, use small contextual photos that visually represent each uncertainty being resolved:

* Card 1 image: A polished, on-brand corporate event photo — the kind of result that makes a planner proud. Shows the outcome, not the process.  
* Card 2 image: A JHR operator working independently at an event while the planner is focused elsewhere — visually communicates "you don't have to manage this."  
* Card 3 image: A gallery delivery screen or a planner reviewing a completed gallery on a laptop/tablet — signals timely, ready-to-use delivery.

Images should be small (thumbnail or accent size), not hero-scale. They support the copy, not compete with it.

### **Interaction Recommendations**

**\[INTERACTION — Scroll Reveal\]**

* Cards should animate in on scroll — staggered left to right with a slight upward translate (translateY 20px → 0\) and fade (opacity 0 → 1).  
* Trigger: when section enters 30% of viewport.  
* Stagger delay: 150ms between cards.  
* The heading and lead paragraph should already be visible (no animation) by the time cards start revealing — the copy anchors while the cards build.

---

## **SECTION 4: The Plan (How It Works)**

### **Copy**

**\[Eyebrow Text\]** How It Works

**\[H2 Heading\]** A Clear Path to Confident Delivery

**\[Lead Paragraph\]** We've done this hundreds of times. The process is simple because it's designed to be.

**\[Step 1\]**

* Step Label: 01  
* Heading: We Connect and Align  
* Body: A quick conversation to understand what you're trying to accomplish, what matters most, and how we can support your timeline and brand standards.

**\[Step 2\]**

* Step Label: 02  
* Heading: We Handle the Execution  
* Body: Our certified operators show up prepared, professional, and already familiar with your venue. You focus on your event. We handle the media.

**\[Step 3\]**

* Step Label: 03  
* Heading: You Get Assets You Can Use  
* Body: Professional media delivered on time, on brand, and ready for your marketing, communications, and sponsors — no back-and-forth required.

### **Image Direction**

**\[IMAGE — Journey Visual Walk-Through\]** This section benefits from visual storytelling alongside each step. Recommended approach: pair each step with a real photo that illustrates the moment.

* Step 1 image: A candid shot of Jayson or a JHR team member in a planning conversation — could be a phone call, a video meeting, or an in-person walkthrough at a venue. Communicates alignment and partnership.  
* Step 2 image: A JHR operator actively working an event — professional, focused, blending into the environment. Shows execution in progress.  
* Step 3 image: A finished gallery, a set of polished headshots displayed on screen, or a client reviewing delivered assets. Shows the tangible outcome.

These images should be sized to sit alongside or below each step block. On desktop, consider an alternating layout (image left / copy right, then copy left / image right) for visual rhythm. On mobile, image stacks above each step's copy.

### **Interaction Recommendations**

**\[INTERACTION — Journey Scroll Sequence\]** This is the strongest candidate for dynamic scroll behavior. Recommended approach:

**Option A — Scroll-Triggered Step Progression:** As the user scrolls through this section, each step reveals sequentially. The step number scales or highlights, the heading fades in, the body text follows, and the accompanying image slides in from the side. Each step fully completes its animation before the next begins. This creates a "walking through the process" feeling.

* Step 1 reveals at 0% section scroll  
* Step 2 reveals at 35% section scroll  
* Step 3 reveals at 70% section scroll  
* Use Intersection Observer or a scroll-linked animation library (GSAP ScrollTrigger, Framer Motion scroll hooks, or CSS scroll-driven animations if browser support allows).

**Option B — Sticky Scroll with Image Swap:** The step copy panel stays sticky on the left while the right side swaps images as the user scrolls. Each scroll position triggers a new step's image and highlights the corresponding step text. This is a more immersive approach but requires more implementation effort.

Either option works. Option A is simpler to implement and more universally supported. Option B is more visually impressive but should only be pursued if the site framework supports sticky positioning well.

**\[STYLE NOTE\]** This section works best on a dark background (deep navy or charcoal) to create visual weight and signal "this is the important part." Light step numbers with low opacity (15–20%) at large scale create depth without clutter.

---

## **SECTION 5: Services (Outcome-Focused)**

### **Copy**

**\[Eyebrow Text\]** What We Do

**\[H2 Heading\]** Media That Matches the Experience

**\[Lead Paragraph\]** Every service is designed around one question: how does this help you deliver an event that looks as professional as the work you put into it?

**\[Service Card 1 — Conference & Event Media\]**

* Label: Conference & Event Media  
* Heading: Turn Your Event Into a Year of Content  
* Body: Capture the keynotes, the connections, and the moments between — delivered as a professional media library your team can use for marketing, recruiting, and stakeholder communications all year.  
* Link Text: Learn How This Works →

**\[Service Card 2 — Headshot Activations\]**

* Label: Headshot Activations  
* Heading: Be the Most Popular Booth on the Floor  
* Body: A professional activation that draws a crowd, gives attendees something they actually value, and provides your sales team with warm leads — not just badge scans.  
* Link Text: Learn How This Works →

**\[Service Card 3 — Executive Imaging\]**

* Label: Executive Imaging  
* Heading: Your Leadership Team, Represented the Right Way  
* Body: Professional imaging for leadership teams and groups — aligned to your brand standards, delivered efficiently, and designed to support recruiting, communications, and public presence.  
* Link Text: Learn How This Works →

**\[Service Card 4 — Trade-Show Media\]**

* Label: Trade-Show Media  
* Heading: Media That Proves the Investment Was Worth It  
* Body: Comprehensive trade-show documentation that gives sponsors the assets they expect, provides your marketing team with content that performs, and captures the energy of your show floor.  
* Link Text: Learn How This Works →

### **Image Direction**

**\[IMAGE — Per Service Card\]** Each card should include a real photo from that service category:

* Card 1: Corporate conference environment — keynote stage, networking, or session capture in progress.  
* Card 2: Headshot activation at a trade show booth — attendee in front of professional lighting, energy and engagement visible.  
* Card 3: Executive portrait — clean, polished, professional setting. One strong portrait that communicates quality.  
* Card 4: Trade show floor — wide or medium shot showing booth coverage, exhibitor environment, sponsor signage.

Images sit at the top of each card (landscape orientation, roughly 16:9 or 3:2 aspect ratio). They should feel real and specific to JHR's work — not generic event photography.

### **Interaction Recommendations**

**\[INTERACTION — Card Hover \+ Scroll\]**

* Cards fade in on scroll (staggered, 2-column grid animates top-left, top-right, bottom-left, bottom-right).  
* On hover: subtle border color shift to warm gold, card link arrow translates right 3–4px. Image can do a very subtle scale (1.0 → 1.03). Keep it refined — no dramatic zooms.

---

## **SECTION 6: Local Authority**

### **Copy**

**\[Eyebrow Text\]** Nashville-Based, Client-Ready

**\[H2 Heading\]** Local Operators. National Brand Expectations.

**\[Body Paragraph 1\]** We know the venues, the staff, the loading docks, and the lighting. We know where to be and when to be there — because we've been in these rooms before, working alongside teams just like yours.

**\[Body Paragraph 2\]** That means less coordination on your end. No orientation needed. No guesswork about logistics. Just a team that integrates into your production flow from the moment we arrive.

**\[Proof Points — display as a short list or inline markers\]**

* Approved operators at Gaylord Opryland and Music City Center  
* Familiar with Nashville's top corporate event venues  
* Certified professionals — not a staffing marketplace  
* Aligned to national brand standards and agency workflows

### **Image Direction**

**\[IMAGE — Right Column or Background\]** A real JHR operator working inside a recognizable Nashville venue. Gaylord Opryland atrium, Music City Center ballroom, or a comparable high-end corporate event space. The image should communicate familiarity — this person clearly belongs in this environment.

### **Implementation Notes**

* Two-column layout on desktop: copy left, image right.  
* On mobile: image stacks above copy.  
* No scroll animation needed for this section — it should feel grounded and steady. Static presence reinforces authority.

---

## **SECTION 7: Social Proof / Testimonials**

### **Copy**

**\[Eyebrow Text\]** From the Planners We've Worked With

**\[H2 Heading\]** They Felt the Difference

**\[PLACEHOLDER — Testimonial 1: External Operator ICP\]** Quote should reference: seamless integration, operating like part of their team, delivering without requiring oversight, and making the agency look good to their client.

Attribution format:

* Name, Title  
* Organization Type: National Event Agency / DMC

**\[PLACEHOLDER — Testimonial 2: Internal Owner ICP\]** Quote should reference: assets being used well beyond the event, professional handling of the entire experience, and making the planner look great to internal stakeholders.

Attribution format:

* Name, Title  
* Organization Type: Enterprise Marketing / Operations

**\[PLACEHOLDER — Testimonial 3: ROI Operator ICP\]** Quote should reference: booth engagement, lead quality, attendee energy, or how the activation drove real measurable results on the show floor.

Attribution format:

* Name, Title  
* Organization Type: Field Marketing / Exhibitor

### **Guidance for Collecting Testimonials**

The strongest testimonials for this page are NOT compliments about photo quality. They describe a transformation:

* Before: uncertainty, stress, vendor management burden  
* After: confidence, ease, professional outcomes

Prompt past clients with: "What was different about working with us compared to what you expected?" — this naturally produces transformation language.

### **Implementation Notes**

* Three cards in a row on desktop, single stack on mobile.  
* Optional: include a small headshot or avatar for each attribution to increase trust.  
* No carousel. All three visible at once. Carousels reduce engagement.

---

## **SECTION 8: Team Extension**

### **Copy**

**\[Eyebrow Text\]** Aligned With Your Timeline

**\[H2 Heading\]** We Work Like Part of Your Team

**\[Body Paragraph 1\]** We're not showing up as an outside vendor who needs to be briefed, oriented, and managed. We operate as a local extension of your team — aligned with your goals, familiar with your venue, and ready to execute from the moment we arrive.

**\[Body Paragraph 2\]** That means one less thing to coordinate. One less vendor to check in on. And a media partner who understands that your event's success is the only metric that matters.

**\[Stats Grid — 4 blocks\]**

| Stat | Label |
| ----- | ----- |
| \[X\]+ | Corporate events in Nashville |
| 72hr | Standard photo delivery window |
| 100% | Certified, vetted operators |
| \[X\] | Nashville venues we know by heart |

*Replace \[X\] values with real numbers from Jayson's records.*

### **Implementation Notes**

* Dark background section (matches Plan section palette for visual rhythm).  
* Two-column: copy left, stats grid right.  
* Stats should feel factual and grounded — not flashy counters. Static display is fine. If using count-up animation, trigger once on scroll entry only.

---

## **SECTION 9: Success Outcomes**

### **Copy**

**\[Eyebrow Text\]** The Result

**\[H2 Heading\]** What Success Looks Like for You

**\[Outcome 1\]**

* Heading: Media That Gets Used  
* Body: Professional assets your marketing, recruiting, and communications teams actually want to share — not files that sit in a folder.

**\[Outcome 2\]**

* Heading: Delivered On Time  
* Body: Clear timelines, no chasing. Your gallery arrives when promised — ready for sponsors, stakeholders, and social.

**\[Outcome 3\]**

* Heading: You Look Like a Pro  
* Body: Stakeholders, sponsors, and attendees see the quality and ask who handled the media. You made the right call.

**\[Outcome 4\]**

* Heading: Happy to Recommend  
* Body: The experience was seamless enough that you'd mention us without hesitation the next time someone asks.

### **Implementation Notes**

* Four items in a horizontal grid on desktop, 2x2 on tablet, single column on mobile.  
* Simple icon or checkmark above each heading. Keep icons minimal — this section is about clarity, not decoration.  
* Light background (cream or off-white) for contrast against the dark section above.

---

## **SECTION 10: Final CTA**

### **Copy**

**\[Micro-Tagline — small text above heading\]** Media execution confidence for Nashville corporate events

**\[H2 Heading\]** Your Event Deserves Media That Matches the Work You Put In.

**\[Lead Paragraph\]** Tell us about your event. We'll show you exactly how we can support your timeline, your brand, and your team.

**\[Primary CTA Button\]** Talk With Our Team

**\[Secondary CTA Button\]** Check Availability

### **Implementation Notes**

* Dark gradient background matching hero section — creates visual bookend.  
* Center-aligned, generous vertical padding.  
* CTA buttons should match hero section styling exactly for consistency.  
* This is the final impression. Keep it clean. No additional text, links, or distractions below the buttons.

---

## **SECTION 11: Footer**

### **Copy**

**\[Brand Statement\]** JHR Photography We help event professionals look great without the stress — so they can focus on their event while we handle the media.

**\[Column 1: Services\]**

* Corporate Event Coverage  
* Headshot Activations  
* Executive Imaging  
* Trade-Show Media  
* Event Video Systems

**\[Column 2: Company\]**

* About JHR  
* Nashville Insider  
* Contact

**\[Column 3: Connect\]**

* Instagram  
* LinkedIn  
* Talk With Our Team

**\[Bottom Bar\]** © 2026 JHR Photography LLC. Nashville, Tennessee. Privacy · Terms · Licensing

### **Implementation Notes**

* Dark background (darkest on page — creates a solid base).  
* Footer brand statement uses the approved JHR one-liner from the StoryBrand Strategy doc.  
* "Talk With Our Team" in the Connect column links to same destination as nav and hero CTAs.

---

## **Global Interaction & Style Notes**

### **Scroll Animation Summary**

| Section | Animation Type | Trigger |
| ----- | ----- | ----- |
| Hero | Staggered fade-in (headline → sub → CTAs) | Page load |
| Trust Bar | None (static) | — |
| Empathy Cards | Staggered fade \+ translateY per card | 30% viewport entry |
| The Plan (Journey) | Scroll-triggered step progression OR sticky scroll with image swap | Section scroll position |
| Service Cards | Staggered fade-in (grid order) \+ hover effects | 30% viewport entry |
| Local Authority | None (static) | — |
| Testimonials | Subtle fade-in (all at once) | 30% viewport entry |
| Team Extension | Stats count-up (optional) | 50% viewport entry, once |
| Outcomes | None or subtle fade | — |
| Final CTA | None (static) | — |

### **Animation Principles**

* Total animation duration per element: 400–600ms.  
* Easing: ease-out or cubic-bezier(0.25, 0.1, 0.25, 1\) — never linear.  
* Never animate the same element twice. Trigger once, stay visible.  
* Scroll animations should feel like the page is breathing, not performing.  
* If the site framework already has a scroll animation library (AOS, GSAP, Framer Motion), use it. Don't add a new dependency.

### **Image Sizing Reference**

| Placement | Aspect Ratio | Max Width | Notes |
| ----- | ----- | ----- | ----- |
| Hero background/panel | 16:9 or custom | Full section | Dark overlay if text sits on top |
| Service cards | 16:9 or 3:2 | Card width | Landscape, top of card |
| Empathy cards (optional) | 4:3 or 1:1 | 120–160px | Thumbnail accent, not hero-scale |
| Plan/Journey steps | 3:2 or 16:9 | 50% of section width | Alternating left/right on desktop |
| Local Authority | 3:2 or 4:5 | 50% of section width | Right column on desktop |

### **Typography Recommendations (Apply Only If Compatible)**

* Display / headings: A serif with warmth and weight — DM Serif Display, Playfair Display, or similar. Should feel established, not trendy.  
* Body / UI: A clean sans-serif — DM Sans, Plus Jakarta Sans, or similar. Should feel professional and readable at small sizes.  
* Eyebrow text: Body font, all-caps, wide letter-spacing (0.08–0.12em), small size (0.7–0.75rem).

### **Color Palette Reference**

| Role | Suggested Value | Usage |
| ----- | ----- | ----- |
| Primary Dark | \#1a1f2e | Hero, Plan, Team Extension, Final CTA backgrounds |
| Warm Accent | \#c8a87c | Eyebrow text, CTAs, hover states, proof point markers |
| Cream | \#faf8f5 | Trust bar, outcomes section, card backgrounds |
| Body Text (dark bg) | \#e8d5b8 at 70% opacity | Subheadlines and body on dark sections |
| Body Text (light bg) | \#4a5568 | Body copy on white/cream sections |
| Heading (light bg) | \#1a1f2e | All headings on light backgrounds |

---

## **Copy Quality Checklist (For Review Before Deployment)**

Before publishing, verify every section passes these checks:

1. ✅ JHR is positioned as the **Guide**, not the Hero  
2. ✅ The villain is **uncertainty** — not fear, risk, or failure  
3. ✅ Language reinforces **confidence, alignment, and value**  
4. ✅ No photography jargon, freelancer language, or technical specs appear  
5. ✅ Every sentence either reduces uncertainty, reinforces professionalism, or clarifies value  
6. ✅ CTAs say "Talk With Our Team" or "Check Availability" — nothing transactional  
7. ✅ The copy sounds like someone who has been in the room before — calm, experienced, human

---

*End of document. All copy is final and approved for deployment unless Jayson directs otherwise.*

