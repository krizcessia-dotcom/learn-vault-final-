import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-lv-dark-green text-white hover:bg-lv-medium-green",
  secondary: "bg-lv-medium-green text-white hover:bg-lv-forest",
  outline: "border-2 border-black text-black hover:bg-gray-100",
  ghost: "bg-gray-300 text-black hover:bg-gray-400",
};

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm transition-colors";
  const widthStyles = fullWidth ? "w-full" : "";
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={combinedStyles}>
      {children}
    </button>
  );
}
