"use client";

import { useState } from "react";
import { Calendar, Send, Loader2, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

const SERVICE_OPTIONS = [
  "Executive Imaging",
  "Headshot Activation",
  "Corporate Event Coverage",
  "Trade-Show Media",
  "Networking & Social Events",
  "General Inquiry",
] as const;

const TIME_OPTIONS = [
  "Morning (9am-12pm)",
  "Afternoon (12pm-3pm)",
  "Late Afternoon (3pm-5pm)",
] as const;

const CALL_TYPE_OPTIONS = [
  "Phone Call",
  "Video Call (Zoom)",
  "In-Person Meeting",
] as const;

const inputClasses =
  "w-full px-4 py-3 min-h-[44px] bg-jhr-black-lighter border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:border-jhr-gold focus:ring-1 focus:ring-jhr-gold transition-colors";

const labelClasses = "block text-body-sm font-medium text-jhr-white mb-2";

export function ScheduleForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "",
    preferredDate: "",
    preferredTime: "",
    callType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Submission failed");
      }

      trackEvent("schedule_form_submit", {
        form_page: window.location.pathname,
        service_interest: formData.serviceInterest || undefined,
        call_type: formData.callType || undefined,
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceInterest: "",
        preferredDate: "",
        preferredTime: "",
        callType: "",
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

  if (submitStatus === "success") {
    return (
      <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-8 lg:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-jhr-gold/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-jhr-gold" />
        </div>
        <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-3">
          Call Requested!
        </h2>
        <p className="text-body-md text-jhr-white-dim mb-6 max-w-md mx-auto">
          We&apos;ll confirm your strategy call within one business day.
          Check your email for a calendar invitation.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="text-jhr-gold hover:text-jhr-gold-light transition-colors text-body-md font-medium"
        >
          Schedule another call
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6 lg:p-10 space-y-6"
    >
      {/* Name & Company */}
      <div className="grid sm:grid-cols-2 gap-4">
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
        <div>
          <label htmlFor="company" className={labelClasses}>
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Company name"
          />
        </div>
      </div>

      {/* Email & Phone */}
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

      {/* Service Interest */}
      <div>
        <label htmlFor="serviceInterest" className={labelClasses}>
          What are you interested in?
        </label>
        <select
          id="serviceInterest"
          name="serviceInterest"
          value={formData.serviceInterest}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Select a service...</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Preferred Date & Time */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="preferredDate" className={labelClasses}>
            <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="preferredTime" className={labelClasses}>
            Preferred Time
          </label>
          <select
            id="preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select a time...</option>
            {TIME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Call Type */}
      <div>
        <label className={labelClasses}>How would you like to connect?</label>
        <div className="grid sm:grid-cols-3 gap-3">
          {CALL_TYPE_OPTIONS.map((option) => (
            <label
              key={option}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors text-center ${
                formData.callType === option
                  ? "border-jhr-gold bg-jhr-gold/10 text-jhr-white"
                  : "border-jhr-black-lighter bg-jhr-black-lighter text-jhr-white-muted hover:border-jhr-gold/50"
              }`}
            >
              <input
                type="radio"
                name="callType"
                value={option}
                checked={formData.callType === option}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-body-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClasses}>
          Anything you&apos;d like us to know before the call?
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className={`${inputClasses} resize-none`}
          placeholder="Brief overview of your event or project..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Requesting...
          </>
        ) : (
          <>
            Request Strategy Call
            <Send className="w-5 h-5 ml-2" />
          </>
        )}
      </button>

      {submitStatus === "error" && (
        <p className="text-red-400 text-body-sm text-center">
          {errorMessage || "Something went wrong."} Please try again or email us
          at info@jhr-photography.com.
        </p>
      )}
    </form>
  );
}
