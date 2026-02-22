"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FilterButtons } from "@/components/FilterButtons";
import { CarouselSection } from "@/components/CarouselSection";
import { NoteCard } from "@/components/NoteCard";

interface Note {
  id: string;
  title: string;
  description: string | null;
  price: number;
  sellerName: string | null;
  subject: string | null;
}

export default function MarketplacePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.notes.list().then((r) => {
      if (r.data) setNotes(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-black text-base mb-6">
        Enhance your learning with guided notes.
      </p>

      <FilterButtons filters={["Subject", "Price", "Ratings", "File type"]} />

      <CarouselSection>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            description={note.description || "Short description"}
            lvPoints={note.price}
          />
        ))}
      </CarouselSection>
    </div>
  );
}
