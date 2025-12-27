"use client";

import Link from "next/link";
import { ArrowRight, Shield, Heart, Zap } from "lucide-react";
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

export default function AboutPage() {
  const pageId = "about";

  return (
    <div>
      {/* Hero Banner */}
      <EditablePageHero
        pageId={pageId}
        title="We Understand the Pressure You're Under"
        subtitle="About JHR Photography"
        description="You're not looking for a photographer. You're looking for a partner who removes worry, delivers reliably, and makes you look good to your stakeholders."
        image="/images/generated/hero-about.jpg"
        imageAlt="Professional photographer with camera"
      />

      {/* The Guide Section */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <div>
                <EditableText
                  pageId={pageId}
                  sectionId="guide"
                  contentKey="title"
                  defaultValue="Meet Jayson Rivas"
                  as="h2"
                  className="text-display-sm font-display font-bold text-jhr-white mb-6"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="guide"
                  contentKey="description1"
                  defaultValue="Before JHR Photography, Jayson spent decades as a Green Beret in the U.S. Army Special Forces. That background shaped everything about how we operate: meticulous planning, calm under pressure, and flawless execution when it matters most."
                  as="p"
                  className="text-body-lg text-jhr-white-muted mb-6"
                  contentType="paragraph"
                  multiline
                />
                <EditableText
                  pageId={pageId}
                  sectionId="guide"
                  contentKey="description2"
                  defaultValue="After retiring from the military, Jayson channeled his passion for photography into building a business that serves high-stakes, high-pressure events. He understands that for event planners, there's no room for error—your reputation is on the line with every execution."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-6"
                  contentType="paragraph"
                  multiline
                />
                <EditableText
                  pageId={pageId}
                  sectionId="guide"
                  contentKey="description3"
                  defaultValue="JHR Photography exists because Jayson believes event professionals deserve a media partner who operates at their level—not a creative who shows up hoping for the best, but an operator who arrives prepared to deliver."
                  as="p"
                  className="text-body-md text-jhr-white-dim mb-8"
                  contentType="paragraph"
                  multiline
                />
                <div className="flex items-center gap-4">
                  <Link href="/schedule" className="btn-primary">
                    Schedule a Strategy Call
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </SlideInLeft>
            <SlideInRight>
              <div className="relative">
                <div className="aspect-[4/5] relative rounded-xl overflow-hidden">
                  <EditableImage
                    pageId={pageId}
                    sectionId="guide"
                    contentKey="image"
                    defaultSrc="/images/generated/hero-about.jpg"
                    alt="Jayson Rivas - JHR Photography Founder"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jhr-black/50 to-transparent z-10" />
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="values"
                contentKey="title"
                defaultValue="How We Operate"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="values"
                contentKey="subtitle"
                defaultValue="Our approach is shaped by military discipline and a deep respect for the professionals we serve."
                as="p"
                className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="card text-center h-full">
                <div className="w-14 h-14 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-7 h-7 text-jhr-gold" />
                </div>
                <EditableText
                  pageId={pageId}
                  sectionId="values"
                  contentKey="value1-title"
                  defaultValue="Reliability First"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white mb-3"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="values"
                  contentKey="value1-description"
                  defaultValue="We show up prepared, on time, every time. No excuses. Our logistics are planned to the minute, and we build in redundancy for everything that matters."
                  as="p"
                  className="text-body-md text-jhr-white-dim"
                  contentType="paragraph"
                  multiline
                />
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card text-center h-full">
                <div className="w-14 h-14 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-7 h-7 text-jhr-gold" />
                </div>
                <EditableText
                  pageId={pageId}
                  sectionId="values"
                  contentKey="value2-title"
                  defaultValue="Empathy Driven"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white mb-3"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="values"
                  contentKey="value2-description"
                  defaultValue="We know you're juggling a thousand details. We don't add to your stress—we remove it. Our job is to make your job easier, not to showcase our creative ego."
                  as="p"
                  className="text-body-md text-jhr-white-dim"
                  contentType="paragraph"
                  multiline
                />
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card text-center h-full">
                <div className="w-14 h-14 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-7 h-7 text-jhr-gold" />
                </div>
                <EditableText
                  pageId={pageId}
                  sectionId="values"
                  contentKey="value3-title"
                  defaultValue="Outcomes Over Process"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-white mb-3"
                  contentType="heading"
                />
                <EditableText
                  pageId={pageId}
                  sectionId="values"
                  contentKey="value3-description"
                  defaultValue="We don't talk about gear, hours, or creative vision. We talk about what you need to achieve and how we deliver it. Your success is our only metric."
                  as="p"
                  className="text-body-md text-jhr-white-dim"
                  contentType="paragraph"
                  multiline
                />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Why JHR Section */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <EditableText
                pageId={pageId}
                sectionId="whyJHR"
                contentKey="title"
                defaultValue="Why Event Professionals Choose JHR"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-6 text-center"
                contentType="heading"
              />
            </FadeUp>

            <StaggerContainer className="space-y-6">
              <StaggerItem>
                <div className="card">
                  <EditableText
                    pageId={pageId}
                    sectionId="whyJHR"
                    contentKey="reason1-title"
                    defaultValue="We Speak Your Language"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="whyJHR"
                    contentKey="reason1-description"
                    defaultValue="EAC forms, marshaling yards, drayage, union jurisdictions—we know the operational vocabulary of major events. When you work with us, you're not educating a vendor; you're partnering with someone who already understands."
                    as="p"
                    className="text-body-md text-jhr-white-dim"
                    contentType="paragraph"
                    multiline
                  />
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="card">
                  <EditableText
                    pageId={pageId}
                    sectionId="whyJHR"
                    contentKey="reason2-title"
                    defaultValue="We Know Nashville's Venues"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="whyJHR"
                    contentKey="reason2-description"
                    defaultValue="Music City Center, Gaylord Opryland, the downtown hotels—we've worked them all extensively. We know the quirks, the contacts, and the best spots for every type of shot."
                    as="p"
                    className="text-body-md text-jhr-white-dim"
                    contentType="paragraph"
                    multiline
                  />
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="card">
                  <EditableText
                    pageId={pageId}
                    sectionId="whyJHR"
                    contentKey="reason3-title"
                    defaultValue="We Deliver Without Drama"
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="whyJHR"
                    contentKey="reason3-description"
                    defaultValue="Our team arrives in uniform, on schedule, with backup equipment and clear communication protocols. When the event is over, you get your assets fast—not excuses about editing timelines."
                    as="p"
                    className="text-body-md text-jhr-white-dim"
                    contentType="paragraph"
                    multiline
                  />
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-jhr-black-light relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId={pageId}
            sectionId="stats"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/event-keynote.jpg"
            alt="Corporate event"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="section-container relative z-10">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Events Covered" },
              { value: "15K+", label: "Headshots Delivered" },
              { value: "100%", label: "On-Time Delivery" },
              { value: "10+", label: "Years Experience" },
            ].map((stat, index) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <EditableText
                    pageId={pageId}
                    sectionId="stats"
                    contentKey={`stat${index}-value`}
                    defaultValue={stat.value}
                    as="p"
                    className="text-display-sm font-display font-bold text-jhr-gold mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="stats"
                    contentKey={`stat${index}-label`}
                    defaultValue={stat.label}
                    as="p"
                    className="text-body-md text-jhr-white-muted"
                    contentType="paragraph"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId={pageId}
            sectionId="cta"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/hero-homepage.jpg"
            alt="Corporate event photography"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <FadeUp>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="title"
              defaultValue="Let's Talk About Your Event"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-6"
              contentType="heading"
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <EditableText
              pageId={pageId}
              sectionId="cta"
              contentKey="description"
              defaultValue="Schedule a strategy call with Jayson. We'll discuss your event, understand your challenges, and show you exactly how JHR can help."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
              contentType="paragraph"
              multiline
            />
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
