"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { PageHero } from "@/components/ui/HeroBanner";
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/ScrollAnimation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    venue: "",
    eventDate: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Submission failed");
      }

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        eventType: "",
        venue: "",
        eventDate: "",
        message: "",
      });
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      {/* Hero Banner */}
      <PageHero
        title="Let's Talk About Your Event"
        subtitle="Get in Touch"
        description="Have a question or ready to discuss your event? Fill out the form and we'll get back to you within one business day."
        image="/images/generated/event-keynote.jpg"
        imageAlt="Corporate keynote event"
      />

      {/* Contact Section */}
      <section className="section-padding bg-jhr-black">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <SlideInLeft>
              <div>
                <h2 className="text-display-sm font-display font-bold text-jhr-white mb-6">
                  Contact Information
                </h2>
                <p className="text-body-lg text-jhr-white-muted mb-8">
                  Prefer a direct conversation? Use the information below to reach
                  us directly, or schedule a strategy call for a more in-depth
                  discussion.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Email</p>
                      <a
                        href="mailto:info@jhr-photography.com"
                        className="text-body-md text-jhr-white hover:text-jhr-gold transition-colors"
                      >
                        info@jhr-photography.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Phone</p>
                      <a
                        href="tel:+16155550123"
                        className="text-body-md text-jhr-white hover:text-jhr-gold transition-colors"
                      >
                        (615) 555-0123
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-jhr-gold/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-jhr-gold" />
                    </div>
                    <div>
                      <p className="text-body-sm text-jhr-white-dim">Location</p>
                      <p className="text-body-md text-jhr-white">
                        Nashville, Tennessee
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="mt-8 aspect-video relative rounded-xl overflow-hidden">
                  <Image
                    src="/images/generated/venue-hotel-ballroom.jpg"
                    alt="Corporate event venue"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </SlideInLeft>

            {/* Contact Form */}
            <SlideInRight>
              <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6 lg:p-8">
                {submitStatus === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-jhr-gold" />
                    </div>
                    <h2 className="text-heading-lg font-semibold text-jhr-white mb-3">
                      Message Sent!
                    </h2>
                    <p className="text-body-md text-jhr-white-dim mb-6">
                      Thank you for reaching out. We'll get back to you within one
                      business day.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="text-jhr-gold hover:text-jhr-gold-light transition-colors text-body-md font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-body-sm font-medium text-jhr-white mb-2"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-body-sm font-medium text-jhr-white mb-2"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-body-sm font-medium text-jhr-white mb-2"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-body-sm font-medium text-jhr-white mb-2"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-body-sm font-medium text-jhr-white mb-2"
                      >
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                        placeholder="Acme Corp"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="eventType"
                          className="block text-body-sm font-medium text-jhr-white mb-2"
                        >
                          Event Type
                        </label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                        >
                          <option value="">Select type...</option>
                          <option value="conference">Conference</option>
                          <option value="trade-show">Trade Show</option>
                          <option value="corporate-event">Corporate Event</option>
                          <option value="gala">Gala / Awards</option>
                          <option value="headshot-program">
                            Corporate Headshot Program
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="eventDate"
                          className="block text-body-sm font-medium text-jhr-white mb-2"
                        >
                          Event Date (if known)
                        </label>
                        <input
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="venue"
                        className="block text-body-sm font-medium text-jhr-white mb-2"
                      >
                        Venue (if known)
                      </label>
                      <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors"
                        placeholder="Music City Center, Gaylord Opryland, etc."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-body-sm font-medium text-jhr-white mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors resize-none"
                        placeholder="Tell us about your event and what you're looking for..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>

                    {submitStatus === "error" && (
                      <p className="text-red-400 text-body-sm text-center">
                        {errorMessage || "Something went wrong."} Please try again or email us
                        directly.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>
    </div>
  );
}
