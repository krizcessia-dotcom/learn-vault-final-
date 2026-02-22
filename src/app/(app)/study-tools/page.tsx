"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ClipboardList,
  Hourglass,
  Music,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Heart,
} from "lucide-react";
import { api } from "@/lib/api";

export default function StudyToolsPage() {
  const [timerMins, setTimerMins] = useState(25);
  const [timerSecs, setTimerSecs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isRunning || (timerMins === 0 && timerSecs === 0)) return;
    const t = setInterval(() => {
      setTimerSecs((s) => {
        if (s > 0) return s - 1;
        setTimerMins((m) => (m > 0 ? m - 1 : 0));
        return 59;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRunning, timerMins, timerSecs]);

  async function handleComplete() {
    const totalMins = 25 - timerMins - (timerSecs > 0 ? 1 : 0) || 1;
    setSaving(true);
    await api.pomodoro.complete(totalMins);
    setSaving(false);
    setIsRunning(false);
    setTimerMins(25);
    setTimerSecs(0);
  }

  function toggleTimer() {
    if (isRunning) {
      handleComplete();
    } else {
      setIsRunning(true);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">
        Study Tools
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link
          href="/study-tools/flashcards"
          className="rounded-xl p-6 flex items-center justify-between bg-green-100 hover:bg-green-200 transition-colors"
        >
          <span className="font-medium text-black">Create flashcards</span>
          <Layers className="w-8 h-8 text-black -rotate-12" />
        </Link>

        <Link
          href="/study-tools/todo"
          className="rounded-xl p-6 flex items-center justify-between bg-purple-100 hover:bg-purple-200 transition-colors"
        >
          <span className="font-medium text-black">To do list</span>
          <ClipboardList className="w-8 h-8 text-black -rotate-12" />
        </Link>

        <div className="rounded-xl p-6 bg-blue-100 flex flex-col items-center">
          <h3 className="text-blue-800 font-medium mb-4">Pomodoro Timer</h3>
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-3xl font-mono font-bold text-black"
              style={{ fontFamily: "var(--font-press-start), monospace" }}
            >
              {String(timerMins).padStart(2, "0")}:
              {String(timerSecs).padStart(2, "0")}
            </span>
            <Hourglass className="w-8 h-8 text-black" />
          </div>
          <button
            onClick={toggleTimer}
            disabled={saving}
            className="w-full max-w-[120px] px-6 py-3 bg-lv-dark-green text-white rounded-lg font-medium hover:bg-lv-medium-green disabled:opacity-50"
          >
            {saving ? "Saving..." : isRunning ? "Complete" : "Start"}
          </button>
        </div>

        <div className="rounded-xl p-6 bg-green-100">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-black">Music</span>
            <span className="text-sm text-black">Title</span>
          </div>
          <div className="h-1 bg-black/30 rounded-full mb-6 relative">
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black"
              style={{ left: "30%" }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-pink-400">
              <Music className="w-6 h-6" />
              <Music className="w-6 h-6" />
              <Music className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded hover:bg-black/10">
                <Shuffle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-black/10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-black text-white hover:bg-gray-800">
                <div className="w-4 h-4 flex items-center justify-center">
                  <span className="text-xs">||</span>
                </div>
              </button>
              <button className="p-2 rounded hover:bg-black/10">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-black/10">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
