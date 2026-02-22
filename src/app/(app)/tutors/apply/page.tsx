"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ApplyAsTutorPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [price4Sessions, setPrice4Sessions] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("");
  const [certifications, setCertifications] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const subjectList = subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/tutors/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: bio || undefined,
        subjects: subjectList.length ? subjectList : undefined,
        pricePerHour: pricePerHour ? parseInt(pricePerHour, 10) : undefined,
        price4Sessions: price4Sessions ? parseInt(price4Sessions, 10) : undefined,
        yearsExp: yearsExp ? parseInt(yearsExp, 10) : undefined,
        teachingStyle: teachingStyle || undefined,
        certifications: certifications || undefined,
      }),
      credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Request failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-black mb-8">Apply as Tutor</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 rounded-xl border border-gray-200 p-6"
      >
        <div>
          <label className="block text-sm font-medium text-black mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Tell students about yourself"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Subjects (comma-separated)
          </label>
          <input
            type="text"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g. Mathematics, Science, English"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Price per hour (LV)
            </label>
            <input
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              min={0}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Price for 4 sessions (LV)
            </label>
            <input
              type="number"
              value={price4Sessions}
              onChange={(e) => setPrice4Sessions(e.target.value)}
              min={0}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Years of experience
          </label>
          <input
            type="number"
            value={yearsExp}
            onChange={(e) => setYearsExp(e.target.value)}
            min={0}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Teaching style
          </label>
          <input
            type="text"
            value={teachingStyle}
            onChange={(e) => setTeachingStyle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g. Interactive, visual, practice-heavy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Certifications
          </label>
          <textarea
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="List any relevant certifications"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-lv-accent-yellow text-black font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit application"}
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
