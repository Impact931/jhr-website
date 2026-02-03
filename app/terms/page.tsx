import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "JHR Photography terms of service. Review the terms and conditions governing use of our website and services.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-dark">
        <div className="section-container text-center">
          <h1 className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4">
            Terms of Service
          </h1>
          <p className="text-body-lg text-jhr-white-dim max-w-2xl mx-auto">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container max-w-3xl mx-auto">
          <div className="prose prose-invert prose-gold max-w-none space-y-8">
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Agreement to Terms
              </h2>
              <p className="text-body text-jhr-white-dim">
                By accessing or using the JHR Photography website, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our website
                or services.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Services
              </h2>
              <p className="text-body text-jhr-white-dim">
                JHR Photography provides corporate event photography, headshot activation services,
                and event video systems in the Nashville, Tennessee area. Specific service terms,
                deliverables, and pricing are established through individual client agreements and
                are separate from these website terms.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Intellectual Property
              </h2>
              <p className="text-body text-jhr-white-dim">
                All content on this website, including text, images, logos, and design elements, is
                the property of JHR Photography and is protected by copyright and intellectual
                property laws. You may not reproduce, distribute, or use any content without prior
                written permission.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Use of Website
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                You agree to use this website only for lawful purposes. You may not:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Use the website in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to any part of the website</li>
                <li>Use automated systems to scrape or collect data from the website</li>
                <li>Interfere with the proper functioning of the website</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Contact Form Submissions
              </h2>
              <p className="text-body text-jhr-white-dim">
                When you submit information through our contact or scheduling forms, you consent to
                us using that information to respond to your inquiry. We handle all submitted
                information in accordance with our{" "}
                <Link href="/privacy" className="text-jhr-gold hover:text-jhr-gold-light transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-body text-jhr-white-dim">
                JHR Photography provides this website on an &ldquo;as is&rdquo; basis. We make no
                warranties, expressed or implied, regarding the accuracy, completeness, or
                availability of the website content. JHR Photography shall not be liable for any
                damages arising from your use of this website.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Changes to Terms
              </h2>
              <p className="text-body text-jhr-white-dim">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting to this page. Your continued use of the website after any
                changes constitutes acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Contact Us
              </h2>
              <p className="text-body text-jhr-white-dim">
                If you have questions about these terms, please{" "}
                <Link href="/contact" className="text-jhr-gold hover:text-jhr-gold-light transition-colors">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
