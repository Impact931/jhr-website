import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";

export const metadata: Metadata = {
  title: "City Winery Nashville | Unique Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at City Winery Nashville. We capture the energy and intimate atmosphere of this unique entertainment venue.",
  openGraph: {
    title: "City Winery Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at City Winery Nashville.",
  },
};

const venueDetails = {
  name: "City Winery Nashville",
  location: "Downtown Nashville",
  address: "609 Lafayette St, Nashville, TN 37203",
  description:
    "A unique venue combining event space with dining and live entertainment. City Winery offers an intimate atmosphere that's perfect for corporate dinners, networking receptions, and special celebrations with Nashville character.",
};

const spaces = [
  "Main venue / music hall",
  "Barrel room",
  "Private dining rooms",
  "Restaurant space",
  "Outdoor patio",
];

const ourExperience = [
  "Expertise with low-light entertainment environments",
  "Understanding of the venue's intimate atmosphere",
  "Experience with corporate dinners and receptions",
  "Coordination with venue events staff",
  "Knowledge of best photo locations throughout the space",
];

const faqs = [
  {
    question: "How do you handle the low-light environment?",
    answer:
      "City Winery has moody, atmospheric lighting that creates ambiance—but challenges photographers. We bring professional equipment designed for low-light conditions and know how to capture the venue's character without disrupting the mood.",
  },
  {
    question: "Can you photograph during live performances?",
    answer:
      "Yes. We're experienced working around live entertainment. We position ourselves strategically, work quietly, and capture moments without interfering with the show or distracting guests.",
  },
  {
    question: "What about the barrel room for private events?",
    answer:
      "The barrel room is a unique space with beautiful character. We've photographed many private dinners and receptions there, and we know how to make the wine barrel backdrop work beautifully in photos.",
  },
];

// Venue Page Schema
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "City Winery Nashville",
  description: venueDetails.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "609 Lafayette St",
    addressLocality: "Nashville",
    addressRegion: "TN",
    postalCode: "37203",
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

export default function CityWineryPage() {
  const pageId = "venues-city-winery";

  return (
    <div className="pt-16 lg:pt-20">
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="section-padding bg-gradient-dark">
        <div className="section-container">
          <div className="max-w-3xl">
            <Link
              href="/venues"
              className="text-jhr-gold hover:text-jhr-gold-light transition-colors text-body-sm font-medium mb-4 inline-flex items-center gap-2"
            >
              ← Back to Venues
            </Link>
            <EditableText
              as="h1"
              sectionId="hero"
              contentKey="title"
              className="text-display-lg font-display font-bold text-jhr-white mb-4"
            >
              {venueDetails.name}
            </EditableText>
            <div className="flex items-center gap-2 text-jhr-white-muted mb-6">
              <MapPin className="w-5 h-5 text-jhr-gold" />
              <EditableText
                as="span"
                sectionId="hero"
                contentKey="location"
              >
                {venueDetails.location}
              </EditableText>
            </div>
            <EditableText
              as="p"
              sectionId="hero"
              contentKey="description"
              className="text-body-lg text-jhr-white-muted mb-8"
            >
              {venueDetails.description}
            </EditableText>
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

      {/* Venue Image Placeholder */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="aspect-[21/9] bg-jhr-black-light rounded-xl border border-jhr-black-lighter flex items-center justify-center">
            <div className="text-center">
              <Building className="w-16 h-16 text-jhr-gold mx-auto mb-4" />
              <p className="text-jhr-white-muted text-body-md">
                [City Winery Venue Photography]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Experience */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText
                as="h2"
                sectionId="experience"
                contentKey="heading"
                className="text-display-sm font-display font-bold text-jhr-white mb-6"
              >
                Capturing Nashville Character
              </EditableText>
              <EditableText
                as="p"
                sectionId="experience"
                contentKey="intro"
                className="text-body-lg text-jhr-white-muted mb-6"
              >
                City Winery isn't a typical corporate event space—it's a venue
                with personality. The wine, the music, the intimate atmosphere
                all contribute to a unique experience worth documenting.
              </EditableText>
              <EditableText
                as="p"
                sectionId="experience"
                contentKey="description"
                className="text-body-md text-jhr-white-dim"
              >
                We understand how to capture this character in photos. The
                moody lighting, the barrel room textures, the live
                performance energy—we preserve these elements while still
                delivering the professional documentation you need.
              </EditableText>
            </div>
            <div>
              <div className="bg-jhr-black border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  as="h3"
                  sectionId="experience"
                  contentKey="list-heading"
                  className="text-heading-lg font-semibold text-jhr-gold mb-6"
                >
                  Our Experience
                </EditableText>
                <ul className="space-y-4">
                  {ourExperience.map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-jhr-gold mt-0.5 flex-shrink-0" />
                      <EditableText
                        as="span"
                        sectionId="experience"
                        contentKey={`list-item-${index + 1}`}
                        className="text-body-md text-jhr-white"
                      >
                        {item}
                      </EditableText>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Spaces */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <EditableText
            as="h2"
            sectionId="spaces"
            contentKey="heading"
            className="text-display-sm font-display font-bold text-jhr-white mb-8"
          >
            Spaces We've Covered
          </EditableText>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {spaces.map((space, index) => (
              <div
                key={space}
                className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4"
              >
                <EditableText
                  as="p"
                  sectionId="spaces"
                  contentKey={`space-${index + 1}`}
                  className="text-body-md text-jhr-white"
                >
                  {space}
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <EditableText
            as="h2"
            sectionId="services"
            contentKey="heading"
            className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
          >
            Services at City Winery Nashville
          </EditableText>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/services/corporate-event-coverage" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <EditableText
                as="h3"
                sectionId="services"
                contentKey="service-1-title"
                className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
              >
                Event Coverage
              </EditableText>
              <EditableText
                as="p"
                sectionId="services"
                contentKey="service-1-description"
                className="text-body-sm text-jhr-white-dim"
              >
                Corporate dinners, receptions, and celebrations with Nashville
                flair.
              </EditableText>
            </Link>
            <Link href="/services/headshot-activation" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <EditableText
                as="h3"
                sectionId="services"
                contentKey="service-2-title"
                className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
              >
                Headshot Activation
              </EditableText>
              <EditableText
                as="p"
                sectionId="services"
                contentKey="service-2-description"
                className="text-body-sm text-jhr-white-dim"
              >
                Professional headshots during networking events and receptions.
              </EditableText>
            </Link>
            <Link href="/services/event-video-systems" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <EditableText
                as="h3"
                sectionId="services"
                contentKey="service-3-title"
                className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
              >
                Event Video
              </EditableText>
              <EditableText
                as="p"
                sectionId="services"
                contentKey="service-3-description"
                className="text-body-sm text-jhr-white-dim"
              >
                Highlights capturing the venue's unique atmosphere.
              </EditableText>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <EditableText
              as="h2"
              sectionId="faqs"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
            >
              City Winery Nashville FAQs
            </EditableText>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card">
                  <EditableText
                    as="h3"
                    sectionId="faqs"
                    contentKey={`faq-${index + 1}-question`}
                    className="text-heading-md font-semibold text-jhr-white mb-3"
                  >
                    {faq.question}
                  </EditableText>
                  <EditableText
                    as="p"
                    sectionId="faqs"
                    contentKey={`faq-${index + 1}-answer`}
                    className="text-body-md text-jhr-white-dim"
                  >
                    {faq.answer}
                  </EditableText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-dark">
        <div className="section-container text-center">
          <EditableText
            as="h2"
            sectionId="cta"
            contentKey="heading"
            className="text-display-sm font-display font-bold text-jhr-white mb-6"
          >
            Planning an Event at City Winery?
          </EditableText>
          <EditableText
            as="p"
            sectionId="cta"
            contentKey="description"
            className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
          >
            Let's discuss your event and how we can capture the unique
            character of this Nashville venue.
          </EditableText>
          <Link href="/schedule" className="btn-primary text-lg px-10 py-4">
            Schedule a Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
