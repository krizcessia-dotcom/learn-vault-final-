"use client";

import { useState } from "react";
import {
  Mail,
  Heart,
  Share2,
  Star,
} from "lucide-react";

type ProfileType = "tutor" | "student";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profileType] = useState<ProfileType>("tutor");
  const [activeChart, setActiveChart] = useState("Science");
  const [activeMetric, setActiveMetric] = useState("Session completed");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Green banner */}
      <div className="h-24 bg-lv-dark-green -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 -mt-32 relative z-10">
        <div className="lg:col-span-1">
          <div className="rounded-xl border-2 border-dashed border-purple-400 bg-purple-50 p-4">
            <h3 className="font-bold text-black mb-4">
              {profileType === "tutor" ? "Subject offered" : "Favorite Subjects"}
            </h3>
            <ul className="space-y-2 text-black">
              {profileType === "tutor"
                ? ["Computer Science", "IT", "English", "Mathematics", "Science"]
                : ["Mathematics", "Science", "Study Streak : 5 days ✨"]}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl flex-shrink-0 -mt-16 border-4 border-white">
              👩
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black mb-2">
                Users Name!
              </h1>
              {profileType === "tutor" ? (
                <p className="text-black mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  4.8 ratings | 30 sessions completed
                </p>
              ) : (
                <p className="text-black mb-4">
                  Student | Level : Explorer 3! ✨⭐
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-lg bg-lv-accent-yellow text-black font-medium">
                  {profileType === "tutor" ? "+ Book session" : "+ Connect"}
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-200 px-4 py-2">
              <span className="font-bold text-black">Bio</span>
            </div>
            <div className="bg-gray-100 p-4">
              <p className="text-black">
                Passionate about improving skills through guided learning and
                consistent practice.
              </p>
            </div>
          </div>

          {profileType === "tutor" ? (
            <div
              className="mt-6 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{ backgroundColor: "#F5F0E8" }}
            >
              <div>
                <p className="font-bold text-black mb-2">Price/Rate:</p>
                <p className="text-black">500LV/ hour</p>
                <p className="text-black">1800LV/ 4 session</p>
              </div>
              <div>
                <p className="font-bold text-black mb-2">Years of Experience</p>
                <p className="font-bold text-black mb-2">Teaching Style</p>
              </div>
              <div>
                <p className="font-bold text-black mb-2">Certifications</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-black mb-4">Connections</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-black">Tutor 1</span>
                  <button className="px-3 py-1 rounded bg-lv-accent-yellow text-black text-sm font-medium">
                    Book session
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black">Friend</span>
                  <button className="px-3 py-1 rounded bg-lv-accent-yellow text-black text-sm font-medium">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Radar charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-black mb-4">Subject Proficiency</h3>
          <div className="flex gap-2 mb-4">
            {["Science", "Math", "English"].map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveChart(subject)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeChart === subject
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-300 text-black"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mb-4">
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-pink-400" />
              Science
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-800" />
              Math
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              English
            </span>
          </div>
          <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-400 text-sm">Radar Chart</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-black mb-4">Performance Overview</h3>
          <div className="flex gap-2 mb-4">
            {["Engagement", "Session completed", "Consistency"].map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeMetric === metric
                    ? "bg-gray-300 text-black"
                    : "bg-white border border-gray-300 text-black"
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mb-4">
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-pink-400" />
              Engagement
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-800" />
              Session completed
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              Consistency
            </span>
          </div>
          <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-400 text-sm">Radar Chart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
