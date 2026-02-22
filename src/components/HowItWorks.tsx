import { Card } from "@/components/ui/Card";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description:
      "Create your account and get started with bonus LV Points",
  },
  {
    number: 2,
    title: "Explore & Learn",
    description:
      "Browse notes, find tutors, and use study tools to enhance your learning.",
  },
  {
    number: 3,
    title: "Earn & Grow",
    description:
      "Sell your notes, complete tasks, and build your study streak to earn more.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold text-black text-center uppercase mb-12 md:mb-16">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step) => (
          <div key={step.number} className="relative">
            <Card dotted className="relative pt-14 pb-6 text-center h-full">
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg"
                style={{ fontFamily: "var(--font-press-start), monospace" }}
              >
                {step.number}
              </div>
              <h3 className="font-bold text-black text-lg mb-4 font-serif">
                {step.title}
              </h3>
              <p className="text-black text-sm md:text-base font-serif">
                {step.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
