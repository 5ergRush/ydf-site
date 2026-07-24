import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { festivalInfo } from "@/data/festival";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "Who is responsible",
    content: (
      <>
        Yerevan Dance Festival is organized by Arman Mkhitaryan in Armenia.
        Questions and privacy requests can be sent to{" "}
        <a
          className="text-accent underline"
          href={`mailto:${festivalInfo.contactEmail}`}
        >
          {festivalInfo.contactEmail}
        </a>
        .
      </>
    ),
  },
  {
    title: "Information we process",
    content:
      "For an account, we process your email address, first and last name, confirmation that you are at least 16, policy acceptance records, login and security information, account role and status, personal QR lookup token, and the festival products connected to you. Purchase records may include the product snapshot, locked price and currency, payment method, status, dates, and administrative notes. We do not collect or store card numbers, CVV codes, or cardholder details.",
  },
  {
    title: "Why we use it",
    content:
      "We use this information to create and secure your account, show your festival records, support entry and team lookups, manage purchases and payment status, answer requests, prevent misuse, and maintain an audit trail of sensitive changes.",
  },
  {
    title: "Services and access",
    content:
      "Account and purchase data is hosted in Supabase. The website is hosted on Vercel. Resend is planned for authentication email delivery, Cloudflare Turnstile for bot protection, and Google for optional social login. Authorized volunteers can view participant and purchase information; staff can make limited operational corrections; administrators have broader management access. Access is restricted according to role.",
  },
  {
    title: "Retention and account closure",
    content:
      "You may request account closure by email. Ordinary profile information will be removed or anonymized where reasonably possible. Purchase, payment, security, and audit records may be retained where needed for accounting, disputes, fraud prevention, or legal obligations. They are not made public.",
  },
  {
    title: "Your choices and rights",
    content:
      "You can correct your name in your personal space. You may contact us to request access, correction, account closure, or information about how your data is used. Email corrections require administrator assistance because the email is also the login identity.",
  },
  {
    title: "Age restriction",
    content:
      "Online accounts are available only to people aged 16 or older. This account restriction does not determine eligibility to attend the festival; arrangements for younger participants, if needed, are handled separately.",
  },
  {
    title: "Security and changes",
    content:
      "We use role-based access, database row-level security, verified email, audit records, and revocable QR tokens. No internet service can guarantee absolute security. Material policy changes will be dated and presented for acknowledgement where appropriate.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How the Yerevan Dance Festival account system handles personal and purchase information."
      />
      <Container className="py-14 sm:py-20">
        <div className="brand-glass mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-10">
          <p className="text-sm font-bold text-accent">
            Effective July 23, 2026 · Draft for organizer review before launch
          </p>
          <div className="mt-8 space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl font-black">
                  {section.title}
                </h2>
                <p className="mt-3 leading-8 text-white/68">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
