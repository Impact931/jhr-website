import type { Metadata } from "next";
import { ScheduleForm } from "./ScheduleForm";

export const metadata: Metadata = {
  title: "Schedule a Strategy Call",
  description:
    "Book a strategy call with JHR Photography. Discuss your corporate event coverage, headshot activations, or conference media needs with our team.",
  openGraph: {
    title: "Schedule a Strategy Call | JHR Photography",
    description:
      "Book a strategy call to discuss your event photography and media needs.",
  },
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Hero banner */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-jhr-black-light to-jhr-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4">
            Schedule a Strategy Call
          </h1>
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto">
            Let&apos;s talk about your event. Pick a time that works and
            we&apos;ll walk through your vision, logistics, and how we can help.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScheduleForm />
        </div>
      </section>
    </main>
  );
}
