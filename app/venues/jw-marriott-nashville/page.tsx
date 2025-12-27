import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";

export const metadata: Metadata = {
  title: "JW Marriott Nashville | Corporate Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at the JW Marriott Nashville. We know Nashville's largest hotel and its extensive event spaces.",
  openGraph: {
    title: "JW Marriott Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the JW Marriott Nashville.",
  },
};

const venueDetails = {
  name: "JW Marriott Nashville",
  location: "Downtown Nashville",
  address: "201 8th Ave S, Nashville, TN 37203",
  description:
    "Nashville's largest hotel with over 500 rooms and extensive event facilities. The JW Marriott offers modern spaces, state-of-the-art technology, and premium service for corporate events of all sizes.",
};

const spaces = [
  "Grand Ballroom",
  "Junior Ballrooms",
  "Meeting rooms (30+)",
  "Executive boardrooms",
  "Pre-function areas",
  "Rooftop bar (private events)",
];

const ourExperience = [
  "Extensive experience in all major event spaces",
  "Knowledge of the hotel's modern lighting systems",
  "Coordination with JW Marriott events team",
  "Experience with large-scale corporate gatherings",
  "Understanding of multi-floor event logistics",
  "Familiarity with hotel operations and protocols",
];

const faqs = [
  {
    question: "What makes the JW Marriott good for photography?",
    answer:
      "The JW Marriott is a modern property with excellent built-in lighting in most spaces. The neutral decor provides clean backgrounds, and the large ballroom can accommodate substantial productions. It's one of the more photographer-friendly venues in Nashville.",
  },
  {
    question: "Can you handle large corporate events here?",
    answer:
      "Yes. The JW Marriott hosts some of Nashville's largest corporate gatherings. We plan coverage strategically, position team members across locations, and use the hotel's efficient layout to move quickly between spaces.",
  },
  {
    question: "How do you coordinate with hotel staff?",
    answer:
      "We establish clear communication with the hotel's events team before the event. We're familiar with their protocols, respect their operations, and work seamlessly alongside their staff.",
  },
];

// Venue Page Schema
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "JW Marriott Nashville",
  description: venueDetails.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "201 8th Ave S",
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

export default function JWMarriottPage() {
  const pageId = "venues-jw-marriott";

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
                [JW Marriott Venue Photography]
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
                Modern Venue, Proven Experience
              </EditableText>
              <EditableText
                as="p"
                sectionId="experience"
                contentKey="intro"
                className="text-body-lg text-jhr-white-muted mb-6"
              >
                The JW Marriott is one of Nashville's newest and most capable
                event properties. Its modern design, excellent lighting, and
                efficient layout make it a pleasure to photograph.
              </EditableText>
              <EditableText
                as="p"
                sectionId="experience"
                contentKey="description"
                className="text-body-md text-jhr-white-dim"
              >
                We've documented countless corporate events here—from intimate
                executive meetings to large-scale conferences. We know the
                spaces, we know the staff, and we deliver consistently
                excellent results.
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
            Services at JW Marriott Nashville
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
                Comprehensive documentation of corporate events in modern
                spaces.
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
                Professional headshots for conference activations.
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
                Keynotes, highlights, and testimonials.
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
              JW Marriott Nashville FAQs
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
            Planning an Event at JW Marriott Nashville?
          </EditableText>
          <EditableText
            as="p"
            sectionId="cta"
            contentKey="description"
            className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
          >
            Let's discuss your event and how we can deliver exceptional
            photography in this modern venue.
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
