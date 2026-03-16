import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "JHR Photography LLC terms of service. Review the terms and conditions governing use of our website and photography services.",
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
            Effective Date: January 1, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container max-w-3xl mx-auto">
          <div className="prose prose-invert prose-gold max-w-none space-y-8">
            <p className="text-body text-jhr-white-dim">
              Welcome to the JHR Photography LLC (&quot;JHR Photography,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) website. By accessing or using our website and
              services, you agree to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use our website or services.
            </p>

            {/* 1 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                1. Services
              </h2>
              <p className="text-body text-jhr-white-dim">
                JHR Photography provides corporate event photography, headshot activation services,
                conference media coverage, executive imaging, and event video systems. We primarily
                serve the Nashville, Tennessee area and travel nationally for events. Specific
                service terms, deliverables, timelines, and pricing are established through
                individual client agreements and are separate from these website terms.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                2. Eligibility
              </h2>
              <p className="text-body text-jhr-white-dim">
                Use of this website and our services is limited to individuals who are at least 18
                years of age. By using this website or engaging our services, you represent and
                warrant that you are at least 18 years old and have the legal authority to enter into
                binding agreements.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                3. Copyright and Intellectual Property
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                All content on this website, including but not limited to photographs, text, logos,
                graphics, videos, and design elements, is the property of JHR Photography LLC and is
                protected by copyright and intellectual property laws.
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>
                  You may not reproduce, distribute, modify, or use any content without prior
                  written permission from JHR Photography.
                </li>
                <li>
                  All photographs taken by JHR Photography remain the intellectual property of JHR
                  Photography LLC unless otherwise specified in a separate written agreement.
                </li>
                <li>
                  Client usage rights for photographs are defined in individual service agreements
                  and do not transfer copyright ownership.
                </li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                4. Image Use and Model Releases
              </h2>
              <p className="text-body text-jhr-white-dim">
                All images captured by JHR Photography are subject to model release agreements where
                applicable and comply with universal photo copyright standards. By engaging our
                services at corporate events, conferences, or other public-facing engagements,
                attendees acknowledge that photographs may be taken and used for portfolio,
                marketing, social media, and promotional purposes. Specific image usage terms are
                outlined in individual client agreements.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                5. Booking and Payment
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                All bookings are subject to availability and require a signed service agreement.
                Payment terms, including deposits, are outlined in individual client agreements.
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>
                  A non-refundable retainer may be required to secure your event date.
                </li>
                <li>
                  Cancellation and rescheduling policies are defined in your service agreement.
                </li>
                <li>
                  Payment is processed through secure third-party payment providers. JHR Photography
                  does not store credit card information on our servers.
                </li>
              </ul>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                6. Use of Website
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                You agree to use this website only for lawful purposes. You may not:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Use the website in any way that violates applicable laws or regulations.</li>
                <li>Attempt to gain unauthorized access to any part of the website or its systems.</li>
                <li>
                  Use automated systems, bots, or scrapers to collect data from the website without
                  express written permission.
                </li>
                <li>Interfere with the proper functioning of the website.</li>
                <li>
                  Download, copy, or redistribute photographs or other content displayed on this
                  website.
                </li>
              </ul>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                7. Contact Form Submissions
              </h2>
              <p className="text-body text-jhr-white-dim">
                When you submit information through our contact or scheduling forms, you consent to
                us using that information to respond to your inquiry and provide relevant service
                information. We handle all submitted information in accordance with our{" "}
                <Link
                  href="/privacy"
                  className="text-jhr-gold hover:text-jhr-gold-light transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                JHR Photography provides this website and its content on an &quot;as is&quot; and
                &quot;as available&quot; basis. We make no warranties, expressed or implied, regarding
                the accuracy, completeness, reliability, or availability of the website content.
              </p>
              <p className="text-body text-jhr-white-dim">
                To the fullest extent permitted by law, JHR Photography LLC shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages arising from
                your use of this website, our services, or any related transactions. Our total
                liability for any claim related to our services shall not exceed the amount paid by
                you for the specific service giving rise to the claim.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                9. Indemnification
              </h2>
              <p className="text-body text-jhr-white-dim">
                You agree to indemnify and hold harmless JHR Photography LLC, its officers,
                employees, and agents from any claims, damages, losses, or expenses (including
                reasonable attorney&apos;s fees) arising from your use of this website, violation of
                these terms, or infringement of any third-party rights.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                10. Third-Party Links and Services
              </h2>
              <p className="text-body text-jhr-white-dim">
                Our website may contain links to third-party websites or services that are not
                operated or controlled by JHR Photography. We are not responsible for the content,
                privacy practices, or terms of any third-party sites. Your interaction with
                third-party services is governed by their respective terms and policies.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                11. Governing Law
              </h2>
              <p className="text-body text-jhr-white-dim">
                These Terms of Service are governed by and construed in accordance with the laws of
                the State of Tennessee. Any disputes arising from these terms or your use of our
                website or services shall be resolved in the courts located in Montgomery County,
                Tennessee.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-body text-jhr-white-dim">
                We reserve the right to modify these Terms of Service at any time. Changes will be
                effective immediately upon posting to this page. The effective date will always be
                noted at the top. Your continued use of the website after any changes constitutes
                acceptance of the updated terms.
              </p>
            </div>

            {/* 13 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                13. Contact Us
              </h2>
              <p className="text-body text-jhr-white-dim">
                If you have any questions about these Terms of Service, please{" "}
                <Link
                  href="/inquiry"
                  className="text-jhr-gold hover:text-jhr-gold-light transition-colors"
                >
                  contact us
                </Link>{" "}
                or reach out directly:
              </p>
              <p className="text-body text-jhr-white mt-4">
                JHR Photography LLC
                <br />
                Phone:{" "}
                <a
                  href="tel:+16152498096"
                  className="text-jhr-gold hover:text-jhr-gold-light transition-colors"
                >
                  (615) 249-8096
                </a>
                <br />
                Email:{" "}
                <a
                  href="mailto:info@jhr-photography.com"
                  className="text-jhr-gold hover:text-jhr-gold-light transition-colors"
                >
                  info@jhr-photography.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
