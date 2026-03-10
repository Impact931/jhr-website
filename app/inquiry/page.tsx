import type { Metadata } from "next";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Media Inquiry",
  description:
    "Submit your event media inquiry to JHR Photography. Corporate event coverage, headshot activations, trade show media, and more in Nashville and beyond.",
  openGraph: {
    title: "Media Inquiry | JHR Photography",
    description:
      "Submit your event media inquiry. Corporate event coverage, headshot activations, trade show media, and more.",
  },
};

export default function InquiryPage() {
  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Hero banner */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-jhr-black-light to-jhr-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4">
            Media Inquiry
          </h1>
          <p className="text-body-lg text-jhr-white-muted max-w-2xl mx-auto">
            Tell us about your event and we&apos;ll put together a custom media
            package. Most inquiries receive a response within one business day.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
