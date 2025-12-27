"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
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

const venues = [
  {
    name: "Music City Center",
    slug: "music-city-center",
    location: "Downtown Nashville",
    description:
      "Nashville's premier convention center. We know the marshaling yard procedures, the hand-carry policies, and every corner of this 2.1 million square foot facility.",
    features: ["Convention halls", "Ballrooms", "Expo spaces", "Meeting rooms"],
    image: "/images/generated/venue-music-city-center.jpg",
  },
  {
    name: "Gaylord Opryland",
    slug: "gaylord-opryland",
    location: "Music Valley",
    description:
      "A unique venue with challenging lighting conditions. We're EAC-ready and understand the strict vendor policies, atrium humidity, and mixed lighting environments.",
    features: ["Delta Atrium", "Ryman Exhibit Hall", "Ballrooms", "Gardens"],
    image: "/images/generated/venue-gaylord-opryland.jpg",
  },
  {
    name: "Renaissance Hotel",
    slug: "renaissance-hotel-nashville",
    location: "Downtown Nashville",
    description:
      "Connected to the Music City Center, the Renaissance offers seamless access for convention attendees. We coordinate across both properties effortlessly.",
    features: ["Grand ballroom", "Meeting spaces", "Convention access"],
    image: "/images/generated/venue-hotel-ballroom.jpg",
  },
  {
    name: "Omni Hotel",
    slug: "omni-hotel-nashville",
    location: "Downtown Nashville",
    description:
      "A luxury property in the heart of downtown. We understand the service expectations and deliver photography that matches the venue's standards.",
    features: ["Ballrooms", "Rooftop venues", "Executive spaces"],
    image: "/images/generated/venue-hotel-ballroom.jpg",
  },
  {
    name: "JW Marriott",
    slug: "jw-marriott-nashville",
    location: "Downtown Nashville",
    description:
      "Nashville's largest hotel with extensive event spaces. We've documented countless corporate events and galas in this premium property.",
    features: ["Grand ballroom", "Multiple meeting rooms", "Modern aesthetic"],
    image: "/images/generated/venue-hotel-ballroom.jpg",
  },
  {
    name: "Embassy Suites",
    slug: "embassy-suites-nashville",
    location: "Downtown Nashville",
    description:
      "A versatile property popular with corporate groups. We know the logistics and deliver consistent results across their event spaces.",
    features: ["Atrium", "Ballroom", "Conference rooms"],
    image: "/images/generated/venue-conference-room.jpg",
  },
  {
    name: "City Winery",
    slug: "city-winery-nashville",
    location: "Downtown Nashville",
    description:
      "A unique venue combining event space with dining and entertainment. We capture the energy and intimate atmosphere perfectly.",
    features: ["Main venue", "Barrel room", "Private dining"],
    image: "/images/generated/event-networking.jpg",
  },
  {
    name: "Belmont University",
    slug: "belmont-university",
    location: "Belmont/Hillsboro",
    description:
      "A beautiful campus with diverse event spaces. From academic conferences to corporate retreats, we know the campus and its possibilities.",
    features: ["Curb Event Center", "McAfee Concert Hall", "Campus venues"],
    image: "/images/generated/event-keynote.jpg",
  },
];

export default function VenuesPage() {
  const pageId = "venues";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title="We Know Nashville's Premier Venues"
        subtitle="Venue Fluency"
        description="When you're planning from out of state, you need a partner who knows the terrain. We've worked extensively at Nashville's top convention and event venues—we know the marshaling yards, the loading docks, the lighting challenges, and the people who run them."
        image="/images/generated/hero-venues.jpg"
        imageAlt="Nashville skyline at twilight"
      />

      {/* Why Venue Fluency Matters */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div className="max-w-xl">
                <EditableText
                  pageId={pageId}
                  sectionId="venueFluency"
                  contentKey="title"
                  defaultValue="Why Venue Fluency Matters"
                  as="h2"
                  className="text-display-sm font-display font-bold text-jhr-white mb-4"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="venueFluency"
                  contentKey="description"
                  defaultValue="Every venue has its quirks—unique lighting conditions, specific load-in procedures, vendor restrictions, and operational nuances. A photographer unfamiliar with these details creates risk for your event. We eliminate that risk by knowing Nashville's venues inside and out."
                  as="p"
                  className="text-body-lg text-jhr-white-muted"
                  contentType="paragraph"
                  multiline
                />
              </div>
            </SlideInLeft>

            <SlideInRight>
              <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-4">
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6">
                  <EditableText
                    pageId={pageId}
                    sectionId="venueFluency"
                    contentKey="feature1-title"
                    defaultValue="Logistics Mastery"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="venueFluency"
                    contentKey="feature1-description"
                    defaultValue="We know EAC requirements, marshaling yard procedures, and load-in protocols for each venue. No delays, no surprises."
                    as="p"
                    className="text-body-sm text-jhr-white-dim"
                    contentType="paragraph"
                  />
                </div>
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6">
                  <EditableText
                    pageId={pageId}
                    sectionId="venueFluency"
                    contentKey="feature2-title"
                    defaultValue="Lighting Knowledge"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="venueFluency"
                    contentKey="feature2-description"
                    defaultValue="From Gaylord's challenging atriums to convention center exhibit halls, we bring equipment calibrated to each environment."
                    as="p"
                    className="text-body-sm text-jhr-white-dim"
                    contentType="paragraph"
                  />
                </div>
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6">
                  <EditableText
                    pageId={pageId}
                    sectionId="venueFluency"
                    contentKey="feature3-title"
                    defaultValue="Relationship Network"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="venueFluency"
                    contentKey="feature3-description"
                    defaultValue="We know the venue staff, the preferred contractors, and the decision-makers. This network helps us solve problems fast."
                    as="p"
                    className="text-body-sm text-jhr-white-dim"
                    contentType="paragraph"
                  />
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <EditableText
              pageId={pageId}
              sectionId="venueGrid"
              contentKey="title"
              defaultValue="Our Venue Experience"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-8"
              contentType="heading"
            />
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {venues.map((venue, index) => (
              <StaggerItem key={venue.slug}>
                <Link
                  href={`/venues/${venue.slug}`}
                  className="card group block overflow-hidden"
                >
                  {/* Venue Image */}
                  <div className="relative h-48 -mx-6 -mt-6 mb-6">
                    <EditableImage
                      pageId={pageId}
                      sectionId={`venue-${venue.slug}`}
                      contentKey="image"
                      defaultSrc={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jhr-black-light via-transparent to-transparent z-10" />
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId={`venue-${venue.slug}`}
                        contentKey="name"
                        defaultValue={venue.name}
                        as="h3"
                        className="text-heading-lg font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors"
                        contentType="heading"
                      />
                      <div className="flex items-center gap-1 text-jhr-white-dim text-body-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        {venue.location}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-jhr-white-dim group-hover:text-jhr-gold group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <EditableText
                    pageId={pageId}
                    sectionId={`venue-${venue.slug}`}
                    contentKey="description"
                    defaultValue={venue.description}
                    as="p"
                    className="text-body-md text-jhr-white-dim mb-4"
                    contentType="paragraph"
                    multiline
                  />
                  <div className="flex flex-wrap gap-2">
                    {venue.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-body-sm text-jhr-white-muted bg-jhr-black-lighter px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-jhr-black relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-jhr-black via-jhr-black/95 to-jhr-black z-10" />
        </div>
        <div className="section-container text-center relative z-20">
          <FadeUp>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="title"
              defaultValue="Planning an Event at a Nashville Venue?"
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
              defaultValue="Let's discuss your event and venue. We'll share what we know about the space and how we can help ensure a smooth, successful execution."
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
