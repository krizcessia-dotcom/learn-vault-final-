"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { api } from "@/lib/api";

interface TutorCardProps {
  id: string;
  name: string;
  description: string;
  lvPoints: number;
}

export function TutorCard({ id, name, description, lvPoints }: TutorCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    setLoading(true);
    const { error } = await api.tutors.book(id, lvPoints);
    setLoading(false);
    if (error) {
      alert(error);
      return;
    }
    alert("Session booked successfully!");
  }

  return (
    <div className="flex-shrink-0 w-64 rounded-xl bg-lv-card-purple p-6 flex flex-col items-center">
      <span className="self-start text-green-600 font-medium text-sm">
        {lvPoints} LV
      </span>
      <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center my-4">
        <Users className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="font-bold text-black text-center mb-2">{name}</h3>
      <p className="text-sm text-black text-center mb-4 flex-1">{description}</p>
      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-lv-accent-yellow text-black text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Booking..." : "+ Book a session"}
      </button>
    </div>
  );
}
