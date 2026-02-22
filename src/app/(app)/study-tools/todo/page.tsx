import Link from "next/link";

export default function TodoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/study-tools" className="text-lv-dark-green hover:underline mb-4 block">
        ← Back to Study Tools
      </Link>
      <h1 className="text-2xl font-bold text-black mb-8">To do list</h1>
      <p className="text-gray-600">
        To-do list feature. Add tasks and track your study goals.
      </p>
    </div>
  );
}
