const BASE = "";

async function fetchApi<T>(
  url: string,
  init?: RequestInit
): Promise<{ data?: T; error?: string }> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { error: json.error ?? "Request failed" };
  return { data: json };
}

export const api = {
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      fetchApi("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  },
  wallet: {
    get: () => fetchApi<{ balance: number; totalEarned: number }>("/api/wallet"),
    transactions: () =>
      fetchApi<Array<{ type: string; amount: number; description: string; createdAt: string }>>(
        "/api/wallet/transactions"
      ),
    purchasePoints: (amount: number) =>
      fetchApi<{ balance: number }>("/api/wallet/purchase-points", {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    cashout: (lvAmount: number) =>
      fetchApi<{ balance: number; message: string }>("/api/wallet/cashout", {
        method: "POST",
        body: JSON.stringify({ lvAmount }),
      }),
    pending: () =>
      fetchApi<{ lvAmount: number; pesoAmount: number; status: string } | null>(
        "/api/wallet/pending"
      ),
  },
  notes: {
    list: (subject?: string) =>
      fetchApi<Array<{
        id: string;
        title: string;
        description: string | null;
        price: number;
        sellerName: string | null;
        subject: string | null;
      }>>(`/api/notes${subject ? `?subject=${subject}` : ""}`),
    create: (body: {
      title: string;
      description?: string;
      subject?: string;
      price: number;
      fileUrl?: string;
      fileType?: string;
    }) =>
      fetchApi<{ id: string }>("/api/notes", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    uploadFile: (formData: FormData) =>
      fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json.error ?? "Upload failed" };
        return { data: json as { fileUrl: string; fileType: string } };
      }),
    purchase: (id: string) =>
      fetchApi("/api/notes/" + id + "/purchase", { method: "POST" }),
    myNotes: () =>
      fetchApi<Array<{ id: string; title: string; price: number }>>("/api/notes/my"),
  },
  dashboard: () =>
    fetchApi<{
      user: { name: string | null; motto: string | null; birthday: string | null; level: string; learningRole: string };
      wallet: { balance: number; totalEarned: number };
      notesUploaded: number;
      notesBought: number;
    }>("/api/dashboard"),
  user: {
    updateMotto: (motto: string) =>
      fetchApi<{ motto: string | null }>("/api/user", {
        method: "PATCH",
        body: JSON.stringify({ motto }),
      }),
  },
  dailyTasks: {
    list: () =>
      fetchApi<
        Array<{
          slug: string;
          label: string;
          reward: number;
          rewardText: string;
          completed: boolean;
        }>
      >("/api/daily-tasks"),
    complete: (taskSlug: string) =>
      fetchApi<{ success: boolean; reward: number }>(
        "/api/daily-tasks/complete",
        { method: "POST", body: JSON.stringify({ taskSlug }) }
      ),
  },
  tutors: {
    list: () =>
      fetchApi<
        Array<{
          id: string;
          name: string | null;
          bio: string | null;
          subjects: string[];
          pricePerHour: number | null;
        }>
      >("/api/tutors"),
    book: (tutorId: string, lvAmount: number) =>
      fetchApi("/api/tutors/book", {
        method: "POST",
        body: JSON.stringify({ tutorId, lvAmount }),
      }),
  },
  pomodoro: {
    complete: (minutes: number) =>
      fetchApi("/api/pomodoro/complete", {
        method: "POST",
        body: JSON.stringify({ minutes }),
      }),
  },
  flashcards: {
    list: () =>
      fetchApi<
        Array<{
          id: string;
          title: string;
          flashcards: Array<{ id: string; front: string; back: string }>;
        }>
      >("/api/flashcards"),
    create: (body: {
      title: string;
      cards?: Array<{ front: string; back: string }>;
    }) =>
      fetchApi<{ id: string }>("/api/flashcards", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
};
