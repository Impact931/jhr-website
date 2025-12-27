"use client";

import Link from "next/link";
import { ArrowRight, Camera, Users, Video, Building } from "lucide-react";
import { EditablePageHero } from "@/components/editor/EditablePageHero";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollAnimation";

const services = [
  {
    icon: Camera,
    name: "Headshot Activation™",
    slug: "headshot-activation",
    tagline: "Turn your booth into a destination",
    description:
      "High-engagement headshot stations that drive traffic, extend dwell time, and deliver qualified leads. AI-accelerated delivery puts branded assets in attendees' hands in seconds.",
    outcomes: [
      "300+ attendees processed per day",
      "5-minute average dwell time",
      "Real-time lead capture",
      "Instant branded delivery",
    ],
    ideal: "Trade shows, conferences, corporate events",
    image: "/images/generated/service-headshot-activation.jpg",
  },
  {
    icon: Building,
    name: "Corporate Event Coverage™",
    slug: "corporate-event-coverage",
    tagline: "Comprehensive documentation with zero friction",
    description:
      "Professional event photography that captures the energy, engagement, and key moments of your event. Multi-day capabilities with same-day delivery options.",
    outcomes: [
      "Multi-day coverage",
      "Same-day highlights available",
      "Brand-aligned selection",
      "Full usage rights included",
    ],
    ideal: "Conferences, galas, product launches, corporate meetings",
    image: "/images/generated/service-event-coverage.jpg",
  },
  {
    icon: Users,
    name: "Corporate Headshot Program™",
    slug: "corporate-headshot-program",
    tagline: "Consistent, on-brand team imagery",
    description:
      "We come to your office and deliver polished, consistent headshots for your entire team. Perfect for website updates, LinkedIn refreshes, and marketing materials.",
    outcomes: [
      "On-site at your location",
      "Consistent look across team",
      "AI-retouched images",
      "LinkedIn-ready files",
    ],
    ideal: "Law firms, real estate teams, corporate offices",
    image: "/images/generated/service-corporate-headshots.jpg",
  },
  {
    icon: Video,
    name: "Event Video Systems™",
    slug: "event-video-systems",
    tagline: "Motion and emotion, captured professionally",
    description:
      "From keynote documentation to social-ready highlight reels, we deliver video content that extends your event's impact far beyond the venue.",
    outcomes: [
      "Keynote capture",
      "Social-ready clips",
      "Highlight reels",
      "Professional editing",
    ],
    ideal: "Conferences, product launches, corporate communications",
    image: "/images/generated/service-event-video.jpg",
  },
];

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId="services"
        title="Outcome-Based Media Systems"
        subtitle="Our Services"
        description="We don't sell hours or photographers. We deliver complete media systems designed for specific business outcomes. Each service removes friction, drives engagement, and delivers measurable results."
        image="/images/generated/hero-services.jpg"
        imageAlt="Professional photographer at corporate event"
      />

      {/* Services Grid */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <StaggerContainer className="grid gap-8">
            {services.map((service, index) => (
              <StaggerItem key={service.slug}>
                <div className="card grid lg:grid-cols-3 gap-8 items-start overflow-hidden">
                  {/* Service Image */}
                  <div className="lg:col-span-1 relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[200px] -m-6 lg:m-0 lg:-ml-6 lg:-my-6">
                    <EditableImage
                      pageId="services"
                      sectionId={`service-${service.slug}`}
                      contentKey="image"
                      defaultSrc={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-jhr-black-light lg:bg-gradient-to-l z-10" />
                  </div>

                  <div className="lg:col-span-2 pt-6 lg:pt-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-jhr-gold" />
                      </div>
                      <div>
                        <EditableText
                          pageId="services"
                          sectionId={`service-${service.slug}`}
                          contentKey="name"
                          defaultValue={service.name}
                          as="h2"
                          className="text-heading-lg font-semibold text-jhr-white"
                          contentType="heading"
                        />
                        <EditableText
                          pageId="services"
                          sectionId={`service-${service.slug}`}
                          contentKey="tagline"
                          defaultValue={service.tagline}
                          as="p"
                          className="text-body-sm text-jhr-gold"
                          contentType="tagline"
                        />
                      </div>
                    </div>
                    <EditableText
                      pageId="services"
                      sectionId={`service-${service.slug}`}
                      contentKey="description"
                      defaultValue={service.description}
                      as="p"
                      className="text-body-md text-jhr-white-muted mb-4"
                      contentType="paragraph"
                      multiline
                    />
                    <p className="text-body-sm text-jhr-white-dim mb-6">
                      <strong className="text-jhr-white-muted">Ideal for:</strong>{" "}
                      <EditableText
                        pageId="services"
                        sectionId={`service-${service.slug}`}
                        contentKey="ideal"
                        defaultValue={service.ideal}
                        as="span"
                        contentType="paragraph"
                      />
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <Link
                        href={`/services/${service.slug}`}
                        className="btn-primary"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                      <div className="text-body-sm text-jhr-white-dim">
                        <span className="text-jhr-gold font-medium">What You Get:</span>
                        <ul className="mt-2 space-y-1">
                          {service.outcomes.slice(0, 2).map((outcome, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-jhr-gold" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-jhr-black-light relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId="services"
            sectionId="cta"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/event-networking.jpg"
            alt="Corporate networking event"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-jhr-black-light via-jhr-black-light/95 to-jhr-black-light z-10" />
        </div>
        <div className="section-container text-center relative z-20">
          <FadeUp>
            <EditableText
              pageId="services"
              sectionId="cta"
              contentKey="title"
              defaultValue="Not Sure Which Service Fits?"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <EditableText
              pageId="services"
              sectionId="cta"
              contentKey="description"
              defaultValue="Let's talk through your event and goals. We'll help you identify the right approach—no pressure, no hard sell."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
              contentType="paragraph"
              multiline
            />
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link href="/schedule" className="btn-primary text-lg px-8 py-4">
              Schedule a Strategy Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
