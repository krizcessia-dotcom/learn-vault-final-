"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface FlashcardSet {
  id: string;
  title: string;
  flashcards: Array<{ id: string; front: string; back: string }>;
}

export default function FlashcardsPage() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.flashcards.list().then((r) => {
      if (r.data) setSets(r.data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const valid = cards.filter((c) => c.front.trim() && c.back.trim());
    setCreating(true);
    const { error } = await api.flashcards.create({ title, cards: valid });
    setCreating(false);
    if (!error) {
      setTitle("");
      setCards([{ front: "", back: "" }]);
      api.flashcards.list().then((r) => r.data && setSets(r.data));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/study-tools" className="text-lv-dark-green hover:underline mb-4 block">
        ← Back to Study Tools
      </Link>
      <h1 className="text-2xl font-bold text-black mb-8">Create flashcards</h1>

      <form onSubmit={handleCreate} className="max-w-xl space-y-4 mb-12">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Set title"
          required
          className="w-full p-3 border rounded-lg"
        />
        {cards.map((c, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={c.front}
              onChange={(e) => {
                const n = [...cards];
                n[i] = { ...n[i], front: e.target.value };
                setCards(n);
              }}
              placeholder="Front"
              className="flex-1 p-2 border rounded"
            />
            <input
              value={c.back}
              onChange={(e) => {
                const n = [...cards];
                n[i] = { ...n[i], back: e.target.value };
                setCards(n);
              }}
              placeholder="Back"
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCards([...cards, { front: "", back: "" }])}
            className="px-4 py-2 border rounded"
          >
            + Add card
          </button>
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 bg-lv-dark-green text-white rounded disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create set"}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-4">Your sets</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : sets.length === 0 ? (
        <p className="text-gray-500">No flashcard sets yet</p>
      ) : (
        <div className="space-y-2">
          {sets.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-lg border flex justify-between items-center"
            >
              <span>{s.title} ({s.flashcards.length} cards)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
