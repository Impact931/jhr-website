import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "JHR Photography privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-jhr-black">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-dark">
        <div className="section-container text-center">
          <h1 className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4">
            Privacy Policy
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
                Information We Collect
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                When you use our website or services, we may collect the following information:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Contact information (name, email address, phone number, company name)</li>
                <li>Event details you provide through our contact or scheduling forms</li>
                <li>Usage data collected through cookies and analytics tools</li>
                <li>Communications you send to us via email or forms</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Respond to your inquiries and schedule consultations</li>
                <li>Provide our photography and media services</li>
                <li>Send relevant communications about our services</li>
                <li>Improve our website and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Data Protection
              </h2>
              <p className="text-body text-jhr-white-dim">
                We implement appropriate technical and organizational security measures to protect
                your personal information against unauthorized access, alteration, disclosure, or
                destruction. Your data is stored securely using industry-standard encryption and
                access controls.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Cookies
              </h2>
              <p className="text-body text-jhr-white-dim">
                Our website uses cookies and similar tracking technologies to enhance your browsing
                experience and analyze site traffic. You can control cookie preferences through your
                browser settings. Essential cookies required for site functionality cannot be
                disabled.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Third-Party Services
              </h2>
              <p className="text-body text-jhr-white-dim">
                We may use third-party services for analytics, hosting, and payment processing.
                These services have their own privacy policies governing their use of your
                information. We do not sell your personal information to third parties.
              </p>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Your Rights
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                Contact Us
              </h2>
              <p className="text-body text-jhr-white-dim">
                If you have questions about this privacy policy or our data practices, please{" "}
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
