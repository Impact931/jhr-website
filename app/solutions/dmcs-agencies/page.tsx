"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  FileCheck,
  Users,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimation";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";

const painPoints = [
  {
    icon: Shield,
    title: "You Can't Afford Surprises",
    description:
      "Your reputation rides on every vendor you recommend. A photographer who shows up late, misses shots, or delivers inconsistent quality reflects directly on you.",
  },
  {
    icon: Clock,
    title: "Tight Timelines Are Normal",
    description:
      "You're often brought in late or dealing with shifting requirements. You need vendors who can adapt without drama.",
  },
  {
    icon: FileCheck,
    title: "Paperwork Matters",
    description:
      "EAC forms, insurance certificates, venue requirements—administrative compliance isn't optional, it's table stakes.",
  },
  {
    icon: Users,
    title: "Your Client Is Watching",
    description:
      "Every interaction with your vendors reflects on your professionalism. You need partners who represent you well.",
  },
];

const benefits = [
  "Consistent, repeatable execution across events",
  "Professional appearance and conduct at all times",
  "Complete paperwork compliance without reminders",
  "Flexible response to changing requirements",
  "Clear communication before, during, and after events",
  "Delivery timelines you can count on",
];

const faqs = [
  {
    question: "How do you handle EAC requirements?",
    answer:
      "We're experienced with Nashville's major venues and understand EAC (Exhibitor Appointed Contractor) processes completely. We handle our own paperwork, carry appropriate insurance, and coordinate directly with venue contacts as needed.",
  },
  {
    question: "Can you work on tight timelines?",
    answer:
      "Yes. We understand that DMCs often receive final requirements close to event dates. We can typically accommodate last-minute additions or changes as long as we have clear communication about priorities.",
  },
  {
    question: "Do you have experience with high-profile corporate clients?",
    answer:
      "Yes. We've worked with DMCs supporting Fortune 500 companies, national associations, and high-stakes corporate events. We understand discretion, professionalism, and the stakes involved.",
  },
  {
    question: "How do you handle communication during events?",
    answer:
      "We establish clear communication protocols before the event. You'll have direct contact with our lead photographer, and we provide updates as needed throughout the event without requiring constant oversight.",
  },
];

// ICP Page Schema
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Event Photography for DMCs & Agencies",
  description:
    "JHR Photography partners with DMCs and agencies managing corporate events in Nashville.",
  provider: {
    "@type": "Organization",
    name: "JHR Photography",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function DMCsAgenciesPage() {
  const pageId = "solutions-dmcs-agencies";

  return (
    <div className="pt-16 lg:pt-20">
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="section-padding bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId={pageId}
            sectionId="hero"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/corporate-event.jpg"
            alt="Corporate event"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="subtitle"
              defaultValue="For DMCs & Agencies"
              as="p"
              className="text-jhr-gold font-medium text-body-lg mb-4"
              contentType="tagline"
            />
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="title"
              defaultValue="Your Reputation Depends on Your Vendors"
              as="h1"
              className="text-display-lg font-display font-bold text-jhr-white mb-6"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="description"
              defaultValue="You've built trust over years. One unreliable vendor can damage that in a day. JHR Photography operates as an extension of your team—professional, prepared, and consistent every time."
              as="p"
              className="text-body-lg text-jhr-white-muted mb-8"
              contentType="paragraph"
              multiline
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schedule" className="btn-primary">
                Schedule a Strategy Call
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Request Information
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* We Understand */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="understand"
              contentKey="title"
              defaultValue="We Understand Your Reality"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="understand"
              contentKey="subtitle"
              defaultValue="Managing corporate events means managing countless details and stakeholders. Every vendor choice is a risk calculation."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {painPoints.map((point, index) => (
              <StaggerItem key={point.title}>
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                      <point.icon className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId="understand"
                        contentKey={`point${index}-title`}
                        defaultValue={point.title}
                        as="h3"
                        className="text-heading-md font-semibold text-jhr-white mb-2"
                        contentType="heading"
                      />
                      <EditableText
                        pageId={pageId}
                        sectionId="understand"
                        contentKey={`point${index}-description`}
                        defaultValue={point.description}
                        as="p"
                        className="text-body-md text-jhr-white-dim"
                        contentType="paragraph"
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText
                pageId={pageId}
                sectionId="partner"
                contentKey="title"
                defaultValue="A Partner, Not Just a Vendor"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-6"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="partner"
                contentKey="description1"
                defaultValue="JHR Photography was built by someone who understands operational pressure. Jayson's background in military logistics translates directly to event execution—meticulous planning, redundant systems, and calm under pressure."
                as="p"
                className="text-body-lg text-jhr-white-muted mb-6"
                contentType="paragraph"
                multiline
              />
              <EditableText
                pageId={pageId}
                sectionId="partner"
                contentKey="description2"
                defaultValue="When you recommend JHR to your clients, you're recommending a team that will represent you well. We show up in uniform, on time, prepared for anything. We communicate clearly and deliver on our promises."
                as="p"
                className="text-body-md text-jhr-white-dim mb-8"
                contentType="paragraph"
                multiline
              />
              <Link href="/about" className="text-jhr-gold hover:text-jhr-gold-light transition-colors font-medium flex items-center gap-2">
                Learn more about our approach
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="bg-jhr-black border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  pageId={pageId}
                  sectionId="partner"
                  contentKey="benefitsTitle"
                  defaultValue="What You Get"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-gold mb-6"
                  contentType="heading"
                />
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-jhr-gold mt-0.5 flex-shrink-0" />
                      <EditableText
                        pageId={pageId}
                        sectionId="partner"
                        contentKey={`benefit-${index}`}
                        defaultValue={benefit}
                        as="span"
                        className="text-body-md text-jhr-white"
                        contentType="feature"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="services"
              contentKey="title"
              defaultValue="Services for Your Clients"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="services"
              contentKey="subtitle"
              defaultValue="Outcome-based media systems that deliver measurable results."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <StaggerItem>
              <Link
                href="/services/corporate-event-coverage"
                className="card group"
              >
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service1-title"
                  defaultValue="Corporate Event Coverage"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service1-description"
                  defaultValue="Comprehensive documentation of conferences, trade shows, and corporate events. Same-day highlights available."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-4"
                  contentType="paragraph"
                />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/services/headshot-activation" className="card group">
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service2-title"
                  defaultValue="Headshot Activation"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service2-description"
                  defaultValue="High-volume professional headshots with instant delivery. Drive booth traffic and capture leads for your clients."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-4"
                  contentType="paragraph"
                />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/services/event-video-systems" className="card group">
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service3-title"
                  defaultValue="Event Video Systems"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service3-description"
                  defaultValue="Keynote capture, highlight reels, and testimonials that extend event ROI long after the venue clears."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-4"
                  contentType="paragraph"
                />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/venues" className="card group">
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service4-title"
                  defaultValue="Nashville Venue Expertise"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service4-description"
                  defaultValue="We know Music City Center, Gaylord Opryland, and every major venue. Our local knowledge reduces your logistics burden."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-4"
                  contentType="paragraph"
                />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium">
                  View venues <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <EditableText
              pageId={pageId}
              sectionId="faqs"
              contentKey="title"
              defaultValue="Common Questions"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
              contentType="heading"
            />
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
            defaultSrc="/images/generated/event-production.jpg"
            alt="Event production"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <EditableText
            pageId={pageId}
            sectionId="cta"
            contentKey="title"
            defaultValue="Let's Discuss Your Upcoming Events"
            as="h2"
            className="text-display-sm font-display font-bold text-jhr-white mb-6"
            contentType="heading"
          />
          <EditableText
            pageId={pageId}
            sectionId="cta"
            contentKey="description"
            defaultValue="Schedule a call and we'll talk through your client's needs. No pressure—just a conversation to see if we're a good fit for your preferred vendor list."
            as="p"
            className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
            contentType="paragraph"
            multiline
          />
          <Link href="/schedule" className="btn-primary text-lg px-10 py-4">
            Schedule a Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
