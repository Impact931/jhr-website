"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Camera,
  Clock,
  Shield,
  FileImage,
} from "lucide-react";
import { EditablePageHero } from "@/components/editor/EditablePageHero";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import {
  FadeUp,
  SlideInLeft,
  SlideInRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollAnimation";

const deliverables = [
  {
    icon: Camera,
    title: "Comprehensive Coverage",
    description:
      "Keynotes, breakouts, networking, exhibitor interactions, VIP moments—we capture the full story of your event from setup to breakdown.",
  },
  {
    icon: Clock,
    title: "Same-Day Delivery",
    description:
      "Edited highlights delivered within hours of your event's conclusion. Perfect for social media, press releases, and immediate marketing needs.",
  },
  {
    icon: Shield,
    title: "Redundant Systems",
    description:
      "Backup equipment, backup memory, backup everything. Our protocols assume something will fail—and plan accordingly.",
  },
  {
    icon: FileImage,
    title: "Full Gallery in 5-7 Days",
    description:
      "Complete edited gallery delivered within one week. Every image professionally processed and ready for use.",
  },
];

const coverageAreas = [
  "Keynote and general sessions",
  "Breakout sessions and workshops",
  "Exhibitor and sponsor documentation",
  "Networking and candid moments",
  "VIP interactions and executive coverage",
  "Setup and behind-the-scenes",
  "Awards ceremonies and galas",
  "Product demonstrations",
];

const faqs = [
  {
    question: "Do you offer same-day delivery?",
    answer:
      "Yes. We deliver 20-50 edited highlight images within hours of the event's conclusion. This is ideal for social media, press, and immediate marketing use. The full gallery follows within 5-7 business days.",
  },
  {
    question: "How do you handle multi-day events?",
    answer:
      "Multi-day events are our specialty. We maintain the same team throughout, establish consistent workflows, and deliver rolling galleries so you have usable content each day. Our stamina and consistency across 3-5 day conferences is what event planners appreciate most.",
  },
  {
    question: "What's your backup plan for equipment failures?",
    answer:
      "We bring backup equipment to every shoot—cameras, lighting, batteries, memory cards. Our protocols assume something will fail and plan accordingly. In over a decade of events, we've never missed a critical moment due to equipment issues.",
  },
  {
    question: "Can you work from a shot list?",
    answer:
      "Absolutely. We prefer it. Before the event, we'll review your priorities, required shots, and must-capture moments. We work systematically through your list while staying alert for spontaneous opportunities.",
  },
  {
    question: "How do you coordinate with event staff?",
    answer:
      "We arrive early, introduce ourselves to key personnel, and establish clear communication protocols. We're experienced working alongside AV teams, venue staff, and security. We fit into your event—not the other way around.",
  },
];

export default function CorporateEventCoveragePage() {
  const pageId = "services-corporate-event-coverage";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title="Your Event, Documented Without Drama"
        subtitle="Corporate Event Coverage™"
        description="You have enough to manage. Photography shouldn't add to your stress. We show up prepared, work invisibly, and deliver assets you can actually use—on time and on brand."
        image="/images/generated/service-event-coverage.jpg"
        imageAlt="Professional event photography at corporate conference"
        backLink={{ text: "Back to Services", href: "/services" }}
      />

      {/* The JHR Difference */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div>
                <EditableText
                  pageId={pageId}
                  sectionId="difference"
                  contentKey="title"
                  defaultValue="What Makes JHR Different"
                  as="h2"
                  className="text-display-sm font-display font-bold text-jhr-white mb-6"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="difference"
                  contentKey="description1"
                  defaultValue="Most photographers show up, shoot, and leave you waiting weeks for images. We operate differently. Our background in high-stakes operations means we bring agency-grade planning, redundant equipment, and professional protocols to every event."
                  as="p"
                  className="text-body-lg text-jhr-white-muted mb-6"
                  contentType="paragraph"
                  multiline
                />
                <EditableText
                  pageId={pageId}
                  sectionId="difference"
                  contentKey="description2"
                  defaultValue="We communicate in the language of event professionals—EAC forms, marshaling yards, load-in schedules. We know Nashville's venues inside and out. We're not just a creative service; we're a logistics partner who happens to deliver exceptional photography."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-6"
                  contentType="paragraph"
                  multiline
                />
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6">
                  <EditableText
                    pageId={pageId}
                    sectionId="difference"
                    contentKey="testimonial"
                    defaultValue="JHR showed up 2 hours before load-in, knew exactly where to park, and had already coordinated with the venue. That never happens with photographers."
                    as="p"
                    className="text-body-md text-jhr-white italic"
                    contentType="testimonial"
                    multiline
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="difference"
                    contentKey="testimonialAuthor"
                    defaultValue="— Event Director, National Association"
                    as="p"
                    className="text-body-sm text-jhr-gold mt-4"
                    contentType="paragraph"
                  />
                </div>
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="space-y-4">
                {deliverables.map((item, index) => (
                  <div
                    key={item.title}
                    className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-jhr-gold" />
                      </div>
                      <div>
                        <EditableText
                          pageId={pageId}
                          sectionId="deliverables"
                          contentKey={`deliverable${index}-title`}
                          defaultValue={item.title}
                          as="h3"
                          className="text-heading-md font-semibold text-jhr-white mb-1"
                          contentType="heading"
                        />
                        <EditableText
                          pageId={pageId}
                          sectionId="deliverables"
                          contentKey={`deliverable${index}-description`}
                          defaultValue={item.description}
                          as="p"
                          className="text-body-sm text-jhr-white-dim"
                          contentType="paragraph"
                          multiline
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div>
                <EditableText
                  pageId={pageId}
                  sectionId="coverage"
                  contentKey="title"
                  defaultValue="What We Cover"
                  as="h2"
                  className="text-display-sm font-display font-bold text-jhr-white mb-6"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="coverage"
                  contentKey="description"
                  defaultValue="We work from your priorities. Before the event, we'll review your shot list, identify must-capture moments, and align on what success looks like. Then we execute—methodically and without drama."
                  as="p"
                  className="text-body-lg text-jhr-white-muted mb-8"
                  contentType="paragraph"
                  multiline
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  {coverageAreas.map((area, index) => (
                    <div key={area} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-jhr-gold flex-shrink-0" />
                      <EditableText
                        pageId={pageId}
                        sectionId="coverage"
                        contentKey={`area-${index}`}
                        defaultValue={area}
                        as="span"
                        className="text-body-sm text-jhr-white"
                        contentType="feature"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "/images/generated/event-keynote.jpg",
                  "/images/generated/event-networking.jpg",
                  "/images/generated/event-awards-ceremony.jpg",
                  "/images/generated/event-trade-show.jpg",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] relative rounded-lg overflow-hidden"
                  >
                    <EditableImage
                      pageId={pageId}
                      sectionId="coverage"
                      contentKey={`image-${i}`}
                      defaultSrc={src}
                      alt={`Event photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="process"
                contentKey="title"
                defaultValue="Our Process"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="process"
                contentKey="subtitle"
                defaultValue="Clear, professional, and designed around your needs."
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>

          <div className="max-w-4xl mx-auto">
            <StaggerContainer className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Strategy Call",
                  description:
                    "We discuss your event, venue, priorities, and expectations. No pressure, no hard sell—just a conversation to see if we're a good fit.",
                },
                {
                  step: "02",
                  title: "Pre-Event Planning",
                  description:
                    "We review your shot list, coordinate with venue contacts, and finalize logistics. You'll know exactly what to expect.",
                },
                {
                  step: "03",
                  title: "Day-Of Execution",
                  description:
                    "We arrive early, work invisibly, and capture everything on your list—plus the candid moments you didn't anticipate.",
                },
                {
                  step: "04",
                  title: "Delivery",
                  description:
                    "Same-day highlights within hours. Full edited gallery within 5-7 days. All images formatted and ready for use.",
                },
              ].map((item, index) => (
                <StaggerItem key={item.step}>
                  <div className="flex gap-6 items-start bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6">
                    <span className="text-jhr-gold font-display font-bold text-heading-lg">
                      {item.step}
                    </span>
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId="process"
                        contentKey={`step${item.step}-title`}
                        defaultValue={item.title}
                        as="h3"
                        className="text-heading-md font-semibold text-jhr-white mb-2"
                        contentType="heading"
                      />
                      <EditableText
                        pageId={pageId}
                        sectionId="process"
                        contentKey={`step${item.step}-description`}
                        defaultValue={item.description}
                        as="p"
                        className="text-body-md text-jhr-white-dim"
                        contentType="paragraph"
                        multiline
                      />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <EditableText
                pageId={pageId}
                sectionId="faqs"
                contentKey="title"
                defaultValue="Frequently Asked Questions"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
                contentType="heading"
              />
            </FadeUp>
            <StaggerContainer className="space-y-6">
              {faqs.map((faq, index) => (
                <StaggerItem key={index}>
                  <div className="card">
                    <EditableText
                      pageId={pageId}
                      sectionId="faqs"
                      contentKey={`faq${index}-question`}
                      defaultValue={faq.question}
                      as="h3"
                      className="text-heading-md font-semibold text-jhr-white mb-3"
                      contentType="heading"
                    />
                    <EditableText
                      pageId={pageId}
                      sectionId="faqs"
                      contentKey={`faq${index}-answer`}
                      defaultValue={faq.answer}
                      as="p"
                      className="text-body-md text-jhr-white-dim"
                      contentType="paragraph"
                      multiline
                    />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId={pageId}
            sectionId="cta"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/venue-hotel-ballroom.jpg"
            alt="Corporate event venue"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <FadeUp>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="title"
              defaultValue="Let's Discuss Your Event"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-6"
              contentType="heading"
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="description"
              defaultValue="Every event is different. Schedule a call and we'll talk through your venue, timeline, and specific needs. No obligation—just a conversation."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
              contentType="paragraph"
              multiline
            />
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link href="/schedule" className="btn-primary text-lg px-10 py-4">
              Schedule a Strategy Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
