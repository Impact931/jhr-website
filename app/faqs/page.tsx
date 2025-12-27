"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditablePageHero } from "@/components/editor/EditablePageHero";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollAnimation";

const faqCategories = [
  {
    name: "General",
    faqs: [
      {
        question: "What makes JHR different from other event photographers?",
        answer:
          "We operate as a logistics-first media partner, not just a creative service. Our background in high-stakes operations means we bring agency-grade planning, redundant equipment, and professional protocols to every event. We know Nashville's venues inside and out, and we communicate in the language of event professionals—EAC forms, marshaling yards, load-in schedules.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We're based in Nashville and serve events throughout Middle Tennessee. For national conferences and trade shows, we work with clients flying in from across the country who need a reliable local partner. We've supported events at Music City Center, Gaylord Opryland, and all major Nashville venues.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "For large conferences and trade shows, we recommend reaching out 2-3 months in advance to ensure availability and allow time for proper logistics planning. For smaller corporate events, 4-6 weeks is typically sufficient. That said, contact us even if you're on a tight timeline—we may be able to accommodate.",
      },
    ],
  },
  {
    name: "Headshot Activation",
    faqs: [
      {
        question: "How many attendees can you photograph in a day?",
        answer:
          "Our standard Headshot Activation setup can process 300+ attendees per day. For high-volume events, we can scale to 500+ with our premium configuration and additional staff. Each attendee spends approximately 5 minutes at the station, including check-in, photography, and image selection.",
      },
      {
        question: "How quickly are photos delivered?",
        answer:
          "Attendees receive their AI-retouched, branded images within minutes of their session. The delivery is instant—directly to their phone via text or email. This speed is critical for trade show environments where immediate gratification drives engagement and social sharing.",
      },
      {
        question: "What data do you capture for lead generation?",
        answer:
          "At check-in, we capture the attendee's name, email, phone number, and company (customizable fields). This data is delivered to you in real-time, allowing your sales team to follow up with warm leads during or immediately after the event. All data is handled in compliance with privacy regulations.",
      },
    ],
  },
  {
    name: "Event Coverage",
    faqs: [
      {
        question: "Do you offer same-day delivery?",
        answer:
          "Yes. For event coverage, we offer same-day delivery of edited highlights—typically 20-50 images selected and processed within hours of the event's conclusion. This is ideal for social media, press, and immediate marketing use. Full galleries are delivered within 5-7 business days.",
      },
      {
        question: "What's included in corporate event coverage?",
        answer:
          "Our coverage includes arrival/setup documentation, keynote and breakout session photography, candid networking moments, exhibitor and sponsor coverage, and VIP interactions. We work from a shot list aligned with your priorities and deliver images that tell the story of your event.",
      },
      {
        question: "Do you provide video services?",
        answer:
          "Yes. Our Event Video Systems service includes keynote capture, highlight reels, attendee testimonials, and social-ready clips. Video can be added to any photography package or booked independently.",
      },
    ],
  },
  {
    name: "Logistics & Process",
    faqs: [
      {
        question: "Are you familiar with venue-specific requirements?",
        answer:
          "Absolutely. We're well-versed in the operational requirements of Nashville's major venues. We handle EAC (Exhibitor Appointed Contractor) paperwork, understand marshaling yard procedures, carry appropriate insurance, and know the contact protocols for each property. This venue fluency eliminates friction for you.",
      },
      {
        question: "What happens if there's an equipment failure?",
        answer:
          "We bring backup equipment to every shoot—cameras, lighting, batteries, memory cards. Our protocols assume something will fail and plan accordingly. In over a decade of events, we've never missed a critical moment due to equipment issues.",
      },
      {
        question: "How do you handle multi-day events?",
        answer:
          "Multi-day events are our specialty. We establish consistent workflows, maintain the same team throughout (when possible), and deliver rolling galleries so you have usable content each day. Our stamina and consistency across 3-5 day conferences is what event planners appreciate most.",
      },
    ],
  },
  {
    name: "Pricing & Booking",
    faqs: [
      {
        question: "How does your pricing work?",
        answer:
          "We price based on outcomes, not hours. Each service (Headshot Activation, Event Coverage, etc.) is a productized offering with clear deliverables. After our strategy call, we provide a detailed proposal specific to your event. We don't do ballpark pricing because every event is different.",
      },
      {
        question: "Do you require a deposit?",
        answer:
          "Yes. We require a 50% deposit to secure your date, with the balance due before the event. For large events with significant equipment and staffing commitments, we may adjust this structure. All terms are clearly outlined in our service agreement.",
      },
      {
        question: "What's your cancellation policy?",
        answer:
          "We understand plans change. Cancellations more than 30 days out receive a full refund of the deposit. Within 30 days, we work with you on rescheduling or partial credits. Force majeure situations are handled case-by-case with understanding that neither party benefits from impossible circumstances.",
      },
    ],
  },
];

export default function FAQsPage() {
  const pageId = "faqs";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title="Frequently Asked Questions"
        subtitle="FAQs"
        description="Answers to common questions about working with JHR Photography. Can't find what you're looking for? Schedule a call and we'll address your specific situation."
        image="/images/generated/event-networking.jpg"
        imageAlt="Corporate event networking"
      />

      {/* FAQ Sections */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <FadeUp key={category.name} delay={categoryIndex * 0.1}>
                <div className="mb-12 last:mb-0">
                  <EditableText
                    pageId={pageId}
                    sectionId="faqCategories"
                    contentKey={`category${categoryIndex}-name`}
                    defaultValue={category.name}
                    as="h2"
                    className="text-heading-lg font-semibold text-jhr-gold mb-6 pb-2 border-b border-jhr-black-lighter"
                    contentType="heading"
                  />
                  <StaggerContainer className="space-y-6">
                    {category.faqs.map((faq, index) => (
                      <StaggerItem key={index}>
                        <div className="card">
                          <EditableText
                            pageId={pageId}
                            sectionId={`category${categoryIndex}`}
                            contentKey={`faq${index}-question`}
                            defaultValue={faq.question}
                            as="h3"
                            className="text-heading-md font-semibold text-jhr-white mb-3"
                            contentType="heading"
                          />
                          <EditableText
                            pageId={pageId}
                            sectionId={`category${categoryIndex}`}
                            contentKey={`faq${index}-answer`}
                            defaultValue={faq.answer}
                            as="p"
                            className="text-body-md text-jhr-white-dim leading-relaxed"
                            contentType="paragraph"
                            multiline
                          />
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-jhr-black-light relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId={pageId}
            sectionId="cta"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/hero-services.jpg"
            alt="Corporate event photography"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <FadeUp>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="title"
              defaultValue="Still Have Questions?"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="description"
              defaultValue="Every event is unique. Schedule a strategy call and we'll address your specific situation, venue, and requirements."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
              contentType="paragraph"
              multiline
            />
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule" className="btn-primary text-lg px-8 py-4">
                Schedule a Strategy Call
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                Send Us a Message
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
