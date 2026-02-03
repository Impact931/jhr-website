import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Renaissance Hotel Nashville | Convention Center Event Photography",
  description:
    "JHR Photography has extensive experience at the Renaissance Nashville. We know the connected Music City Center access and the hotel's premium event spaces.",
  openGraph: {
    title: "Renaissance Hotel Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the Renaissance Nashville hotel.",
  },
};

const venueDetails = {
  name: "Renaissance Nashville Hotel",
  location: "Downtown Nashville",
  address: "611 Commerce St, Nashville, TN 37203",
  description:
    "Connected directly to the Music City Center, the Renaissance Nashville is the go-to hotel for convention attendees. Its proximity and premium spaces make it ideal for overflow meetings, hospitality suites, and executive events.",
};

const spaces = [
  "Grand Ballroom",
  "Nashville Ballroom",
  "Meeting rooms",
  "Executive boardrooms",
  "Pre-function areas",
  "Hospitality suites",
];

const ourExperience = [
  "Seamless coordination between hotel and Music City Center",
  "Familiarity with hotel operations and staff",
  "Knowledge of lighting conditions in each space",
  "Experience with executive meetings and hospitality events",
  "Understanding of convention overflow dynamics",
];

const faqs = [
  {
    question: "Can you cover events at both Renaissance and Music City Center?",
    answer:
      "Yes—this is common for conventions. We can coordinate coverage between the hotel and convention center, ensuring nothing is missed as your event spans both properties.",
  },
  {
    question: "What types of events do you photograph at the Renaissance?",
    answer:
      "Everything from executive breakfasts and board meetings to hospitality suites and reception dinners. The hotel hosts a wide variety of corporate gatherings that complement the larger convention activities next door.",
  },
  {
    question: "How do you handle events that span multiple floors?",
    answer:
      "We plan coverage strategically based on your schedule, positioning team members where they're needed and using the hotel's efficient elevator system to move between locations as required.",
  },
];

// Venue Page Schema
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Renaissance Nashville Hotel",
  description: venueDetails.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "611 Commerce St",
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

export default function RenaissanceHotelPage() {
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
                [Renaissance Hotel Venue Photography]
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
                Convention-Ready Photography
              </h2>
              <p className="text-body-lg text-jhr-white-muted mb-6">
                The Renaissance Nashville exists in partnership with Music City
                Center. Convention attendees stay here, meet here, and network
                here. We understand this dynamic and coordinate coverage
                accordingly.
              </p>
              <p className="text-body-md text-jhr-white-dim">
                Whether you need executive meeting documentation, hospitality
                suite photography, or seamless coverage between hotel and
                convention center, we've done it before.
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
            Services at Renaissance Nashville
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/services/corporate-event-coverage" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Coverage
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Executive meetings, receptions, and convention overflow events.
              </p>
            </Link>
            <Link href="/services/headshot-activation" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Headshot Activation
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Professional headshots for conference hospitality activations.
              </p>
            </Link>
            <Link href="/services/event-video-systems" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Video
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Testimonials, executive interviews, and highlights.
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
              Renaissance Nashville FAQs
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

      {/* Related Venue */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <h2 className="text-heading-lg font-semibold text-jhr-white mb-6 text-center">
            Also See: Connected Venue
          </h2>
          <div className="max-w-md mx-auto">
            <Link href="/venues/music-city-center" className="card group block">
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Music City Center
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Nashville's premier convention center, connected to the
                Renaissance via skybridge.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-dark">
        <div className="section-container text-center">
          <h2 className="text-display-sm font-display font-bold text-jhr-white mb-6">
            Planning an Event at Renaissance Nashville?
          </h2>
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8">
            Let's discuss your event—whether it's at the Renaissance alone or
            spanning both the hotel and Music City Center.
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
