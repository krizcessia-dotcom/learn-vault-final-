"use client";

import { useEffect, useState } from "react";
import { FilterButtons } from "@/components/FilterButtons";
import { CarouselSection } from "@/components/CarouselSection";
import { TutorCard } from "@/components/TutorCard";
import { api } from "@/lib/api";

interface Tutor {
  id: string;
  name: string | null;
  bio: string | null;
  subjects: string[];
  pricePerHour: number | null;
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tutors.list().then((r) => {
      if (r.data) setTutors(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading tutors...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-black text-base mb-6">
        Connect with expert tutors and mentors to enhance your learning
      </p>

      <FilterButtons filters={["Subject", "Price", "Ratings"]} />

      <CarouselSection>
        {tutors.map((t) => (
          <TutorCard
            key={t.id}
            id={t.id}
            name={t.name || "Tutor"}
            description={t.bio || "Short description/Bio"}
            lvPoints={t.pricePerHour ?? 0}
          />
        ))}
      </CarouselSection>
    </div>
  );
}
