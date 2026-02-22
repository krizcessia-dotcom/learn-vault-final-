import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div
        className="rounded-2xl p-8 md:p-12 lg:p-16 text-center"
        style={{
          background: "linear-gradient(135deg, #C0E8C7 0%, #A8D8B0 50%, #90C898 100%)",
        }}
      >
        <h1
          className="text-xl md:text-2xl lg:text-3xl font-bold text-[#333333] mb-6 max-w-3xl mx-auto leading-tight"
          style={{ fontFamily: "var(--font-press-start), monospace" }}
        >
          Welcome To Learn Vault Study Platform
        </h1>
        <p className="text-base md:text-lg text-[#333333] mb-8 max-w-2xl mx-auto font-serif">
          Learn, teach, and earn with our comprehensive study platform. Buy and
          sell notes, find tutors, and use powerful study tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/signup" variant="primary">
            Get Started
          </Button>
          <Button href="/marketplace" variant="secondary">
            Browse Notes
          </Button>
        </div>
      </div>
    </section>
  );
}
