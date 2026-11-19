import { ChevronDown, CircleQuestionMark } from 'lucide-react';

const FAQ = [
  {
    question: 'How do I reset my password?',
    answer:
      'To reset your password, go to the account settings and click on "Reset Password".',
  },
  {
    question: 'How do I change my email address?',
    answer:
      'To change your email address, go to the account settings and update your email information.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'To delete your account, please contact our support team.',
  },
  {
    question: 'Can I change my booking?',
    answer: 'Yes, you can change your booking by contacting our support team.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'You can cancel your booking up to 24 hours in advance for a full refund.',
  },
  {
    question: 'Do you offer group discounts?',
    answer:
      'Yes, we offer group discounts for bookings of 1000 or more people.',
  },
];

export function BookingFaq() {
  return (
    <section
      aria-labelledby="booking-faq-title"
      className="rounded-md bg-muted-background"
    >
      <div className="px-2 pt-5 pb-3">
        <h3
          id="booking-faq-title"
          className="flex items-center gap-1 text-base text-neutral-900"
        >
          <CircleQuestionMark className="size-5" aria-hidden="true" />
          Booking questions
        </h3>
        <p className="pl-6 pt-2 text-xs text-neutral-900">
          Find answers to common booking questions below.
        </p>
        <div className="divide-y divide-neutral-200">
          {FAQ.map(({ question, answer }) => (
            <details key={question} name="booking-faq" className="group">
              <summary className="flex cursor-pointer border-b border-neutral-900 list-none items-center justify-between gap-4 py-4 text-sm [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden="true"
                  size={16}
                  className="shrink-0 group-open:rotate-180"
                />
              </summary>
              <p className="pb-4 text-sm text-neutral-600">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
