import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Belmont University | Academic & Corporate Event Photography",
  description:
    "JHR Photography has extensive experience at Belmont University. We know the campus venues for academic conferences, corporate retreats, and special events.",
  openGraph: {
    title: "Belmont University Event Photography | JHR Photography",
    description:
      "Professional event photography at Belmont University Nashville.",
  },
};

const venueDetails = {
  name: "Belmont University",
  location: "Belmont/Hillsboro, Nashville",
  address: "1900 Belmont Blvd, Nashville, TN 37212",
  description:
    "A beautiful campus with diverse event spaces, from the grand Curb Event Center to intimate academic venues. Belmont hosts academic conferences, corporate retreats, and special events in a distinctive collegiate setting.",
};

const spaces = [
  "Curb Event Center",
  "McAfee Concert Hall",
  "Massey Performing Arts Center",
  "Johnson Center",
  "Academic conference rooms",
  "Campus outdoor venues",
];

const ourExperience = [
  "Knowledge of Belmont's diverse campus venues",
  "Experience with academic conferences and symposiums",
  "Understanding of university protocols and access",
  "Photography for corporate retreats on campus",
  "Coordination with Belmont events staff",
  "Coverage of performances and special events",
];

const faqs = [
  {
    question: "What types of events do you photograph at Belmont?",
    answer:
      "Everything from academic conferences and corporate retreats to performances at the Curb Event Center and McAfee Concert Hall. Belmont hosts a wide variety of events, and we've covered most types.",
  },
  {
    question: "How do you navigate the campus logistics?",
    answer:
      "We're familiar with Belmont's campus, including parking, venue access, and the university's operational protocols. We coordinate with Belmont's events team in advance to ensure smooth execution.",
  },
  {
    question: "Can you cover events in multiple campus locations?",
    answer:
      "Yes. We plan coverage strategically across venues, understanding the walking times and logistics of moving between locations. We ensure nothing is missed even when events span multiple buildings.",
  },
];

// Venue Page Schema
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Belmont University",
  description: venueDetails.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1900 Belmont Blvd",
    addressLocality: "Nashville",
    addressRegion: "TN",
    postalCode: "37212",
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

export default function BelmontUniversityPage() {
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
                [Belmont University Campus Photography]
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
                Campus Photography Expertise
              </h2>
              <p className="text-body-lg text-jhr-white-muted mb-6">
                Belmont University offers a unique setting—historic
                architecture, modern facilities, and a beautiful campus that
                provides distinctive backdrops for corporate and academic
                events.
              </p>
              <p className="text-body-md text-jhr-white-dim">
                We've worked throughout the campus, from the grand Curb Event
                Center to intimate seminar rooms. We understand the university
                environment and deliver photography that captures both the event
                and the setting.
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
            Services at Belmont University
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/services/corporate-event-coverage" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Coverage
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Conferences, retreats, and academic events in a collegiate
                setting.
              </p>
            </Link>
            <Link href="/services/headshot-activation" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Headshot Activation
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Professional headshots for conference attendees and
                participants.
              </p>
            </Link>
            <Link href="/services/event-video-systems" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Video
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Keynotes, performances, and campus event highlights.
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
              Belmont University FAQs
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
            Planning an Event at Belmont University?
          </h2>
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8">
            Let's discuss your event and how we can capture it within this
            beautiful campus setting.
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
