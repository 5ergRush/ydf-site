import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { festivalInfo } from "@/data/festival";

export const metadata: Metadata = { title: "Terms of Use" };

const terms = [
  {
    title: "Account scope",
    content:
      "Creating an account does not register you for the festival, reserve a place, or constitute a purchase. Festival registration and purchases are separate steps. The account is used to keep your information, product records, and personal lookup QR together.",
  },
  {
    title: "Eligibility",
    content:
      "You must be at least 16 years old to create and operate an online account. This restriction applies to the account service, not automatically to festival participation.",
  },
  {
    title: "Accurate information",
    content:
      "Provide an email you control and the first and last name that should appear on your festival records. You may correct your name later. Keep your login credentials private and contact us promptly if you believe your account has been compromised.",
  },
  {
    title: "Purchases and statuses",
    content:
      "When sales are introduced, your account may display product, price, currency, payment method, and status snapshots. A pending cash purchase keeps the price recorded when the purchase was created. Active means paid or otherwise confirmed; cancelled means cancelled by the participant; suspended means stopped by the organizer. Additional sales, cancellation, and refund terms will be presented separately before a purchase.",
  },
  {
    title: "QR use",
    content:
      "Your QR is a lookup shortcut for authorized festival team accounts. It is not by itself proof of identity, payment, admission, or ownership. The current record shown to the authorized team member is authoritative. We may rotate a QR token if it is exposed or misused.",
  },
  {
    title: "Acceptable use and suspension",
    content:
      "Do not attempt to access another participant’s information, bypass account controls, interfere with the service, or misuse QR codes. We may suspend an account to protect participants, records, or the service, and will maintain an administrative record of sensitive actions.",
  },
  {
    title: "Availability and changes",
    content:
      "We aim to keep the account service accurate and available but cannot promise uninterrupted operation. Features may change as festival operations and sales are introduced. Material changes to these terms will be dated and presented again where appropriate.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="The rules for creating and using a Yerevan Dance Festival online account."
      />
      <Container className="py-14 sm:py-20">
        <div className="brand-glass mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-10">
          <p className="text-sm font-bold text-accent">
            Effective July 23, 2026 · Draft for organizer review before launch
          </p>
          <p className="mt-5 leading-8 text-white/68">
            These terms are between you and Yerevan Dance Festival, organized by
            Arman Mkhitaryan in Armenia. Contact{" "}
            <a
              className="text-accent underline"
              href={`mailto:${festivalInfo.contactEmail}`}
            >
              {festivalInfo.contactEmail}
            </a>{" "}
            with account questions.
          </p>
          <div className="mt-8 space-y-9">
            {terms.map((term) => (
              <section key={term.title}>
                <h2 className="font-display text-2xl font-black">
                  {term.title}
                </h2>
                <p className="mt-3 leading-8 text-white/68">{term.content}</p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
