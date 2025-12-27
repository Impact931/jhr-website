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
  name: "Music City Center",
  location: "Downtown Nashville",
  address: "201 Rep. John Lewis Way S, Nashville, TN 37203",
  description:
    "Nashville's premier convention center and the anchor of downtown's entertainment district. At 2.1 million square feet, Music City Center hosts some of the largest conferences and trade shows in the Southeast.",
};

const spaces = [
  "Grand Ballroom",
  "Davidson Ballroom",
  "Exhibit Halls A-D",
  "Meeting rooms (52 total)",
  "Outdoor terraces",
  "Pre-function spaces",
];

const ourExperience = [
  "Extensive experience with convention-scale events",
  "Knowledge of marshaling yard procedures and load-in protocols",
  "Familiarity with hand-carry policies and restrictions",
  "Relationships with venue operations staff",
  "Understanding of lighting conditions in each space",
  "Coordination with venue-preferred AV providers",
];

const faqs = [
  {
    question: "What's unique about photographing at Music City Center?",
    answer:
      "Music City Center is a massive, modern facility with excellent lighting in most spaces. The main challenge is scale—coordinating coverage across multiple exhibit halls and meeting rooms requires planning and communication. We've developed workflows that ensure comprehensive coverage without missing critical moments.",
  },
  {
    question: "Do you handle EAC requirements for Music City Center?",
    answer:
      "Yes. We're experienced with Music City Center's Exhibitor Appointed Contractor (EAC) process. We handle our own paperwork, carry appropriate insurance, and coordinate directly with the show management office as needed.",
  },
  {
    question: "How do you handle the marshaling yard?",
    answer:
      "We understand the marshaling yard procedures, timing windows, and hand-carry policies. For larger equipment, we coordinate load-in schedules with your general contractor. For most events, we arrive with portable equipment that doesn't require freight handling.",
  },
  {
    question: "Can you photograph multiple concurrent sessions?",
    answer:
      "Yes. For large conferences with concurrent breakout sessions, we plan coverage strategically—prioritizing based on your shot list and deploying team members across locations as needed.",
  },
];

export default function MusicCityCenterPage() {
  const pageId = "venues-music-city-center";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title={venueDetails.name}
        subtitle="Nashville's Premier Convention Center"
        description={venueDetails.description}
        image="/images/generated/venue-music-city-center.jpg"
        imageAlt="Music City Center convention center"
        backLink={{ text: "Back to Venues", href: "/venues" }}
      />

      {/* Venue Gallery */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <StaggerContainer className="grid grid-cols-4 gap-4">
            {[
              "/images/generated/event-trade-show.jpg",
              "/images/generated/event-keynote.jpg",
              "/images/generated/event-networking.jpg",
              "/images/generated/event-awards-ceremony.jpg",
            ].map((src, index) => (
              <StaggerItem key={index}>
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <EditableImage
                    sectionId="gallery"
                    contentKey={`image-${index + 1}`}
                    src={src}
                    alt={`Music City Center event ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Our Experience */}
      <section className="section-padding bg-jhr-black-light">
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
                  Our Experience at Music City Center
                </EditableText>
                <EditableText
                  as="p"
                  sectionId="experience"
                  contentKey="intro"
                  className="text-body-lg text-jhr-white-muted mb-6"
                >
                  We've documented countless events at Music City Center—from
                  massive trade shows filling multiple exhibit halls to intimate
                  executive meetings in the upper-level conference rooms.
                </EditableText>
                <EditableText
                  as="p"
                  sectionId="experience"
                  contentKey="description"
                  className="text-body-md text-jhr-white-dim"
                >
                  This isn't our first time walking through the marshaling yard or
                  coordinating with the operations team. We know the venue, we
                  know the protocols, and we know how to deliver without creating
                  friction for your event.
                </EditableText>
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="bg-jhr-black border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  as="h3"
                  sectionId="experience"
                  contentKey="list-heading"
                  className="text-heading-lg font-semibold text-jhr-gold mb-6"
                >
                  What We Know
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
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <FadeUp>
            <EditableText
              as="h2"
              sectionId="spaces"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-8"
            >
              Venue Spaces We've Covered
            </EditableText>
          </FadeUp>
          <StaggerContainer className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {spaces.map((space, index) => (
              <StaggerItem key={space}>
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-4">
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
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <EditableText
              as="h2"
              sectionId="services"
              contentKey="heading"
              className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
            >
              Services at Music City Center
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
                  Comprehensive documentation of conferences, trade shows, and
                  corporate events.
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
                  High-volume professional headshots for trade show booths and
                  sponsorships.
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
                  Keynote capture, highlight reels, and testimonials.
                </EditableText>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <EditableText
                as="h2"
                sectionId="faqs"
                contentKey="heading"
                className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
              >
                Music City Center FAQs
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
            src="/images/generated/venue-music-city-center.jpg"
            alt="Music City Center"
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
              Planning an Event at Music City Center?
            </EditableText>
          </FadeUp>
          <FadeUp delay={0.1}>
            <EditableText
              as="p"
              sectionId="cta"
              contentKey="description"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
            >
              Let's discuss your event and how we can help ensure a smooth,
              successful execution. We know the venue—you focus on the program.
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
