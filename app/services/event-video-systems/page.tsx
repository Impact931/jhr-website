"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Video,
  Mic,
  Film,
  Share2,
  Play,
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

const services = [
  {
    icon: Video,
    title: "Keynote Capture",
    description:
      "Multi-camera coverage of your keynotes and general sessions. Professional audio capture ensures every word comes through clearly.",
  },
  {
    icon: Film,
    title: "Highlight Reels",
    description:
      "Condensed event stories that capture the energy and key moments. Perfect for social media, stakeholder reports, and next year's promotion.",
  },
  {
    icon: Mic,
    title: "Attendee Testimonials",
    description:
      "On-site testimonial capture with professional lighting and sound. Real voices telling real stories about your event's impact.",
  },
  {
    icon: Share2,
    title: "Social-Ready Clips",
    description:
      "Short-form content optimized for LinkedIn, Instagram, and other platforms. Delivered in formats ready for immediate posting.",
  },
];

const outcomes = [
  "Extended event ROI through lasting video content",
  "Professional keynote archives for internal use",
  "Compelling promotional material for future events",
  "Authentic testimonials for marketing campaigns",
  "Social content that drives engagement and reach",
];

const faqs = [
  {
    question: "Can you add video to our photography package?",
    answer:
      "Yes. Video can be added to any photography package or booked independently. Many clients start with event coverage photography and add video for key elements like keynotes or testimonials.",
  },
  {
    question: "How quickly can we receive the highlight reel?",
    answer:
      "Standard turnaround for highlight reels is 2-3 weeks. For events requiring faster delivery, we offer expedited editing—discuss your timeline during our strategy call.",
  },
  {
    question: "What's included in keynote capture?",
    answer:
      "Multi-camera coverage (typically 2-3 cameras), professional audio capture from the venue feed plus backup recording, and basic editing including intro/outro, lower thirds, and clean cuts.",
  },
  {
    question: "Do you bring your own audio equipment?",
    answer:
      "We connect to your venue's audio feed for the cleanest sound, but always bring backup recording equipment. For testimonials and interviews, we use professional wireless microphones.",
  },
  {
    question: "What formats do you deliver in?",
    answer:
      "Standard delivery includes high-resolution files for archival, web-optimized versions for your site, and platform-specific exports for social media (LinkedIn, Instagram, YouTube, etc.).",
  },
];

export default function EventVideoSystemsPage() {
  const pageId = "services-event-video-systems";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title="Your Event Deserves More Than Photos"
        subtitle="Event Video Systems™"
        description="Great events end. Great video extends their impact. Capture keynotes for training libraries, testimonials for marketing, and highlights that promote next year's event before this one's even over."
        image="/images/generated/service-event-video.jpg"
        imageAlt="Professional video production at corporate event"
        backLink={{ text: "Back to Services", href: "/services" }}
      />

      {/* The Value of Video */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div>
                <EditableText
                  pageId={pageId}
                  sectionId="value"
                  contentKey="title"
                  defaultValue="Why Event Video Matters"
                  as="h2"
                  className="text-display-sm font-display font-bold text-jhr-white mb-6"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="value"
                  contentKey="description1"
                  defaultValue="You spend months planning an event. Attendees experience it for a few days. Then it's over. Video changes that equation."
                  as="p"
                  className="text-body-lg text-jhr-white-muted mb-6"
                  contentType="paragraph"
                  multiline
                />
                <EditableText
                  pageId={pageId}
                  sectionId="value"
                  contentKey="description2"
                  defaultValue="A well-produced highlight reel becomes next year's promotional tool. Keynote recordings become training content. Testimonials become marketing assets. The event ends, but its value continues."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-6"
                  contentType="paragraph"
                  multiline
                />
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6">
                  <EditableText
                    pageId={pageId}
                    sectionId="value"
                    contentKey="outcomesTitle"
                    defaultValue="What You Get"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-gold mb-4"
                    contentType="heading"
                  />
                  <ul className="space-y-3">
                    {outcomes.map((outcome, index) => (
                      <li key={outcome} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-jhr-gold mt-0.5 flex-shrink-0" />
                        <EditableText
                          pageId={pageId}
                          sectionId="value"
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
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="aspect-video relative rounded-xl overflow-hidden">
                <EditableImage
                  pageId={pageId}
                  sectionId="value"
                  contentKey="image"
                  defaultSrc="/images/generated/event-keynote.jpg"
                  alt="Keynote presentation being recorded"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <div className="w-20 h-20 rounded-full bg-jhr-gold/90 flex items-center justify-center cursor-pointer hover:bg-jhr-gold transition-colors">
                    <Play className="w-8 h-8 text-jhr-black ml-1" />
                  </div>
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="services"
                contentKey="title"
                defaultValue="Video Services"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="services"
                contentKey="subtitle"
                defaultValue="Each service can be added individually or combined for comprehensive coverage."
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <StaggerItem key={service.title}>
                <div className="card h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId="services"
                        contentKey={`service${index}-title`}
                        defaultValue={service.title}
                        as="h3"
                        className="text-heading-md font-semibold text-jhr-white mb-2"
                        contentType="heading"
                      />
                      <EditableText
                        pageId={pageId}
                        sectionId="services"
                        contentKey={`service${index}-description`}
                        defaultValue={service.description}
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

      {/* Use Cases */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="useCases"
                contentKey="title"
                defaultValue="Common Applications"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="useCases"
                contentKey="subtitle"
                defaultValue="How organizations use event video to extend ROI."
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Internal Training",
                description:
                  "Keynote recordings become on-demand training for team members who couldn't attend. Build a library of leadership content.",
              },
              {
                title: "Event Promotion",
                description:
                  "This year's highlight reel sells next year's tickets. Show prospects exactly what they'll experience.",
              },
              {
                title: "Stakeholder Reporting",
                description:
                  "A 3-minute highlight reel communicates event success better than any slide deck. Show the board what happened.",
              },
            ].map((useCase, index) => (
              <StaggerItem key={index}>
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6 h-full">
                  <EditableText
                    pageId={pageId}
                    sectionId="useCases"
                    contentKey={`useCase${index}-title`}
                    defaultValue={useCase.title}
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-3"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="useCases"
                    contentKey={`useCase${index}-description`}
                    defaultValue={useCase.description}
                    as="p"
                    className="text-body-sm text-jhr-white-dim"
                    contentType="paragraph"
                    multiline
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <EditableText
                pageId={pageId}
                sectionId="process"
                contentKey="title"
                defaultValue="How We Work"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
                contentType="heading"
              />
            </FadeUp>

            <StaggerContainer className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Pre-Production",
                  description:
                    "We review your event schedule, identify key capture moments, and coordinate with your AV team on audio feeds and positioning.",
                },
                {
                  step: "02",
                  title: "On-Site Capture",
                  description:
                    "Our video team works alongside our photography team (if applicable), capturing footage throughout the event without disruption.",
                },
                {
                  step: "03",
                  title: "Post-Production",
                  description:
                    "Professional editing, color grading, audio mixing, and graphics. We deliver polished content ready for its intended use.",
                },
                {
                  step: "04",
                  title: "Delivery",
                  description:
                    "Files delivered in all formats you need—archival masters, web versions, and platform-specific exports for social media.",
                },
              ].map((item, index) => (
                <StaggerItem key={item.step}>
                  <div className="flex gap-6 items-start bg-jhr-black border border-jhr-black-lighter rounded-lg p-6">
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
            defaultSrc="/images/generated/event-awards-ceremony.jpg"
            alt="Corporate awards ceremony"
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
              defaultValue="Let's Discuss Your Video Needs"
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
              defaultValue="Every event has different video requirements. Schedule a call and we'll discuss what makes sense for your goals and budget."
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
