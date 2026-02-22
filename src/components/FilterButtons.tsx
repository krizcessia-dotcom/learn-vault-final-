interface FilterButtonsProps {
  filters: string[];
}

export function FilterButtons({ filters }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          className="px-4 py-2 rounded-full bg-lv-accent-yellow text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
