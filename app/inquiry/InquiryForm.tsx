"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

const SERVICE_OPTIONS = [
  "Executive Imaging",
  "Headshot Activation",
  "Corporate Event Coverage",
  "Trade-Show Media",
  "Networking & Social Events",
  "Other",
] as const;

const MEDIA_USE_OPTIONS = [
  "Website",
  "Advertisement",
  "Social Media",
  "Internal Marketing",
  "Flyers & Brochers",
  "Youtube",
  "Sent to attendees",
] as const;

const INDUSTRY_OPTIONS = [
  "Professional Services",
  "Hospitality",
  "Marketing",
  "Construction",
  "Retail",
  "Real Estate",
  "Fitness",
  "Media",
  "Medical",
  "Public-Private",
  "Other",
] as const;

const BUDGET_OPTIONS = [
  "under $1000",
  "$1001 - $2000",
  "$2001 - $3000",
  "$3001 - $5000",
  "$5001 - $8000",
  "$8001 - $12000",
  "$12000+",
] as const;

const VIDEO_OPTIONS = [
  "Event Highlight (BRoll Hype Reel)",
  "Highlight + VOX (Event Highlight + Testimonials)",
  "Executive Story (Presenter Focus + Sit down Interviews + BRoll)",
  "Other (Explainers - Training - Recruitment - Product/Service)",
] as const;

const REFERRAL_OPTIONS = [
  "Google Search",
  "ChatGPT (or similar)",
  "Referral",
  "Nashville Area Chamber of Commerce",
  "Social Media",
  "Other",
] as const;

interface FormData {
  name: string;
  company: string;
  clientEventName: string;
  positionTitle: string;
  email: string;
  phone: string;
  website: string;
  eventDescription: string;
  multiDay: boolean;
  eventDate: string;
  eventDateEnd: string;
  locationVenue: string;
  services: string[];
  attendees: string;
  mediaUse: string[];
  industry: string;
  industryOther: string;
  goals: string;
  budget: string[];
  videoServices: string[];
  additionalInfo: string;
  referral: string[];
}

const initialFormData: FormData = {
  name: "",
  company: "",
  clientEventName: "",
  positionTitle: "",
  email: "",
  phone: "",
  website: "",
  eventDescription: "",
  multiDay: false,
  eventDate: "",
  eventDateEnd: "",
  locationVenue: "",
  services: [],
  attendees: "",
  mediaUse: [],
  industry: "",
  industryOther: "",
  goals: "",
  budget: [],
  videoServices: [],
  additionalInfo: "",
  referral: [],
};

const inputClasses =
  "w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors";

const labelClasses = "block text-body-sm font-medium text-jhr-white mb-2";

export function InquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Submission failed");
      }

      // GA4 conversion tracking
      trackEvent("inquiry_form_submit", {
        form_page: window.location.pathname,
        services: formData.services.join(", "),
        industry: formData.industry,
      });

      setSubmitStatus("success");
      setFormData(initialFormData);
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-8 lg:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-jhr-gold" />
        </div>
        <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-3">
          Inquiry Received!
        </h2>
        <p className="text-body-md text-jhr-white-dim mb-6 max-w-md mx-auto">
          Thank you for your interest. We&apos;ll review your event details and
          follow up within one business day with a custom media proposal.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="text-jhr-gold hover:text-jhr-gold-light transition-colors text-body-md font-medium"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6 lg:p-10 space-y-8"
    >
      {/* Section: Contact Information */}
      <fieldset className="space-y-5">
        <legend className="text-heading-sm font-display font-semibold text-jhr-gold mb-2">
          Contact Information
        </legend>

        <div>
          <label htmlFor="name" className={labelClasses}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="Full name"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className={labelClasses}>
              Your Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="Company name"
            />
          </div>
          <div>
            <label htmlFor="positionTitle" className={labelClasses}>
              Position / Title
            </label>
            <input
              type="text"
              id="positionTitle"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Your title"
            />
          </div>
        </div>

        <div>
          <label htmlFor="clientEventName" className={labelClasses}>
            Your Client &amp; Event Name *
          </label>
          <input
            type="text"
            id="clientEventName"
            name="clientEventName"
            value={formData.clientEventName}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="Client / event name"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClasses}>
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className={labelClasses}>
            Website *
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="https://yourcompany.com"
          />
        </div>
      </fieldset>

      {/* Section: Event Details */}
      <fieldset className="space-y-5">
        <legend className="text-heading-sm font-display font-semibold text-jhr-gold mb-2">
          Event Details
        </legend>

        <div>
          <label htmlFor="eventDescription" className={labelClasses}>
            Briefly describe your event and what kind of media coverage you need
            *
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            required
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="Tell us about the event, schedule, and what you envision..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="multiDay"
            name="multiDay"
            checked={formData.multiDay}
            onChange={handleChange}
            className="w-5 h-5 rounded border-jhr-black-lighter bg-jhr-black-lighter text-jhr-gold focus:ring-jhr-gold accent-jhr-gold"
          />
          <label htmlFor="multiDay" className="text-body-sm text-jhr-white">
            Is this a multi-day event?
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventDate" className={labelClasses}>
              Event Date{formData.multiDay ? " (Start)" : ""} *
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>
          {formData.multiDay && (
            <div>
              <label htmlFor="eventDateEnd" className={labelClasses}>
                Event Date (End)
              </label>
              <input
                type="date"
                id="eventDateEnd"
                name="eventDateEnd"
                value={formData.eventDateEnd}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="locationVenue" className={labelClasses}>
            Location / Venue *
          </label>
          <input
            type="text"
            id="locationVenue"
            name="locationVenue"
            value={formData.locationVenue}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="Music City Center, Gaylord Opryland, etc."
          />
        </div>

        <div>
          <label htmlFor="attendees" className={labelClasses}>
            Number of Attendees *
          </label>
          <input
            type="number"
            id="attendees"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            required
            min="1"
            className={inputClasses}
            placeholder="250"
          />
        </div>
      </fieldset>

      {/* Section: Services */}
      <fieldset className="space-y-5">
        <legend className="text-heading-sm font-display font-semibold text-jhr-gold mb-2">
          Services &amp; Requirements
        </legend>

        <div>
          <p className={labelClasses}>
            What service best meets your needs? *
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {SERVICE_OPTIONS.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.services.includes(option)
                    ? "border-jhr-gold bg-jhr-gold/10 text-jhr-white"
                    : "border-jhr-black-lighter bg-jhr-black-lighter text-jhr-white-muted hover:border-jhr-gold/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(option)}
                  onChange={() => handleMultiSelect("services", option)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                    formData.services.includes(option)
                      ? "border-jhr-gold bg-jhr-gold"
                      : "border-jhr-white-dim"
                  }`}
                >
                  {formData.services.includes(option) && (
                    <svg
                      className="w-3 h-3 text-jhr-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-body-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClasses}>Where will your media be viewed?</p>
          <div className="flex flex-wrap gap-2">
            {MEDIA_USE_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => handleMultiSelect("mediaUse", option)}
                className={`px-4 py-2 rounded-full text-body-sm border transition-colors ${
                  formData.mediaUse.includes(option)
                    ? "border-jhr-gold bg-jhr-gold/10 text-jhr-white"
                    : "border-jhr-black-lighter text-jhr-white-muted hover:border-jhr-gold/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClasses}>Do you require Video Services?</p>
          <div className="space-y-2">
            {VIDEO_OPTIONS.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.videoServices.includes(option)
                    ? "border-jhr-gold bg-jhr-gold/10 text-jhr-white"
                    : "border-jhr-black-lighter bg-jhr-black-lighter text-jhr-white-muted hover:border-jhr-gold/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.videoServices.includes(option)}
                  onChange={() => handleMultiSelect("videoServices", option)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                    formData.videoServices.includes(option)
                      ? "border-jhr-gold bg-jhr-gold"
                      : "border-jhr-white-dim"
                  }`}
                >
                  {formData.videoServices.includes(option) && (
                    <svg
                      className="w-3 h-3 text-jhr-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-body-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Section: Budget & Goals */}
      <fieldset className="space-y-5">
        <legend className="text-heading-sm font-display font-semibold text-jhr-gold mb-2">
          Budget &amp; Goals
        </legend>

        <div>
          <p className={labelClasses}>What is your estimated budget?</p>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => handleMultiSelect("budget", option)}
                className={`px-4 py-2 rounded-full text-body-sm border transition-colors ${
                  formData.budget.includes(option)
                    ? "border-jhr-gold bg-jhr-gold/10 text-jhr-white"
                    : "border-jhr-black-lighter text-jhr-white-muted hover:border-jhr-gold/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="goals" className={labelClasses}>
            What does a &quot;win&quot; look like for your media coverage?
          </label>
          <textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses} resize-none`}
            placeholder="What outcomes matter most to you?"
          />
        </div>
      </fieldset>

      {/* Section: About You */}
      <fieldset className="space-y-5">
        <legend className="text-heading-sm font-display font-semibold text-jhr-gold mb-2">
          About You
        </legend>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="industry" className={labelClasses}>
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">Select industry...</option>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {formData.industry === "Other" && (
            <div>
              <label htmlFor="industryOther" className={labelClasses}>
                If other — what industry?
              </label>
              <input
                type="text"
                id="industryOther"
                name="industryOther"
                value={formData.industryOther}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Your industry"
              />
            </div>
          )}
        </div>

        <div>
          <p className={labelClasses}>How did you hear about our services? *</p>
          <div className="flex flex-wrap gap-2">
            {REFERRAL_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => handleMultiSelect("referral", option)}
                className={`px-4 py-2 rounded-full text-body-sm border transition-colors ${
                  formData.referral.includes(option)
                    ? "border-jhr-gold bg-jhr-gold/10 text-jhr-white"
                    : "border-jhr-black-lighter text-jhr-white-muted hover:border-jhr-gold/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="additionalInfo" className={labelClasses}>
            Additional information or questions
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses} resize-none`}
            placeholder="Anything else we should know?"
          />
        </div>
      </fieldset>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting || formData.services.length === 0 || formData.referral.length === 0}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Inquiry
              <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </button>

        {submitStatus === "error" && (
          <p className="text-red-400 text-body-sm text-center mt-4">
            {errorMessage || "Something went wrong."} Please try again or email
            us at info@jhr-photography.com.
          </p>
        )}
      </div>
    </form>
  );
}
