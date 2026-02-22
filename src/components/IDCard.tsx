"use client";

import { useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import { api } from "@/lib/api";

interface IDCardProps {
  name: string | null;
  motto: string | null;
  level: string;
  learningRole: string;
  favoriteSubjects?: string[];
  onMottoSaved?: () => void;
}

export function IDCard({
  name,
  motto: initialMotto,
  level,
  learningRole,
  favoriteSubjects = ["Mathematics", "Science"],
  onMottoSaved,
}: IDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [motto, setMotto] = useState(initialMotto ?? "");
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const [savingMotto, setSavingMotto] = useState(false);

  async function saveMotto() {
    setIsEditingMotto(false);
    setSavingMotto(true);
    const { error } = await api.user.updateMotto(motto);
    setSavingMotto(false);
    if (!error) onMottoSaved?.();
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `learn-vault-id-${name ?? "user"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "Learn Vault ID Card",
          text: `${name ?? "User"} on Learn Vault - ${motto || "No motto"}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div ref={cardRef} className="p-0 bg-white">
        {/* Green banner */}
        <div className="h-20 bg-lv-dark-green w-full" />
        <div className="px-4 pb-4 -mt-12 relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl shadow-md">
                {(name ?? "U").charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-black truncate">
                {name || "User"}
              </h2>
              <p className="text-black text-sm">
                {learningRole} | Level: {level}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lv-accent-yellow text-black font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lv-accent-yellow text-black font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Bio / Personal Motto */}
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-200 px-4 py-2">
              <span className="font-bold text-black">Bio / Personal Motto</span>
            </div>
            <div className="bg-gray-100 p-4">
              {isEditingMotto ? (
                <div className="space-y-2">
                  <textarea
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="Your personal motto..."
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black bg-white resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveMotto}
                      disabled={savingMotto}
                      className="px-3 py-1.5 rounded-lg bg-lv-dark-green text-white text-sm font-medium disabled:opacity-50"
                    >
                      {savingMotto ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMotto(initialMotto ?? "");
                        setIsEditingMotto(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-black text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  onClick={() => setIsEditingMotto(true)}
                  className="text-black cursor-pointer hover:bg-gray-200/50 rounded p-1 -m-1 min-h-[2rem]"
                  title="Click to edit"
                >
                  {motto || "Click to add your personal motto..."}
                </p>
              )}
            </div>
          </div>

          {/* Favorite Subjects - purple dotted box */}
          <div className="mt-4 rounded-xl border-2 border-dashed border-purple-400 bg-purple-50 p-4">
            <h3 className="font-bold text-black mb-2">Favorite Subjects</h3>
            <ul className="space-y-1 text-black text-sm">
              {favoriteSubjects.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
