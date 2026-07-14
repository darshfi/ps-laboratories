import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PS Laboratories',
  description:
    'Privacy Policy for PS Laboratories. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: '/legal/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: July 2026
      </p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-5">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <strong>Disclaimer:</strong> This privacy policy is a template provided
          for informational purposes. It has not been reviewed by a legal
          professional. PS Laboratories should consult with a qualified legal
          advisor to ensure compliance with applicable privacy laws, including
          India&apos;s Digital Personal Data Protection Act (DPDP), GDPR (if
          serving EU users), and other relevant regulations.
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            1. Introduction
          </h2>
          <p className="leading-relaxed">
            PS Laboratories (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
            &ldquo;us&rdquo;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website or submit enquiries
            through our forms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            2. Information We Collect
          </h2>
          <p className="leading-relaxed">We may collect the following information:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <strong>Personal Identification Information:</strong> Name,
              company name, email address, phone number.
            </li>
            <li>
              <strong>Enquiry Information:</strong> Product selections, quantity
              requirements, and any details you provide in your enquiry or quote
              request.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information, and browsing behavior through cookies and similar
              technologies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            3. How We Use Your Information
          </h2>
          <p className="leading-relaxed">We use the collected information for:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Responding to your enquiries and providing quotations</li>
            <li>Communicating with you about your requests</li>
            <li>Improving our products and services</li>
            <li>Sending relevant information about our services (with your consent)</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            4. Data Protection
          </h2>
          <p className="leading-relaxed">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            5. Third-Party Services
          </h2>
          <p className="leading-relaxed">
            We use Web3Forms to process form submissions. Your data is
            transmitted to Web3Forms servers for email delivery. We do not sell
            or rent your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            6. Data Retention
          </h2>
          <p className="leading-relaxed">
            We retain your personal information only as long as necessary to
            fulfill the purposes for which it was collected, or as required by
            applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            7. Your Rights
          </h2>
          <p className="leading-relaxed">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            8. Contact Us
          </h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us at{' '}
            <a
              href="mailto:info.pslaboratories@gmail.com"
              className="text-[#D6006D] hover:underline"
            >
              info.pslaboratories@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
