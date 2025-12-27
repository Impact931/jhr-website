import Link from "next/link";
import { ArrowRight, CheckCircle, Camera, Video, Users } from "lucide-react";
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

const venueDetails = {
  name: "Gaylord Opryland Resort",
  location: "Music Valley, Nashville",
  address: "2800 Opryland Dr, Nashville, TN 37214",
  description:
    "A destination unto itself, Gaylord Opryland is one of the largest non-gaming hotels in the country. Its stunning indoor atriums, extensive meeting space, and world-class hospitality make it a premier choice for national conferences.",
};

const spaces = [
  "Delta Atrium",
  "Garden Conservatory",
  "Cascades Atrium",
  "Ryman Exhibit Halls",
  "Tennessee Ballroom",
  "Presidential Ballroom",
  "Multiple breakout rooms",
];

const challenges = [
  {
    challenge: "Mixed Lighting Environments",
    solution:
      "The atriums combine natural light with interior fixtures, creating challenging conditions. We bring equipment calibrated for these environments and adjust throughout the day as lighting changes.",
  },
  {
    challenge: "Strict Vendor Policies",
    solution:
      "Gaylord has specific vendor requirements and EAC processes. We're experienced with their protocols and handle compliance seamlessly.",
  },
  {
    challenge: "Humidity in Atriums",
    solution:
      "The lush atrium environments create humidity that can affect equipment. We use protective measures and acclimate gear properly.",
  },
];

const ourExperience = [
  "EAC-compliant with proper insurance and credentials",
  "Deep familiarity with atrium lighting conditions",
  "Knowledge of vendor policies and restrictions",
  "Relationships with hotel operations staff",
  "Experience across all major event spaces",
  "Understanding of guest flow and photo opportunities",
];

const faqs = [
  {
    question: "How do you handle the lighting in the atriums?",
    answer:
      "The Delta, Cascades, and Garden Conservatory atriums have mixed lighting that changes throughout the day. We bring professional lighting equipment and calibrate settings based on the specific space and time of your event. Our experience here means we know exactly what to expect.",
  },
  {
    question: "Are you familiar with Gaylord's vendor requirements?",
    answer:
      "Yes. We understand Gaylord's EAC (Exhibitor Appointed Contractor) process, carry appropriate insurance, and coordinate with hotel management as needed. We've worked with their events team many times and know the protocols.",
  },
  {
    question: "Can you photograph events in multiple areas of the resort?",
    answer:
      "Absolutely. We're familiar with the entire property—from the ballrooms to the atriums to the outdoor spaces. We plan coverage strategically to capture your event wherever it takes you.",
  },
  {
    question: "What about the humidity in the indoor gardens?",
    answer:
      "The lush indoor environments do create humidity challenges. We take precautions with equipment, allowing proper acclimation time and using protective measures. This isn't our first time dealing with it.",
  },
];

export default function GaylordOprylandPage() {
  const pageId = "venues-gaylord-opryland";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title={venueDetails.name}
        subtitle="Nashville's Iconic Resort & Convention Center"
        description={venueDetails.description}
        image="/images/generated/venue-gaylord-opryland.jpg"
        imageAlt="Gaylord Opryland Resort atrium"
        backLink={{ text: "Back to Venues", href: "/venues" }}
      />

      {/* Venue Gallery */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <StaggerContainer className="grid grid-cols-4 gap-4">
            {[
              "/images/generated/venue-gaylord-opryland.jpg",
              "/images/generated/event-networking.jpg",
              "/images/generated/venue-hotel-ballroom.jpg",
              "/images/generated/event-awards-ceremony.jpg",
            ].map((src, index) => (
              <StaggerItem key={index}>
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <EditableImage
                    sectionId="gallery"
                    contentKey={`image-${index + 1}`}
                    src={src}
                    alt={`Gaylord Opryland event ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Unique Challenges */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <EditableText
              as="h2"
              sectionId="challenges"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
            >
              Gaylord's Unique Challenges
            </EditableText>
            <EditableText
              as="p"
              sectionId="challenges"
              contentKey="intro"
              className="text-body-lg text-jhr-white-muted max-w-3xl mb-8"
            >
              Gaylord Opryland is beautiful—and challenging. The iconic atriums
              and strict vendor policies require a photographer who's been there
              before.
            </EditableText>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {challenges.map((item, index) => (
              <StaggerItem key={item.challenge}>
                <div className="bg-jhr-black border border-jhr-black-lighter rounded-lg p-6 h-full">
                  <EditableText
                    as="h3"
                    sectionId="challenges"
                    contentKey={`challenge-${index + 1}-title`}
                    className="text-heading-md font-semibold text-jhr-gold mb-3"
                  >
                    {item.challenge}
                  </EditableText>
                  <EditableText
                    as="p"
                    sectionId="challenges"
                    contentKey={`challenge-${index + 1}-description`}
                    className="text-body-sm text-jhr-white-dim"
                  >
                    {item.solution}
                  </EditableText>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Our Experience */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div>
                <EditableText
                  as="h2"
                  sectionId="experience"
                  contentKey="heading"
                  className="text-display-sm font-display font-bold text-jhr-white mb-6"
                >
                  Our Gaylord Opryland Experience
                </EditableText>
                <EditableText
                  as="p"
                  sectionId="experience"
                  contentKey="intro"
                  className="text-body-lg text-jhr-white-muted mb-6"
                >
                  We've worked extensively at Gaylord Opryland—from corporate
                  galas in the Tennessee Ballroom to trade shows in the Ryman
                  Exhibit Halls to intimate breakouts overlooking the Delta
                  Atrium.
                </EditableText>
                <EditableText
                  as="p"
                  sectionId="experience"
                  contentKey="description"
                  className="text-body-md text-jhr-white-dim"
                >
                  We know the property, we know the staff, and we know how to
                  deliver exceptional photography despite the unique challenges.
                  Your event is in experienced hands.
                </EditableText>
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  as="h3"
                  sectionId="experience"
                  contentKey="list-heading"
                  className="text-heading-lg font-semibold text-jhr-gold mb-6"
                >
                  What We Bring
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
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Venue Spaces */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <EditableText
              as="h2"
              sectionId="spaces"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-8"
            >
              Spaces We've Covered
            </EditableText>
          </FadeUp>
          <StaggerContainer className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {spaces.map((space, index) => (
              <StaggerItem key={space}>
                <div className="bg-jhr-black border border-jhr-black-lighter rounded-lg p-4">
                  <EditableText
                    as="p"
                    sectionId="spaces"
                    contentKey={`space-${index + 1}`}
                    className="text-body-md text-jhr-white"
                  >
                    {space}
                  </EditableText>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <FadeUp>
            <EditableText
              as="h2"
              sectionId="services"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
            >
              Services at Gaylord Opryland
            </EditableText>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <StaggerItem>
              <Link href="/services/corporate-event-coverage" className="card group block h-full">
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
                  Comprehensive documentation adapted to Gaylord's unique spaces
                  and lighting.
                </EditableText>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/services/headshot-activation" className="card group block h-full">
                <Users className="w-8 h-8 text-jhr-gold mb-4" />
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
                  High-volume headshots with controlled lighting that bypasses
                  atrium challenges.
                </EditableText>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/services/event-video-systems" className="card group block h-full">
                <Video className="w-8 h-8 text-jhr-gold mb-4" />
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
                  Keynotes, highlights, and testimonials capturing Gaylord's
                  stunning environments.
                </EditableText>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <EditableText
                as="h2"
                sectionId="faqs"
                contentKey="heading"
                className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
              >
                Gaylord Opryland FAQs
              </EditableText>
            </FadeUp>
            <StaggerContainer className="space-y-6">
              {faqs.map((faq, index) => (
                <StaggerItem key={index}>
                  <div className="card">
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
            sectionId="cta"
            contentKey="background-image"
            src="/images/generated/venue-gaylord-opryland.jpg"
            alt="Gaylord Opryland"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <FadeUp>
            <EditableText
              as="h2"
              sectionId="cta"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-6"
            >
              Planning an Event at Gaylord Opryland?
            </EditableText>
          </FadeUp>
          <FadeUp delay={0.1}>
            <EditableText
              as="p"
              sectionId="cta"
              contentKey="description"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
            >
              Let's discuss your event and how we can navigate Gaylord's unique
              requirements together. We've done it before—many times.
            </EditableText>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link href="/schedule" className="btn-primary text-lg px-10 py-4">
              Schedule a Strategy Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
