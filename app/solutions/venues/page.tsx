"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Building,
  Users,
  Star,
  Clock,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimation";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";

const venueNeeds = [
  {
    icon: Building,
    title: "Venue-Aware Professionals",
    description:
      "Photographers who understand your space, your policies, and your operational requirements. No explaining the basics.",
  },
  {
    icon: Clock,
    title: "Reliable Recommendations",
    description:
      "When you recommend a vendor, your reputation is on the line. You need photographers who will show up, perform, and make you look good.",
  },
  {
    icon: Users,
    title: "Easy Coordination",
    description:
      "Vendors who handle their own paperwork, know your staff, and work seamlessly with your AV and catering teams.",
  },
  {
    icon: Star,
    title: "Consistent Quality",
    description:
      "Every client should receive the same professional experience. No variance based on which photographer happens to be available.",
  },
];

const benefits = [
  "Fully insured and EAC-compliant",
  "Knowledge of your specific venue and spaces",
  "Professional appearance and conduct",
  "Clear communication and reliable timing",
  "Images that showcase your venue beautifully",
  "Coordination with your operations team",
];

const faqs = [
  {
    question: "Are you familiar with venue vendor requirements?",
    answer:
      "Yes. We understand EAC processes, insurance requirements, load-in procedures, and union considerations for Nashville's major venues. We handle our paperwork and coordinate with venue contacts as needed.",
  },
  {
    question: "Can you be added to our preferred vendor list?",
    answer:
      "Absolutely. We'd welcome the opportunity to discuss our qualifications and how we can serve your clients. We can provide insurance certificates, references, and portfolio samples.",
  },
  {
    question: "How do you coordinate with venue staff?",
    answer:
      "We arrive early, introduce ourselves to key personnel, and establish clear communication protocols. We're experienced working alongside AV teams, catering staff, and venue operations. We fit into your ecosystem—not the other way around.",
  },
  {
    question: "What if a client needs last-minute photography?",
    answer:
      "We understand events change. While we prefer advance booking, we can often accommodate last-minute needs. Contact us and we'll do our best to help your client.",
  },
  {
    question: "Do you photograph the venue itself for marketing purposes?",
    answer:
      "Yes. We can provide venue photography for your marketing materials—both empty space documentation and event-in-progress images that show your venue at its best.",
  },
];

// ICP Page Schema
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Photography Services for Venue Coordinators",
  description:
    "JHR Photography partners with Nashville venues as a preferred photography vendor.",
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

export default function VenueCoordinatorsPage() {
  const pageId = "solutions-venues";

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
            defaultSrc="/images/generated/venue-interior.jpg"
            alt="Event venue interior"
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
              defaultValue="For Venue Coordinators"
              as="p"
              className="text-jhr-gold font-medium text-body-lg mb-4"
              contentType="tagline"
            />
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="title"
              defaultValue="A Photography Partner Who Knows Your Space"
              as="h1"
              className="text-display-lg font-display font-bold text-jhr-white mb-6"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="description"
              defaultValue="When clients ask for photography recommendations, you need vendors you can trust. JHR Photography understands venue operations, respects your protocols, and consistently delivers quality that reflects well on everyone involved."
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
                Request Vendor Information
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Venues Need */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="needs"
              contentKey="title"
              defaultValue="What Venues Need from Photography Partners"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="needs"
              contentKey="subtitle"
              defaultValue="Your preferred vendor list reflects your standards. Every recommendation is a reflection of your judgment."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {venueNeeds.map((need, index) => (
              <StaggerItem key={need.title}>
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                      <need.icon className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId="needs"
                        contentKey={`need${index}-title`}
                        defaultValue={need.title}
                        as="h3"
                        className="text-heading-md font-semibold text-jhr-white mb-2"
                        contentType="heading"
                      />
                      <EditableText
                        pageId={pageId}
                        sectionId="needs"
                        contentKey={`need${index}-description`}
                        defaultValue={need.description}
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

      {/* Why JHR */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText
                pageId={pageId}
                sectionId="why-jhr"
                contentKey="title"
                defaultValue="Why Partner with JHR"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-6"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="why-jhr"
                contentKey="description1"
                defaultValue="We've worked extensively at Nashville's premier venues—Music City Center, Gaylord Opryland, the downtown hotels. We understand the operational realities, the lighting challenges, and the expectations."
                as="p"
                className="text-body-lg text-jhr-white-muted mb-6"
                contentType="paragraph"
                multiline
              />
              <EditableText
                pageId={pageId}
                sectionId="why-jhr"
                contentKey="description2"
                defaultValue="When you recommend JHR, you're recommending a team that will represent your venue well. We show up professional, work invisibly, and deliver images that make your space look its best."
                as="p"
                className="text-body-md text-jhr-white-dim mb-6"
                contentType="paragraph"
                multiline
              />
              <Link
                href="/venues"
                className="text-jhr-gold hover:text-jhr-gold-light transition-colors font-medium flex items-center gap-2"
              >
                View our venue experience
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="bg-jhr-black border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  pageId={pageId}
                  sectionId="why-jhr"
                  contentKey="benefitsTitle"
                  defaultValue="What We Offer"
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
                        sectionId="why-jhr"
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
              defaultValue="Professional photography solutions for events at your venue."
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
                  defaultValue="Event Coverage"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service1-description"
                  defaultValue="Comprehensive photography for conferences, galas, and corporate events. Same-day highlights available."
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
                  defaultValue="High-volume professional headshots for trade shows and conferences. Great sponsor activation option."
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
                  defaultValue="Event Video"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service3-description"
                  defaultValue="Keynote capture, highlight reels, and testimonials. Professional video that extends event value."
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
              <div className="card">
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service4-title"
                  defaultValue="Venue Photography"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white mb-2"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="services"
                  contentKey="service4-description"
                  defaultValue="Professional documentation of your spaces for marketing materials. Empty spaces and events-in-progress."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-4"
                  contentType="paragraph"
                />
                <Link
                  href="/contact"
                  className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium"
                >
                  Contact us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Venue Portfolio */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="portfolio"
              contentKey="title"
              defaultValue="Our Nashville Venue Experience"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="portfolio"
              contentKey="subtitle"
              defaultValue="We know Nashville's event spaces inside and out."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Music City Center", slug: "music-city-center" },
              { name: "Gaylord Opryland", slug: "gaylord-opryland" },
              { name: "Omni Hotel", slug: "omni-hotel-nashville" },
              { name: "JW Marriott", slug: "jw-marriott-nashville" },
              { name: "Renaissance Hotel", slug: "renaissance-hotel-nashville" },
              { name: "Embassy Suites", slug: "embassy-suites-nashville" },
              { name: "City Winery", slug: "city-winery-nashville" },
              { name: "Belmont University", slug: "belmont-university" },
            ].map((venue) => (
              <StaggerItem key={venue.slug}>
                <Link
                  href={`/venues/${venue.slug}`}
                  className="bg-jhr-black border border-jhr-black-lighter rounded-lg p-4 hover:border-jhr-gold transition-colors text-center"
                >
                  <p className="text-body-md font-medium text-jhr-white">
                    {venue.name}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black">
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
            defaultSrc="/images/generated/nashville-venue.jpg"
            alt="Nashville venue"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <EditableText
            pageId={pageId}
            sectionId="cta"
            contentKey="title"
            defaultValue="Let's Discuss a Partnership"
            as="h2"
            className="text-display-sm font-display font-bold text-jhr-white mb-6"
            contentType="heading"
          />
          <EditableText
            pageId={pageId}
            sectionId="cta"
            contentKey="description"
            defaultValue="Schedule a conversation about adding JHR to your preferred vendor list. We're happy to provide credentials, references, and portfolio samples."
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
