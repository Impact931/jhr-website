"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Calendar, Shield, Zap, Phone, FileText, Camera } from "lucide-react";
import {
  FadeUp,
  FadeIn,
  SlideInLeft,
  SlideInRight,
  StaggerContainer,
  StaggerItem,
  ScaleUp,
} from "@/components/ui/ScrollAnimation";
import { PhotographerTrustBadges } from "@/components/ui/TrustBadges";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { EditableText, EditableImage } from "@/components/editor";

// StoryBrand Homepage - Hero acknowledges anxiety, routes by outcome
export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Editable Content */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image Container - Editable */}
        <div className="absolute inset-0 z-0">
          <EditableImage
            pageId="home"
            sectionId="hero"
            contentKey="backgroundImage"
            defaultSrc="/images/generated/hero-homepage.jpg"
            alt="Professional corporate event photography at Nashville convention center"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-[1]" />

        <div className="section-container relative z-10 py-32">
          <div className="max-w-3xl">
            <EditableText
              pageId="home"
              sectionId="hero"
              contentKey="subtitle"
              defaultValue="Planning a high-stakes event in Nashville?"
              as="p"
              className="text-jhr-gold font-medium text-body-lg mb-4"
              contentType="tagline"
            />

            <EditableText
              pageId="home"
              sectionId="hero"
              contentKey="title"
              defaultValue="Stop Worrying About Your Media Vendor."
              as="h1"
              className="text-display-lg lg:text-display-xl font-display font-bold text-jhr-white mb-6"
              contentType="heading"
            />

            <EditableText
              pageId="home"
              sectionId="hero"
              contentKey="description"
              defaultValue="JHR Photography is Nashville's trusted partner for corporate event photography and headshot activations. We remove the friction so you can focus on what matters—delivering an exceptional event."
              as="p"
              className="text-body-lg text-jhr-white-muted mb-8"
              contentType="paragraph"
              multiline
            />

            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/schedule" className="btn-primary">
                Schedule a Strategy Call
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Our Services
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-jhr-white-muted">
                <CheckCircle className="w-5 h-5 text-jhr-gold" />
                <EditableText pageId="home" sectionId="hero" contentKey="trust1" defaultValue="Venue-Fluent" as="span" className="text-body-sm" contentType="tagline" />
              </div>
              <div className="flex items-center gap-2 text-jhr-white-muted">
                <CheckCircle className="w-5 h-5 text-jhr-gold" />
                <EditableText pageId="home" sectionId="hero" contentKey="trust2" defaultValue="Agency-Grade Execution" as="span" className="text-body-sm" contentType="tagline" />
              </div>
              <div className="flex items-center gap-2 text-jhr-white-muted">
                <CheckCircle className="w-5 h-5 text-jhr-gold" />
                <EditableText pageId="home" sectionId="hero" contentKey="trust3" defaultValue="AI-Accelerated Delivery" as="span" className="text-body-sm" contentType="tagline" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-jhr-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-jhr-gold rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Photographer Trust Engine */}
      <section className="py-8 bg-jhr-black border-b border-jhr-black-lighter">
        <div className="section-container">
          <PhotographerTrustBadges
            title="Professional Photographers You Can Trust"
            subtitle="Our Team"
            compact
          />
        </div>
      </section>

      {/* ICP Routing Section */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText pageId="home" sectionId="icp-routing" contentKey="title" defaultValue="What Brings You Here Today?" as="h2" className="text-display-sm font-display font-bold text-jhr-white mb-4" contentType="heading" />
              <EditableText pageId="home" sectionId="icp-routing" contentKey="description" defaultValue="We serve different clients with different needs. Choose the path that fits your situation." as="p" className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto" contentType="paragraph" />
            </div>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggerItem>
              <Link href="/solutions/dmcs-agencies" className="card group h-full block">
                <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4 group-hover:bg-jhr-gold/20 transition-colors">
                  <Shield className="w-6 h-6 text-jhr-gold" />
                </div>
                <EditableText pageId="home" sectionId="icp-card1" contentKey="title" defaultValue="I need reliable execution for my client." as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2" contentType="heading" />
                <EditableText pageId="home" sectionId="icp-card1" contentKey="description" defaultValue="You're a DMC, agency, or production company managing an event in Nashville. You need a vendor who won't let you down." as="p" className="text-body-md text-jhr-white-dim mb-4" contentType="paragraph" />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Solutions for Agencies <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>

            <StaggerItem>
              <Link href="/solutions/exhibitors-sponsors" className="card group h-full block">
                <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4 group-hover:bg-jhr-gold/20 transition-colors">
                  <Zap className="w-6 h-6 text-jhr-gold" />
                </div>
                <EditableText pageId="home" sectionId="icp-card2" contentKey="title" defaultValue="I need to drive traffic and generate leads." as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2" contentType="heading" />
                <EditableText pageId="home" sectionId="icp-card2" contentKey="description" defaultValue="You're an exhibitor or sponsor looking to maximize booth engagement and capture qualified leads at your next event." as="p" className="text-body-md text-jhr-white-dim mb-4" contentType="paragraph" />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Solutions for Exhibitors <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>

            <StaggerItem>
              <Link href="/solutions/associations" className="card group h-full block">
                <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center mb-4 group-hover:bg-jhr-gold/20 transition-colors">
                  <Calendar className="w-6 h-6 text-jhr-gold" />
                </div>
                <EditableText pageId="home" sectionId="icp-card3" contentKey="title" defaultValue="I need a meaningful member benefit." as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2" contentType="heading" />
                <EditableText pageId="home" sectionId="icp-card3" contentKey="description" defaultValue="You're planning a conference and want to deliver real value to attendees while elevating your event experience." as="p" className="text-body-md text-jhr-white-dim mb-4" contentType="paragraph" />
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Solutions for Associations <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Services Overview with Images */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText pageId="home" sectionId="services" contentKey="label" defaultValue="Our Services" as="p" className="text-jhr-gold font-medium text-body-lg mb-2" contentType="tagline" />
              <EditableText pageId="home" sectionId="services" contentKey="title" defaultValue="Outcome-Based Media Systems" as="h2" className="text-display-sm font-display font-bold text-jhr-white mb-4" contentType="heading" />
              <EditableText pageId="home" sectionId="services" contentKey="description" defaultValue="We don't sell hours or photographers. We deliver complete media systems designed for specific outcomes." as="p" className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto" contentType="paragraph" />
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Headshot Activation */}
            <SlideInLeft>
              <Link href="/services/headshot-activation" className="group block">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                  <EditableImage pageId="home" sectionId="service1" contentKey="image" defaultSrc="/images/generated/service-headshot-activation.jpg" alt="Professional headshot activation at trade show" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <EditableText pageId="home" sectionId="service1" contentKey="title" defaultValue="Headshot Activation™" as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2 group-hover:text-jhr-gold transition-colors" contentType="heading" />
                    <EditableText pageId="home" sectionId="service1" contentKey="description" defaultValue="Turn your booth into a destination with high-engagement headshot stations." as="p" className="text-body-sm text-jhr-white-muted" contentType="paragraph" />
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service1" contentKey="bullet1" defaultValue="300+ attendees processed per day" as="span" contentType="feature" />
                  </li>
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service1" contentKey="bullet2" defaultValue="Real-time lead capture and data delivery" as="span" contentType="feature" />
                  </li>
                </ul>
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </SlideInLeft>

            {/* Corporate Event Coverage */}
            <SlideInRight>
              <Link href="/services/corporate-event-coverage" className="group block">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                  <EditableImage pageId="home" sectionId="service2" contentKey="image" defaultSrc="/images/generated/service-event-coverage.jpg" alt="Corporate event photography at conference" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <EditableText pageId="home" sectionId="service2" contentKey="title" defaultValue="Corporate Event Coverage™" as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2 group-hover:text-jhr-gold transition-colors" contentType="heading" />
                    <EditableText pageId="home" sectionId="service2" contentKey="description" defaultValue="Comprehensive documentation with the professionalism your brand demands." as="p" className="text-body-sm text-jhr-white-muted" contentType="paragraph" />
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service2" contentKey="bullet1" defaultValue="Multi-day coverage capabilities" as="span" contentType="feature" />
                  </li>
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service2" contentKey="bullet2" defaultValue="Same-day highlight delivery available" as="span" contentType="feature" />
                  </li>
                </ul>
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </SlideInRight>

            {/* Corporate Headshot Program */}
            <SlideInLeft delay={0.2}>
              <Link href="/services/corporate-headshot-program" className="group block">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                  <EditableImage pageId="home" sectionId="service3" contentKey="image" defaultSrc="/images/generated/service-corporate-headshots.jpg" alt="Corporate team headshot session" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <EditableText pageId="home" sectionId="service3" contentKey="title" defaultValue="Corporate Headshot Program™" as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2 group-hover:text-jhr-gold transition-colors" contentType="heading" />
                    <EditableText pageId="home" sectionId="service3" contentKey="description" defaultValue="Consistent, on-brand headshots for your entire team." as="p" className="text-body-sm text-jhr-white-muted" contentType="paragraph" />
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service3" contentKey="bullet1" defaultValue="On-site at your office" as="span" contentType="feature" />
                  </li>
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service3" contentKey="bullet2" defaultValue="AI-retouched, ready for LinkedIn" as="span" contentType="feature" />
                  </li>
                </ul>
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </SlideInLeft>

            {/* Event Video Systems */}
            <SlideInRight delay={0.2}>
              <Link href="/services/event-video-systems" className="group block">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                  <EditableImage pageId="home" sectionId="service4" contentKey="image" defaultSrc="/images/generated/service-event-video.jpg" alt="Event video production at corporate conference" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <EditableText pageId="home" sectionId="service4" contentKey="title" defaultValue="Event Video Systems™" as="h3" className="text-heading-lg font-semibold text-jhr-white mb-2 group-hover:text-jhr-gold transition-colors" contentType="heading" />
                    <EditableText pageId="home" sectionId="service4" contentKey="description" defaultValue="Capture the motion and emotion of your event." as="p" className="text-body-sm text-jhr-white-muted" contentType="paragraph" />
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service4" contentKey="bullet1" defaultValue="Keynote and session capture" as="span" contentType="feature" />
                  </li>
                  <li className="flex items-start gap-2 text-body-sm text-jhr-white-muted">
                    <CheckCircle className="w-4 h-4 text-jhr-gold mt-0.5 flex-shrink-0" />
                    <EditableText pageId="home" sectionId="service4" contentKey="bullet2" defaultValue="Social-ready highlight clips" as="span" contentType="feature" />
                  </li>
                </ul>
                <span className="text-jhr-gold flex items-center gap-2 text-body-sm font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Venue Fluency Section */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage pageId="home" sectionId="venues" contentKey="backgroundImage" defaultSrc="/images/generated/hero-venues.jpg" alt="Nashville skyline and convention venues" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <EditableText pageId="home" sectionId="venues" contentKey="label" defaultValue="Venue Fluency" as="p" className="text-jhr-gold font-medium text-body-lg mb-2" contentType="tagline" />
              <EditableText pageId="home" sectionId="venues" contentKey="title" defaultValue="We Know Nashville's Premier Venues" as="h2" className="text-display-sm font-display font-bold text-jhr-white mb-6" contentType="heading" />
              <EditableText pageId="home" sectionId="venues" contentKey="description" defaultValue="When you're planning from out of state, you need a partner who knows the terrain. We've worked extensively at Nashville's top convention and event venues—we know the marshaling yards, the loading docks, the lighting challenges, and the people who run them." as="p" className="text-body-lg text-jhr-white-muted mb-6" contentType="paragraph" multiline />
              <EditableText pageId="home" sectionId="venues" contentKey="subtext" defaultValue="This isn't just familiarity—it's operational fluency that translates to zero friction for you." as="p" className="text-body-md text-jhr-white-dim mb-8" contentType="paragraph" />
              <Link href="/venues" className="btn-secondary">
                Explore Our Venue Experience
              </Link>
            </SlideInLeft>

            <SlideInRight>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/venues/music-city-center" className="group relative aspect-square rounded-xl overflow-hidden">
                  <EditableImage pageId="home" sectionId="venue1" contentKey="image" defaultSrc="/images/generated/venue-music-city-center.jpg" alt="Music City Center" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <EditableText pageId="home" sectionId="venue1" contentKey="name" defaultValue="Music City Center" as="h3" className="text-heading-sm font-medium text-jhr-white group-hover:text-jhr-gold transition-colors" contentType="heading" />
                  </div>
                </Link>
                <Link href="/venues/gaylord-opryland" className="group relative aspect-square rounded-xl overflow-hidden">
                  <EditableImage pageId="home" sectionId="venue2" contentKey="image" defaultSrc="/images/generated/venue-gaylord-opryland.jpg" alt="Gaylord Opryland" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <EditableText pageId="home" sectionId="venue2" contentKey="name" defaultValue="Gaylord Opryland" as="h3" className="text-heading-sm font-medium text-jhr-white group-hover:text-jhr-gold transition-colors" contentType="heading" />
                  </div>
                </Link>
                <Link href="/venues/renaissance-hotel-nashville" className="group relative aspect-square rounded-xl overflow-hidden">
                  <EditableImage pageId="home" sectionId="venue3" contentKey="image" defaultSrc="/images/generated/venue-hotel-ballroom.jpg" alt="Renaissance Hotel" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <EditableText pageId="home" sectionId="venue3" contentKey="name" defaultValue="Renaissance Hotel" as="h3" className="text-heading-sm font-medium text-jhr-white group-hover:text-jhr-gold transition-colors" contentType="heading" />
                  </div>
                </Link>
                <Link href="/venues/omni-hotel-nashville" className="group relative aspect-square rounded-xl overflow-hidden">
                  <EditableImage pageId="home" sectionId="venue4" contentKey="image" defaultSrc="/images/generated/venue-conference-room.jpg" alt="Omni Hotel" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <EditableText pageId="home" sectionId="venue4" contentKey="name" defaultValue="Omni Hotel" as="h3" className="text-heading-sm font-medium text-jhr-white group-hover:text-jhr-gold transition-colors" contentType="heading" />
                  </div>
                </Link>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-16">
              <EditableText pageId="home" sectionId="process" contentKey="label" defaultValue="How It Works" as="p" className="text-jhr-gold font-medium text-body-lg mb-2" contentType="tagline" />
              <EditableText pageId="home" sectionId="process" contentKey="title" defaultValue="A Clear Path to Success" as="h2" className="text-display-sm font-display font-bold text-jhr-white mb-4" contentType="heading" />
              <EditableText pageId="home" sectionId="process" contentKey="description" defaultValue="Working with JHR is straightforward. We take the burden off your plate so you can focus on your event." as="p" className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto" contentType="paragraph" />
            </div>
          </FadeUp>

          <ProcessTimeline
            steps={[
              {
                id: 1,
                title: "Strategy Call",
                description: "We schedule a brief consultation to align on your specific logistics, venue constraints, and goals. We identify potential friction points before they happen.",
                icon: Phone,
              },
              {
                id: 2,
                title: "Logistics Takeover",
                description: "Our team handles the heavy lifting—coordinating with venues, managing equipment logistics, and executing the onsite activation with uniformed, professional staff.",
                icon: FileText,
              },
              {
                id: 3,
                title: "Asset Delivery",
                description: "You receive AI-retouched assets and granular data instantly, ready for your post-event marketing sequences. No delays, no surprises.",
                icon: Camera,
              },
            ]}
          />
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="section-padding bg-jhr-black-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText pageId="home" sectionId="gallery" contentKey="label" defaultValue="Our Work" as="p" className="text-jhr-gold font-medium text-body-lg mb-2" contentType="tagline" />
              <EditableText pageId="home" sectionId="gallery" contentKey="title" defaultValue="Event Photography That Delivers" as="h2" className="text-display-sm font-display font-bold text-jhr-white mb-4" contentType="heading" />
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "gallery1", src: "/images/generated/event-keynote.jpg", alt: "Keynote speaker at corporate conference" },
              { key: "gallery2", src: "/images/generated/event-trade-show.jpg", alt: "Trade show floor photography" },
              { key: "gallery3", src: "/images/generated/event-networking.jpg", alt: "Networking event photography" },
              { key: "gallery4", src: "/images/generated/event-awards-ceremony.jpg", alt: "Awards ceremony photography" },
              { key: "gallery5", src: "/images/generated/gallery-headshot-1.jpg", alt: "Professional corporate headshot" },
              { key: "gallery6", src: "/images/generated/gallery-headshot-2.jpg", alt: "Executive portrait" },
              { key: "gallery7", src: "/images/generated/gallery-headshot-3.jpg", alt: "Business professional headshot" },
              { key: "gallery8", src: "/images/generated/venue-hotel-ballroom.jpg", alt: "Corporate gala photography" },
            ].map((img, index) => (
              <ScaleUp key={img.key} delay={index * 0.05}>
                <div className="relative aspect-square rounded-lg overflow-hidden group">
                  <EditableImage pageId="home" sectionId="gallery" contentKey={img.key} defaultSrc={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 z-10" />
                </div>
              </ScaleUp>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section-padding section-light">
        <div className="section-container">
          <FadeUp>
            <div className="text-center mb-12">
              <EditableText pageId="home" sectionId="testimonials" contentKey="label" defaultValue="Trusted By" as="p" className="text-jhr-gold-dark font-medium text-body-lg mb-2" contentType="tagline" />
              <EditableText pageId="home" sectionId="testimonials" contentKey="title" defaultValue="Event Professionals Choose JHR" as="h2" className="text-display-sm font-display font-bold text-jhr-black mb-4" contentType="heading" />
            </div>
          </FadeUp>

          <FadeIn delay={0.2}>
            <div className="max-w-3xl mx-auto text-center">
              <EditableText pageId="home" sectionId="testimonials" contentKey="quote" defaultValue="Working with Jayson and his team was seamless. They understood our needs, showed up prepared, and delivered exceptional results. Our attendees loved the headshot activation." as="p" className="text-body-lg lg:text-xl text-jhr-light-text italic mb-6" contentType="testimonial" multiline />
              <EditableText pageId="home" sectionId="testimonials" contentKey="attribution" defaultValue="— Event Director, National Association Conference" as="p" className="text-body-sm text-jhr-light-text-muted" contentType="paragraph" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage pageId="home" sectionId="cta" contentKey="backgroundImage" defaultSrc="/images/generated/event-keynote.jpg" alt="Corporate event" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/85" />
        </div>

        <div className="section-container relative z-10 text-center">
          <FadeUp>
            <EditableText pageId="home" sectionId="cta" contentKey="title" defaultValue="Ready to Remove the Worry?" as="h2" className="text-display-sm lg:text-display-md font-display font-bold text-jhr-white mb-6" contentType="heading" />
            <EditableText pageId="home" sectionId="cta" contentKey="description" defaultValue="Let's talk about your event. Schedule a strategy call and discover how JHR can deliver the professional reliability and results your event deserves." as="p" className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto mb-8" contentType="paragraph" multiline />
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
