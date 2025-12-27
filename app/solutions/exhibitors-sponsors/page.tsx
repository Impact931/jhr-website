"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Database,
  Share2,
} from "lucide-react";
import { ROICalculator } from "@/components/ui/ROICalculator";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimation";
import { EditableText } from "@/components/editor/EditableText";
import { EditableImage } from "@/components/editor/EditableImage";

const challenges = [
  {
    icon: Users,
    title: "Empty Booth Syndrome",
    description:
      "You invested thousands in booth space and setup. Now you're watching attendees walk by while your team stands waiting.",
  },
  {
    icon: Database,
    title: "Badge Scans Aren't Leads",
    description:
      "A badge scan tells you someone stopped. It doesn't tell you they're interested, qualified, or likely to respond.",
  },
  {
    icon: TrendingUp,
    title: "Proving Event ROI",
    description:
      "Leadership wants metrics. You need more than foot traffic—you need data that connects to pipeline.",
  },
  {
    icon: Share2,
    title: "Content That Disappears",
    description:
      "Generic giveaways end up in trash cans. Your brand investment leaves no lasting impression.",
  },
];

const outcomes = [
  "Consistent booth traffic throughout the event",
  "Qualified leads with captured contact data",
  "Instant delivery that delights attendees",
  "Shareable content that extends brand reach",
  "Real-time data feed to your sales team",
  "A booth experience people talk about",
];

const faqs = [
  {
    question: "How does this drive booth traffic?",
    answer:
      "Professional headshots are universally valuable—everyone needs one for LinkedIn, company profiles, or speaking submissions. Attendees actively seek out booths offering headshots because they want what you're giving, not just a chance to spin a wheel.",
  },
  {
    question: "What data do we get from attendees?",
    answer:
      "At check-in, we capture name, email, phone, and company. Fields are customizable—you can add job title, specific interests, or qualification questions. Data flows to you in real-time during the event.",
  },
  {
    question: "How quickly do attendees receive their photos?",
    answer:
      "Within minutes. Attendees receive their AI-retouched, branded headshot via text or email before they leave your booth. This instant gratification creates a memorable positive experience associated with your brand.",
  },
  {
    question: "Can the photos be branded with our company?",
    answer:
      "Absolutely. We apply your logo, brand colors, and messaging to every image. When attendees share their new headshot on LinkedIn, your brand travels with it.",
  },
  {
    question: "How many people can you photograph in a day?",
    answer:
      "Our standard setup handles 300+ attendees per day. For high-traffic trade shows, we can scale to 500+ with premium configuration and additional staff.",
  },
];

export default function ExhibitorsSponsorPage() {
  const pageId = "solutions-exhibitors-sponsors";

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId={pageId}
            sectionId="hero"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/event-trade-show.jpg"
            alt="Trade show floor"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="subtitle"
              defaultValue="For Exhibitors & Sponsors"
              as="p"
              className="text-jhr-gold font-medium text-body-lg mb-4"
              contentType="tagline"
            />
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="title"
              defaultValue="Stop Hoping for Booth Traffic"
              as="h1"
              className="text-display-lg font-display font-bold text-jhr-white mb-6"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="description"
              defaultValue="You've spent thousands on booth space. You've got great products and a sharp team. But half the conference is walking right by. What if you had something everyone at the show actually wanted?"
              as="p"
              className="text-body-lg text-jhr-white-muted mb-8"
              contentType="paragraph"
              multiline
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schedule" className="btn-primary">
                Schedule a Strategy Call
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/services/headshot-activation" className="btn-secondary">
                Learn About Headshot Activation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="challenge"
              contentKey="title"
              defaultValue="The Trade Show Challenge"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="challenge"
              contentKey="subtitle"
              defaultValue="You're competing for attention with hundreds of other exhibitors. Most booths blend together in attendees' minds."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <StaggerItem key={challenge.title}>
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center flex-shrink-0">
                      <challenge.icon className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <EditableText
                        pageId={pageId}
                        sectionId="challenge"
                        contentKey={`challenge${index}-title`}
                        defaultValue={challenge.title}
                        as="h3"
                        className="text-heading-md font-semibold text-jhr-white mb-2"
                        contentType="heading"
                      />
                      <EditableText
                        pageId={pageId}
                        sectionId="challenge"
                        contentKey={`challenge${index}-description`}
                        defaultValue={challenge.description}
                        as="p"
                        className="text-body-md text-jhr-white-dim"
                        contentType="paragraph"
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* The Solution */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText
                pageId={pageId}
                sectionId="solution"
                contentKey="title"
                defaultValue="The Headshot Advantage"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-white mb-6"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="solution"
                contentKey="description1"
                defaultValue="A professional headshot is something everyone at the conference actually needs. Not a stress ball that ends up in a drawer—a real professional asset they'll use on LinkedIn, their company website, speaker submissions, and more."
                as="p"
                className="text-body-lg text-jhr-white-muted mb-6"
                contentType="paragraph"
                multiline
              />
              <EditableText
                pageId={pageId}
                sectionId="solution"
                contentKey="description2"
                defaultValue="People will wait in line for it. They'll tell colleagues about it. They'll remember your brand as the one that gave them something genuinely useful—not another piece of branded swag they'll throw away at the airport."
                as="p"
                className="text-body-md text-jhr-white-dim mb-6"
                contentType="paragraph"
                multiline
              />
              <Link
                href="/services/headshot-activation"
                className="text-jhr-gold hover:text-jhr-gold-light transition-colors font-medium flex items-center gap-2"
              >
                See how it works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="bg-jhr-black border border-jhr-black-lighter rounded-xl p-8">
                <EditableText
                  pageId={pageId}
                  sectionId="solution"
                  contentKey="outcomesTitle"
                  defaultValue="What You Get"
                  as="h3"
                  className="text-heading-lg font-semibold text-jhr-gold mb-6"
                  contentType="heading"
                />
                <ul className="space-y-4">
                  {outcomes.map((outcome, index) => (
                    <li key={outcome} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-jhr-gold mt-0.5 flex-shrink-0" />
                      <EditableText
                        pageId={pageId}
                        sectionId="solution"
                        contentKey={`outcome-${index}`}
                        defaultValue={outcome}
                        as="span"
                        className="text-body-md text-jhr-white"
                        contentType="feature"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="howItWorks"
              contentKey="title"
              defaultValue="How It Works"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="howItWorks"
              contentKey="subtitle"
              defaultValue="A streamlined process designed for high-volume trade shows."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <StaggerContainer className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Attendee Arrives",
                description:
                  "Attracted by signage or word of mouth, attendees approach your booth.",
              },
              {
                step: "02",
                title: "Check-In",
                description:
                  "Quick registration captures contact info. Data flows to your CRM in real-time.",
              },
              {
                step: "03",
                title: "Photo Session",
                description:
                  "Professional headshot captured in under 2 minutes. Multiple poses, their choice.",
              },
              {
                step: "04",
                title: "Instant Delivery",
                description:
                  "AI-retouched, branded image sent to their phone before they leave.",
              },
            ].map((item, index) => (
              <StaggerItem key={item.step}>
                <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-lg p-6 text-center">
                  <span className="text-jhr-gold font-display font-bold text-heading-lg">
                    {item.step}
                  </span>
                  <EditableText
                    pageId={pageId}
                    sectionId="howItWorks"
                    contentKey={`step${item.step}-title`}
                    defaultValue={item.title}
                    as="h3"
                    className="text-heading-md font-semibold text-jhr-white mt-4 mb-2"
                    contentType="heading"
                  />
                  <EditableText
                    pageId={pageId}
                    sectionId="howItWorks"
                    contentKey={`step${item.step}-description`}
                    defaultValue={item.description}
                    as="p"
                    className="text-body-sm text-jhr-white-dim"
                    contentType="paragraph"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <div className="text-center mb-12">
            <EditableText
              pageId={pageId}
              sectionId="results"
              contentKey="title"
              defaultValue="Real Results"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-4"
              contentType="heading"
            />
            <EditableText
              pageId={pageId}
              sectionId="results"
              contentKey="subtitle"
              defaultValue="What our exhibitor clients have experienced."
              as="p"
              className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto"
              contentType="paragraph"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-jhr-black border border-jhr-black-lighter rounded-lg p-6 text-center">
              <EditableText
                pageId={pageId}
                sectionId="results"
                contentKey="stat1-value"
                defaultValue="300+"
                as="p"
                className="text-display-sm font-display font-bold text-jhr-gold mb-2"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="results"
                contentKey="stat1-label"
                defaultValue="Booth visits per day"
                as="p"
                className="text-body-md text-jhr-white-dim"
                contentType="paragraph"
              />
            </div>
            <div className="bg-jhr-black border border-jhr-black-lighter rounded-lg p-6 text-center">
              <EditableText
                pageId={pageId}
                sectionId="results"
                contentKey="stat2-value"
                defaultValue="100%"
                as="p"
                className="text-display-sm font-display font-bold text-jhr-gold mb-2"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="results"
                contentKey="stat2-label"
                defaultValue="Contact capture rate"
                as="p"
                className="text-body-md text-jhr-white-dim"
                contentType="paragraph"
              />
            </div>
            <div className="bg-jhr-black border border-jhr-black-lighter rounded-lg p-6 text-center">
              <EditableText
                pageId={pageId}
                sectionId="results"
                contentKey="stat3-value"
                defaultValue="Minutes"
                as="p"
                className="text-display-sm font-display font-bold text-jhr-gold mb-2"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="results"
                contentKey="stat3-label"
                defaultValue="From photo to delivery"
                as="p"
                className="text-body-md text-jhr-white-dim"
                contentType="paragraph"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator - Light Section for Visual Break */}
      <section className="section-padding section-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText
                pageId={pageId}
                sectionId="roi"
                contentKey="subtitle"
                defaultValue="Calculate Your ROI"
                as="p"
                className="text-jhr-gold-dark font-medium text-body-lg mb-2"
                contentType="tagline"
              />
              <EditableText
                pageId={pageId}
                sectionId="roi"
                contentKey="title"
                defaultValue="See the Value of Your Activation"
                as="h2"
                className="text-display-sm font-display font-bold text-jhr-black mb-4"
                contentType="heading"
              />
              <EditableText
                pageId={pageId}
                sectionId="roi"
                contentKey="description"
                defaultValue="Understand the lead generation and dwell time value a Headshot Activation brings to your booth."
                as="p"
                className="text-body-lg text-jhr-light-text-muted max-w-2xl mx-auto"
                contentType="paragraph"
              />
            </div>
          </FadeUp>
          <ROICalculator variant="light" />
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <EditableText
              pageId={pageId}
              sectionId="faqs"
              contentKey="title"
              defaultValue="Common Questions"
              as="h2"
              className="text-display-sm font-display font-bold text-jhr-white mb-8 text-center"
              contentType="heading"
            />
            <StaggerContainer className="space-y-6">
              {faqs.map((faq, index) => (
                <StaggerItem key={index}>
                  <div className="card">
                    <EditableText
                      pageId={pageId}
                      sectionId="faqs"
                      contentKey={`faq${index}-question`}
                      defaultValue={faq.question}
                      as="h3"
                      className="text-heading-md font-semibold text-jhr-white mb-3"
                      contentType="heading"
                    />
                    <EditableText
                      pageId={pageId}
                      sectionId="faqs"
                      contentKey={`faq${index}-answer`}
                      defaultValue={faq.answer}
                      as="p"
                      className="text-body-md text-jhr-white-dim"
                      contentType="paragraph"
                      multiline
                    />
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
            pageId={pageId}
            sectionId="cta"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/event-networking.jpg"
            alt="Networking event"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="section-container text-center relative z-10">
          <EditableText
            pageId={pageId}
            sectionId="cta"
            contentKey="title"
            defaultValue="Ready to Stand Out at Your Next Event?"
            as="h2"
            className="text-display-sm font-display font-bold text-jhr-white mb-6"
            contentType="heading"
          />
          <EditableText
            pageId={pageId}
            sectionId="cta"
            contentKey="description"
            defaultValue="Let's discuss your trade show or sponsorship activation. We'll help you understand how Headshot Activation can drive traffic and generate leads for your brand."
            as="p"
            className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8"
            contentType="paragraph"
            multiline
          />
          <Link href="/schedule" className="btn-primary text-lg px-10 py-4">
            Schedule a Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
