"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, DollarSign, FileText, ShoppingBag } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/Button";
import { IDCard } from "@/components/IDCard";
import { api } from "@/lib/api";

const TASK_SLUGS: Record<string, string> = {
  daily_checkin: "Daily check-in",
  pomodoro_1: "Complete 1 Pomodoro",
  study_60: "Study 60 mins total",
  flashcards_10: "Review 10 flashcards",
  upload_note: "Upload quality note",
  pomodoro_3: "3 Pomodoros",
  streak_7: "7-day streak",
};

export default function DashboardPage() {
  const [data, setData] = useState<{
    user: { name: string | null; motto: string | null; birthday: string | null; level: string; learningRole: string };
    wallet: { balance: number; totalEarned: number };
    notesUploaded: number;
    notesBought: number;
  } | null>(null);
  const [tasks, setTasks] = useState<
    Array<{ slug: string; label: string; reward: number; rewardText: string; completed: boolean }>
  >([]);
  const [myNotes, setMyNotes] = useState<Array<{ id: string; title: string; price: number }>>([]);
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  useEffect(() => {
    api.dashboard().then((r) => r.data && setData(r.data));
    api.dailyTasks.list().then((r) => r.data && setTasks(r.data));
    api.notes.myNotes().then((r) => r.data && setMyNotes(r.data));
  }, []);

  async function completeTask(slug: string) {
    setLoadingTask(slug);
    const { data: res, error } = await api.dailyTasks.complete(slug);
    setLoadingTask(null);
    if (error) {
      alert(error);
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.slug === slug ? { ...t, completed: true } : t))
    );
    if (data?.wallet)
      setData({
        ...data,
        wallet: { ...data.wallet, balance: data.wallet.balance + (res?.reward ?? 0) },
      });
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div
          className="lg:col-span-2 rounded-xl p-6 md:p-8"
          style={{
            background: "linear-gradient(135deg, #C0E8C7 0%, #A8D8B0 100%)",
          }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">
            Welcome back, {data.user.name || "User"}!
          </h2>
          <p className="text-black">Lets make today productive ✨</p>
          <Link href="/tutors/apply" className="inline-block mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-lv-accent-yellow text-black font-medium hover:opacity-90"
            >
              + Apply as Tutor
            </button>
          </Link>
        </div>

        <div className="lg:col-span-1">
          <IDCard
            name={data.user.name}
            motto={data.user.motto}
            level={data.user.level}
            learningRole={data.user.learningRole}
            onMottoSaved={() => {
              api.dashboard().then((r) => r.data && setData(r.data));
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="LV points" value={data.wallet.balance} icon={Coins} />
        <StatsCard title="Total Earned" value={data.wallet.totalEarned} icon={DollarSign} />
        <StatsCard title="Notes Uploaded" value={data.notesUploaded} icon={FileText} />
        <StatsCard title="Notes bought" value={data.notesBought} icon={ShoppingBag} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-4">Daily Task</h2>
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ backgroundColor: "#C0E8C7" }}
          >
            {tasks.map((task) => (
              <div
                key={task.slug}
                className="flex items-center justify-between gap-3 text-black"
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  ) : (
                    <button
                      onClick={() => completeTask(task.slug)}
                      disabled={loadingTask === task.slug}
                      className="w-5 h-5 rounded-full border-2 border-black flex-shrink-0 hover:bg-gray-200 disabled:opacity-50"
                    />
                  )}
                  <span>
                    {task.label} → {task.rewardText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">My notes</h2>
            <Link href="/marketplace/upload">
              <Button variant="primary" className="text-sm py-2 px-4">
                Upload notes
              </Button>
            </Link>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[280px]">
            {myNotes.length === 0 ? (
              <>
                <div className="w-16 h-16 text-gray-400 mb-4">
                  <FileText className="w-full h-full" />
                </div>
                <p className="text-black text-center">
                  You haven&apos;t uploaded any notes yet
                </p>
              </>
            ) : (
              <div className="w-full space-y-2">
                {myNotes.map((n) => (
                  <Link
                    key={n.id}
                    href={`/marketplace?note=${n.id}`}
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    {n.title} — {n.price} LV
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
