interface CardProps {
  children: React.ReactNode;
  className?: string;
  dotted?: boolean;
}

export function Card({ children, className = "", dotted = false }: CardProps) {
  const borderStyles = dotted
    ? "border-2 border-dashed border-gray-400"
    : "border border-gray-200";
  return (
    <div
      className={`rounded-xl bg-white p-6 ${borderStyles} ${className}`}
    >
      {children}
    </div>
  );
}
