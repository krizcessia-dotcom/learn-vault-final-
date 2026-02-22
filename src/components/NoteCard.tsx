"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { api } from "@/lib/api";

interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  lvPoints: number;
}

export function NoteCard({ id, title, description, lvPoints }: NoteCardProps) {
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    const { error } = await api.notes.purchase(id);
    setLoading(false);
    if (error) {
      alert(error);
      return;
    }
    alert("Note purchased successfully!");
  }

  return (
    <div className="flex-shrink-0 w-64 rounded-xl bg-lv-card-purple p-6 flex flex-col items-center">
      <span className="self-start text-green-600 font-medium text-sm">
        {lvPoints} LV
      </span>
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center my-4">
        <BookOpen className="w-8 h-8 text-amber-600" />
      </div>
      <h3 className="font-bold text-black text-center mb-2">{title}</h3>
      <p className="text-sm text-black text-center flex-1 mb-4">{description}</p>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-lv-accent-yellow text-black text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Purchasing..." : "Purchase"}
      </button>
    </div>
  );
}
