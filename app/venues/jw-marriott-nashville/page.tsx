import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";

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
            <h1 className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4">
              {venueDetails.name}
            </h1>
            <div className="flex items-center gap-2 text-jhr-white-muted mb-6">
              <MapPin className="w-5 h-5 text-jhr-gold" />
              <span>{venueDetails.location}</span>
            </div>
            <p className="text-body-lg text-jhr-white-muted mb-8">
              {venueDetails.description}
            </p>
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
              <h2 className="text-display-sm font-display font-bold text-jhr-white mb-6">
                Modern Venue, Proven Experience
              </h2>
              <p className="text-body-lg text-jhr-white-muted mb-6">
                The JW Marriott is one of Nashville's newest and most capable
                event properties. Its modern design, excellent lighting, and
                efficient layout make it a pleasure to photograph.
              </p>
              <p className="text-body-md text-jhr-white-dim">
                We've documented countless corporate events here—from intimate
                executive meetings to large-scale conferences. We know the
                spaces, we know the staff, and we deliver consistently
                excellent results.
              </p>
            </div>
            <div>
              <div className="bg-jhr-black border border-jhr-black-lighter rounded-xl p-8">
                <h3 className="text-heading-lg font-semibold text-jhr-gold mb-6">
                  Our Experience
                </h3>
                <ul className="space-y-4">
                  {ourExperience.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-jhr-gold mt-0.5 flex-shrink-0" />
                      <span className="text-body-md text-jhr-white">{item}</span>
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
          <h2 className="text-display-sm font-display font-bold text-jhr-white mb-8">
            Spaces We've Covered
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <div
                key={space}
                className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4"
              >
                <p className="text-body-md text-jhr-white">{space}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <h2 className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center">
            Services at JW Marriott Nashville
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/services/corporate-event-coverage" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Coverage
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Comprehensive documentation of corporate events in modern
                spaces.
              </p>
            </Link>
            <Link href="/services/headshot-activation" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Headshot Activation
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Professional headshots for conference activations.
              </p>
            </Link>
            <Link href="/services/event-video-systems" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Video
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Keynotes, highlights, and testimonials.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center">
              JW Marriott Nashville FAQs
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card">
                  <h3 className="text-heading-md font-semibold text-jhr-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-body-md text-jhr-white-dim">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-dark">
        <div className="section-container text-center">
          <h2 className="text-display-sm font-display font-bold text-jhr-white mb-6">
            Planning an Event at JW Marriott Nashville?
          </h2>
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8">
            Let's discuss your event and how we can deliver exceptional
            photography in this modern venue.
          </p>
          <Link href="/schedule" className="btn-primary text-lg px-10 py-4">
            Schedule a Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
