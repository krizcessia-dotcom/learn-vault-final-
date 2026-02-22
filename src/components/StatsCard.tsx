import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-gray-200 p-6 min-h-[120px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-bold text-black text-sm md:text-base">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-amber-500" />}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-black mt-2">{value}</p>
    </div>
  );
}
