import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MapPin, Building, Camera } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";

export const metadata: Metadata = {
  title: "Embassy Suites Nashville | Corporate Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at Embassy Suites Nashville. A versatile property popular with corporate groups for meetings and events.",
  openGraph: {
    title: "Embassy Suites Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at Embassy Suites Nashville downtown.",
  },
};

const venueDetails = {
  name: "Embassy Suites Nashville Downtown",
  location: "Downtown Nashville",
  address: "1811 Broadway, Nashville, TN 37203",
  description:
    "A versatile property popular with corporate groups, Embassy Suites offers functional event spaces with the convenience of an all-suites hotel. Its central location and practical layout make it ideal for business meetings and mid-size corporate events.",
};

const spaces = [
  "Atrium",
  "Ballroom",
  "Conference rooms",
  "Boardrooms",
  "Pre-function areas",
];

const ourExperience = [
  "Familiarity with the property's versatile spaces",
  "Knowledge of atrium lighting conditions",
  "Experience with corporate meetings and trainings",
  "Coordination with hotel events staff",
  "Understanding of mid-size event logistics",
];

const faqs = [
  {
    question: "What types of events do you photograph at Embassy Suites?",
    answer:
      "Primarily corporate meetings, training sessions, and mid-size business events. The property attracts practical-minded organizations who need functional space and good value—and we deliver photography that matches those priorities.",
  },
  {
    question: "How do you handle the atrium environment?",
    answer:
      "The Embassy Suites atrium has mixed lighting that varies with time of day. We're experienced with this environment and adjust settings accordingly. For controlled portrait work, we use our own lighting equipment.",
  },
  {
    question: "Can you accommodate quick-turnaround needs?",
    answer:
      "Yes. We understand that corporate events often need images quickly for same-day communications or social media. We can deliver highlight images within hours when needed.",
  },
];

// Venue Page Schema
const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Embassy Suites Nashville Downtown",
  description: venueDetails.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1811 Broadway",
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

export default function EmbassySuitesPage() {
  const pageId = "venues-embassy-suites";

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
                [Embassy Suites Venue Photography]
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
                Practical Photography for Practical Events
              </EditableText>
              <EditableText
                as="p"
                sectionId="experience"
                contentKey="intro"
                className="text-body-lg text-jhr-white-muted mb-6"
              >
                Embassy Suites attracts organizations that value function over
                flash. Corporate meetings, training programs, and business
                gatherings that need documentation without drama.
              </EditableText>
              <EditableText
                as="p"
                sectionId="experience"
                contentKey="description"
                className="text-body-md text-jhr-white-dim"
              >
                We understand this mindset. We show up, work efficiently,
                deliver quality images, and stay out of the way. No pretense—
                just professional photography that serves your needs.
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
            Services at Embassy Suites Nashville
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
                Documentation of meetings, trainings, and corporate events.
              </EditableText>
            </Link>
            <Link href="/services/corporate-headshot-program" className="card group">
              <Camera className="w-8 h-8 text-jhr-gold mb-4" />
              <EditableText
                as="h3"
                sectionId="services"
                contentKey="service-2-title"
                className="text-heading-md font-semibold text-jhr-white group-hover:text-jhr-gold transition-colors mb-2"
              >
                Team Headshots
              </EditableText>
              <EditableText
                as="p"
                sectionId="services"
                contentKey="service-2-description"
                className="text-body-sm text-jhr-white-dim"
              >
                On-site headshot sessions during corporate gatherings.
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
                Training captures and corporate communications.
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
              Embassy Suites Nashville FAQs
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
            Planning an Event at Embassy Suites Nashville?
          </EditableText>
          <EditableText
            as="p"
            sectionId="cta"
            contentKey="description"
            className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
          >
            Let's discuss your event and how we can provide practical,
            professional photography that serves your needs.
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
