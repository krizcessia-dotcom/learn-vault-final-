"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function UploadNotePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const p = parseInt(price, 10);
    if (!p || p < 1) {
      setError("Price must be at least 1 LV");
      return;
    }
    setLoading(true);
    let fileUrl: string | undefined;
    let fileType: string | undefined;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.notes.uploadFile(formData);
      if (uploadRes.error) {
        setError(uploadRes.error);
        setLoading(false);
        return;
      }
      fileUrl = uploadRes.data?.fileUrl;
      fileType = uploadRes.data?.fileType;
    }
    const { data, error: err } = await api.notes.create({
      title,
      description: description || undefined,
      subject: subject || undefined,
      price: p,
      fileUrl,
      fileType,
    });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (data) await api.dailyTasks.complete("upload_note");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-black mb-8">Upload Note</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 rounded-xl border border-gray-200 p-6"
      >
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Mathematics"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Price (LV) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={1}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-lv-dark-green text-white rounded-lg font-medium hover:bg-lv-medium-green disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        You can attach a PDF, Word doc, or image. File is stored on the server.
      </p>
    </div>
  );
}
