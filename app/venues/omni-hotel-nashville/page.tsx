import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Omni Hotel Nashville | Luxury Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at the Omni Nashville Hotel. We understand the luxury service expectations and deliver photography that matches the venue's standards.",
  openGraph: {
    title: "Omni Hotel Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the Omni Nashville Hotel.",
  },
};

const venueDetails = {
  name: "Omni Nashville Hotel",
  location: "Downtown Nashville",
  address: "250 Rep. John Lewis Way S, Nashville, TN 37203",
  description:
    "A luxury property in the heart of downtown Nashville, the Omni is connected to the Country Music Hall of Fame and offers premium event spaces with exceptional service standards. It's the choice for high-end corporate gatherings.",
};

const spaces = [
  "Broadway Ballroom",
  "Mockingbird Theater",
  "Rooftop venues",
  "Executive boardrooms",
  "Pre-function spaces",
  "Private dining rooms",
];

const ourExperience = [
  "Understanding of luxury service expectations",
  "Photography that matches the venue's premium standards",
  "Familiarity with hotel operations and staff",
  "Experience with high-profile corporate events",
  "Knowledge of rooftop and unique space logistics",
  "Coordination with Omni's events team",
];

const faqs = [
  {
    question: "How do you approach photography at a luxury property?",
    answer:
      "Luxury venues demand luxury execution. We understand the service standards at properties like the Omni and deliver accordingly—professional appearance, discrete presence, and photography quality that matches the venue's brand.",
  },
  {
    question: "Can you photograph rooftop events?",
    answer:
      "Yes. The Omni's rooftop spaces are stunning but present unique lighting and weather considerations. We plan for variable conditions and bring equipment appropriate for outdoor environments.",
  },
  {
    question: "What about events in the connected Country Music Hall of Fame?",
    answer:
      "We can coordinate coverage between the Omni and the Hall of Fame for events that span both properties. The venues work closely together, and so do we.",
  },
];

// Venue Page Schema
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Omni Nashville Hotel",
  description: venueDetails.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "250 Rep. John Lewis Way S",
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

export default function OmniHotelPage() {
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
                [Omni Hotel Venue Photography]
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
                Photography for Premium Events
              </h2>
              <p className="text-body-lg text-jhr-white-muted mb-6">
                The Omni Nashville sets a high bar for service and
                sophistication. Events here expect premium everything—including
                photography. We understand these expectations and deliver
                accordingly.
              </p>
              <p className="text-body-md text-jhr-white-dim">
                From corporate galas to executive retreats, we've documented
                countless events at the Omni. We know the spaces, we know the
                staff, and we know how to capture images worthy of this venue.
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
            Services at Omni Nashville
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/services/corporate-event-coverage" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Coverage
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Premium documentation for galas, receptions, and corporate
                gatherings.
              </p>
            </Link>
            <Link href="/services/headshot-activation" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Headshot Activation
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Professional headshots for executive events and hospitality
                activations.
              </p>
            </Link>
            <Link href="/services/event-video-systems" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <h3 className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2">
                Event Video
              </h3>
              <p className="text-body-sm text-jhr-white-dim">
                Cinematic captures that showcase the venue's elegance.
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
              Omni Nashville FAQs
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
            Planning an Event at Omni Nashville?
          </h2>
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8">
            Let's discuss your event and ensure your photography matches the
            venue's premium standards.
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
