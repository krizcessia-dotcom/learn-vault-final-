"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";

interface CarouselSectionProps {
  title?: string;
  children: React.ReactNode;
  bgColor?: string;
}

export function CarouselSection({
  title,
  children,
  bgColor = "bg-lv-section-purple",
}: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <div className={`${bgColor} rounded-xl p-6 md:p-8 relative`}>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <button
        onClick={scroll}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
