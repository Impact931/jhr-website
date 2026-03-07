import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "JHR Photography LLC privacy policy. Learn how we collect, use, and protect your personal information when you visit our website or use our photography services.",
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
            Effective Date: January 1, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container max-w-3xl mx-auto">
          <div className="prose prose-invert prose-gold max-w-none space-y-8">
            <p className="text-body text-jhr-white-dim">
              JHR Photography LLC (&quot;JHR Photography,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) is committed to protecting your privacy and ensuring that your
              personal information is handled safely and responsibly. This Privacy Policy outlines
              how we collect, use, and safeguard your information when you visit our website or use
              our services.
            </p>

            {/* 1 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                1. Information We Collect
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                We collect information to provide better services to our clients. The types of
                personal data we collect may include:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>
                  <strong className="text-jhr-white">Contact Information:</strong> Name, email
                  address, phone number, and physical address.
                </li>
                <li>
                  <strong className="text-jhr-white">Usage Information:</strong> How you interact
                  with our website (e.g., IP address, browser type, device type, and pages visited).
                </li>
                <li>
                  <strong className="text-jhr-white">Payment Information:</strong> When you purchase
                  services from us, we collect payment details through secure third-party payment
                  providers.
                </li>
                <li>
                  <strong className="text-jhr-white">Client-Specific Information:</strong> Photos,
                  videos, or related data provided or captured during our photography services.
                </li>
              </ul>
              <p className="text-body text-jhr-white-dim mt-4">
                We do not knowingly collect personal information from individuals under the age of
                18.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                The information we collect is used to:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Provide our photography and related services.</li>
                <li>Process your orders and manage your bookings.</li>
                <li>Notify you about products, offers, and availability.</li>
                <li>Communicate with you about your session, services, or inquiries.</li>
                <li>Improve our services and website experience.</li>
                <li>Comply with legal obligations.</li>
              </ul>
              <p className="text-body text-jhr-white-dim mt-4">
                Information collected may also be used to notify customers and potential customers
                about products and services they have expressed interest in. However, opting into our
                newsletter will always require a separate, explicit opt-in process.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                3. Image Use and Model Releases
              </h2>
              <p className="text-body text-jhr-white-dim">
                All images captured by JHR Photography LLC are subject to model release agreements
                and comply with universal photo copyrights. By using our services, clients agree to
                these terms. Unless otherwise specified in a separate written agreement, JHR
                Photography retains copyright of all images and may use them for portfolio,
                marketing, and promotional purposes.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                4. How We Share Your Information
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                We do not sell, rent, or share your personal information with third parties, except
                in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>
                  <strong className="text-jhr-white">With Service Providers:</strong> We work with
                  trusted third-party service providers to assist us in delivering our services, such
                  as payment processors, email service providers, hosting platforms, and customer
                  relationship management (CRM) tools.
                </li>
                <li>
                  <strong className="text-jhr-white">Advertising Partners:</strong> We may share
                  anonymized or aggregated data with advertising networks (such as Meta/Facebook and
                  Google) to improve the relevance of our marketing efforts.
                </li>
                <li>
                  <strong className="text-jhr-white">Legal Compliance:</strong> We may disclose your
                  information if required by law or in response to valid requests by public
                  authorities (e.g., courts or government agencies).
                </li>
                <li>
                  <strong className="text-jhr-white">Business Transfers:</strong> In the event of a
                  merger, acquisition, or sale of assets, your personal data may be transferred.
                </li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                5. Use of AI and Automation
              </h2>
              <p className="text-body text-jhr-white-dim">
                As part of our image processing and editing services, we may use AI-driven
                technologies to enhance images and graphics. This may include tools for background
                removal, photo retouching, and quality adjustments. These technologies are used with
                care and under strict privacy and confidentiality agreements. We may also use
                AI-powered tools for internal business operations, including task management and
                workflow automation. No personally identifiable client data is permanently stored by
                these systems.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                6. How We Protect Your Information
              </h2>
              <p className="text-body text-jhr-white-dim">
                We implement industry-standard security measures to safeguard your data, including
                SSL encryption, secure servers, and regular system updates. Access to personal
                information is restricted to authorized personnel only. However, please note that no
                method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our
                website. These technologies help us:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>Understand user behavior and improve website performance.</li>
                <li>Provide personalized content and advertising.</li>
                <li>Measure the effectiveness of our marketing campaigns.</li>
                <li>Analyze site traffic via Google Analytics (GA4) and Meta Pixel.</li>
              </ul>
              <p className="text-body text-jhr-white-dim mt-4">
                You can adjust your browser settings to refuse cookies, but this may impact your
                experience on our website. Essential cookies required for site functionality cannot be
                disabled.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                8. Your Data Rights
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                Depending on your location, you may have the following rights regarding your personal
                data:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2">
                <li>
                  <strong className="text-jhr-white">Access:</strong> You have the right to request
                  a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-jhr-white">Correction:</strong> You can request that we
                  correct any inaccuracies in your data.
                </li>
                <li>
                  <strong className="text-jhr-white">Deletion:</strong> You have the right to
                  request that we delete your data, subject to legal obligations.
                </li>
                <li>
                  <strong className="text-jhr-white">Objection:</strong> You can object to the
                  processing of your personal data for marketing purposes.
                </li>
              </ul>
              <p className="text-body text-jhr-white-dim mt-4">
                If you would like to exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:info@jhr-photography.com"
                  className="text-jhr-gold hover:text-jhr-gold-light transition-colors"
                >
                  info@jhr-photography.com
                </a>
                .
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                9. We Do Not Do Business in the EU
              </h2>
              <p className="text-body text-jhr-white-dim">
                JHR Photography LLC does not operate or conduct business in the European Union and is
                not subject to GDPR compliance.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                10. Anonymized Data and Advertising Avatars
              </h2>
              <p className="text-body text-jhr-white-dim mb-4">
                We may use anonymized demographic data to help us better understand our audience and
                improve our marketing strategies. This data may include information such as age
                ranges, geographic regions, and general interests, but it does not identify you
                personally.
              </p>
              <p className="text-body text-jhr-white-dim">
                We may also use this anonymized data to create advertising avatars or audience
                profiles for marketing purposes. These avatars are based on aggregated data, which
                helps us serve more relevant content and advertisements to potential customers. This
                process does not involve the use of personally identifiable information (PII).
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                11. Third-Party Links
              </h2>
              <p className="text-body text-jhr-white-dim">
                Our website may contain links to third-party sites or services that are not operated
                by us. We are not responsible for the privacy practices or content of these sites.
                Please review the privacy policies of any third-party services you visit.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                12. Updates to This Privacy Policy
              </h2>
              <p className="text-body text-jhr-white-dim">
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or relevant legal requirements. Please check this page periodically for any
                updates. The effective date of the policy will always be noted at the top.
              </p>
            </div>

            {/* 13 */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-4">
                13. Contact Us
              </h2>
              <p className="text-body text-jhr-white-dim">
                If you have any questions or concerns about this Privacy Policy, please contact us:
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

            {/* Divider */}
            <hr className="border-jhr-black-lighter my-12" />

            {/* AI / GPT Ecosystem Addendum */}
            <div>
              <h2 className="text-heading-lg font-display font-semibold text-jhr-white mb-2">
                Privacy Policy Update &mdash; November 17, 2024
              </h2>
              <p className="text-body text-jhr-white-dim mb-6">
                Updated Privacy Policy covering use of GPT Ecosystem and AI enabled enhancements.
              </p>

              <h3 className="text-heading-md font-display font-semibold text-jhr-white mb-3">
                Data Collection and Use
              </h3>
              <p className="text-body text-jhr-white-dim mb-4">
                Our system collects only the information directly provided by users through their
                interactions with AI-powered assistants. This may include task details (type,
                priority, and specific requests) and user identifiers (names or IDs) to manage task
                routing and workflows. The collected data is processed solely for the purpose of
                facilitating task delegation and communication within the system, including routing
                tasks to the appropriate assistant and ensuring smooth workflows across operational
                modules.
              </p>

              <h3 className="text-heading-md font-display font-semibold text-jhr-white mb-3">
                Data Storage and Retention
              </h3>
              <p className="text-body text-jhr-white-dim mb-4">
                No user-provided data is permanently stored by us. Task-related information is
                temporarily processed during interactions with our automation platforms and AI
                ecosystem. Data is discarded immediately upon completion of task processing unless
                required temporarily for troubleshooting or compliance with applicable laws.
              </p>

              <h3 className="text-heading-md font-display font-semibold text-jhr-white mb-3">
                Data Sharing
              </h3>
              <p className="text-body text-jhr-white-dim mb-4">
                Information may be shared within our AI ecosystem to fulfill requests. Task-related
                data may be processed by third-party services such as Make.com, which provides
                automation and integration services. We cannot guarantee or specify the practices of
                OpenAI, Anthropic, or other SaaS providers used in this ecosystem. Please refer to
                their respective privacy policies for more information.
              </p>

              <h3 className="text-heading-md font-display font-semibold text-jhr-white mb-3">
                Data Security
              </h3>
              <p className="text-body text-jhr-white-dim mb-4">
                We prioritize data security within our AI ecosystem:
              </p>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2 mb-6">
                <li>Data is encrypted during transmission using SSL.</li>
                <li>Access to automation workflows is restricted to authorized personnel only.</li>
                <li>
                  Any identifiable user data is anonymized or discarded once processing is complete.
                </li>
              </ul>

              <h3 className="text-heading-md font-display font-semibold text-jhr-white mb-3">
                User Rights
              </h3>
              <ul className="list-disc list-inside text-body text-jhr-white-dim space-y-2 mb-6">
                <li>
                  <strong className="text-jhr-white">Access:</strong> Users may request access to
                  task-related information processed during their interactions.
                </li>
                <li>
                  <strong className="text-jhr-white">Correction:</strong> Users may provide
                  corrected input if they believe the data provided to the system is incorrect.
                </li>
                <li>
                  <strong className="text-jhr-white">Deletion:</strong> Users can request the
                  deletion of temporary task data. This applies only to data under our direct
                  control.
                </li>
              </ul>

              <p className="text-body text-jhr-white-dim">
                For any questions or concerns about your data and privacy related to our AI systems,
                please contact us at{" "}
                <a
                  href="mailto:info@jhr-photography.com"
                  className="text-jhr-gold hover:text-jhr-gold-light transition-colors"
                >
                  info@jhr-photography.com
                </a>
                . This policy may be updated periodically to reflect changes in our practices or
                legal requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
