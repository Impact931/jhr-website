"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  Calendar,
  ImageIcon,
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

const benefits = [
  {
    icon: Building2,
    title: "On-Site Convenience",
    description:
      "We come to you. Our mobile studio sets up in your office, minimizing disruption and maximizing participation.",
  },
  {
    icon: Users,
    title: "Scalable for Any Team",
    description:
      "From executive teams of 10 to organizations of 500+. Same quality, same consistency, regardless of size.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Half-day, full-day, or multi-day sessions based on your team size. We work around your operational needs.",
  },
  {
    icon: ImageIcon,
    title: "Consistent Brand Standards",
    description:
      "Every headshot matches your brand guidelines—same lighting, same background, same professional look across your entire organization.",
  },
];

const outcomes = [
  "Unified professional image across all platforms",
  "Updated headshots for website, LinkedIn, and internal directories",
  "Consistent brand representation at scale",
  "Minimal disruption to daily operations",
  "Quick turnaround with professional editing",
];

const faqs = [
  {
    question: "How long does each session take per person?",
    answer:
      "Each individual session takes approximately 10-15 minutes, including setup, multiple poses, and on-screen selection. We schedule in slots to keep things moving smoothly without rushing anyone.",
  },
  {
    question: "Can you match our existing brand guidelines?",
    answer:
      "Absolutely. Before the session, we'll review your brand standards—preferred backgrounds, lighting style, and any specific requirements. Every headshot will align with your established look.",
  },
  {
    question: "What if some team members can't make the scheduled day?",
    answer:
      "We plan for this. We can schedule makeup sessions, and our consistent setup means additional photos will match perfectly with the original batch.",
  },
  {
    question: "How quickly do we receive the final images?",
    answer:
      "Edited headshots are typically delivered within 5-7 business days. For larger organizations or rush needs, we can discuss expedited timelines.",
  },
  {
    question: "What space do you need for the setup?",
    answer:
      "A room or area approximately 15x15 feet works well. We bring all equipment—lights, backdrop, and everything else. You just provide the space and the people.",
  },
];

export default function CorporateHeadshotProgramPage() {
  const pageId = "services-corporate-headshot-program";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title="Professional Headshots for Your Entire Team"
        subtitle="Corporate Headshot Program™"
        description="Outdated headshots undermine credibility. Inconsistent photos fragment your brand. We bring a professional studio to your office and deliver consistent, polished headshots that represent your organization at its best."
        image="/images/generated/service-corporate-headshots.jpg"
        imageAlt="Corporate headshot session in office"
        backLink={{ text: "Back to Services", href: "/services" }}
      />

      {/* Problem / Solution */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div>
                <EditableText
                  pageId={pageId}
                  sectionId="problem"
                  contentKey="title"
                  defaultValue="The Problem with DIY Headshots"
                  as="h2"
                  className="text-display-sm font-display font-bold text-jhr-white mb-6"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="problem"
                  contentKey="description1"
                  defaultValue='Half your team has photos from 2018. Some used their phone camera. Others cropped vacation photos. Your "About" page looks like a random collection of LinkedIn selfies instead of a professional organization.'
                  as="p"
                  className="text-body-lg text-jhr-white-muted mb-6"
                  contentType="paragraph"
                  multiline
                />
                <EditableText
                  pageId={pageId}
                  sectionId="problem"
                  contentKey="description2"
                  defaultValue="First impressions matter. Clients, partners, and prospects make judgments in seconds. Inconsistent headshots signal disorganization. Unified, professional photos signal a company that has its act together."
                  as="p"
                  className="text-body-md text-jhr-white-dim"
                  contentType="paragraph"
                  multiline
                />
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  pageId={pageId}
                  sectionId="problem"
                  contentKey="outcomesTitle"
                  defaultValue="What You Get"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-gold mb-6"
                  contentType="heading"
                />
                <ul className="space-y-4">
                  {outcomes.map((outcome, index) => (
                    <li key={outcome} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-jhr-gold mt-0.5 flex-shrink-0" />
                      <EditableText
                        pageId={pageId}
                        sectionId="problem"
                        contentKey={`outcome-${index}`}
                        defaultValue={outcome}
                        as="span"
                        className="text-body-md text-jhr-white"
                        contentType="feature"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="benefits"
                contentKey="title"
                defaultValue="How It Works"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="benefits"
                contentKey="subtitle"
                defaultValue="A turnkey solution designed for busy organizations."
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={benefit.title}>
                <div className="card h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId="benefits"
                        contentKey={`benefit${index}-title`}
                        defaultValue={benefit.title}
                        as="h3"
                        className="text-heading-md font-semibold text-jhr-white mb-2"
                        contentType="heading"
                      />
                      <EditableText
                        pageId={pageId}
                        sectionId="benefits"
                        contentKey={`benefit${index}-description`}
                        defaultValue={benefit.description}
                        as="p"
                        className="text-body-md text-jhr-white-dim"
                        contentType="paragraph"
                        multiline
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <EditableText
                pageId={pageId}
                sectionId="process"
                contentKey="title"
                defaultValue="The Process"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
                contentType="heading"
              />
            </FadeUp>

            <StaggerContainer className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Discovery & Planning",
                  description:
                    "We discuss your team size, brand guidelines, and scheduling needs. We'll create a detailed plan that minimizes disruption.",
                },
                {
                  step: "02",
                  title: "Schedule Coordination",
                  description:
                    "We work with your team to create a session schedule. Each person books a convenient time slot—no chaos, no confusion.",
                },
                {
                  step: "03",
                  title: "On-Site Sessions",
                  description:
                    "We set up our mobile studio in your space. Team members cycle through for their sessions—quick, professional, and painless.",
                },
                {
                  step: "04",
                  title: "Editing & Delivery",
                  description:
                    "Professional editing ensures every photo meets your brand standards. Delivered in all formats you need within 5-7 days.",
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

      {/* Sample Grid */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="gallery"
                contentKey="title"
                defaultValue="Consistent Quality at Scale"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="gallery"
                contentKey="subtitle"
                defaultValue="Every headshot maintains the same professional standard—regardless of team size."
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "/images/generated/gallery-headshot-1.jpg",
              "/images/generated/gallery-headshot-2.jpg",
              "/images/generated/gallery-headshot-3.jpg",
              "/images/generated/gallery-headshot-1.jpg",
              "/images/generated/gallery-headshot-2.jpg",
              "/images/generated/gallery-headshot-3.jpg",
              "/images/generated/gallery-headshot-1.jpg",
              "/images/generated/gallery-headshot-2.jpg",
            ].map((src, i) => (
              <StaggerItem key={i}>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                  <EditableImage
                    pageId={pageId}
                    sectionId="gallery"
                    contentKey={`image-${i}`}
                    defaultSrc={src}
                    alt={`Headshot ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black">
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
            defaultSrc="/images/generated/venue-conference-room.jpg"
            alt="Corporate conference room"
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
              defaultValue="Ready to Update Your Team's Image?"
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
              defaultValue="Let's discuss your organization's needs. We'll create a custom plan that fits your schedule and delivers consistent, professional results."
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
