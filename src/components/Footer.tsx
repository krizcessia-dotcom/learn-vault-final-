import Link from "next/link";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Browse Notes", href: "/marketplace" },
      { label: "Top Trending Notes", href: "/marketplace?tab=trending" },
      { label: "Find Tutors", href: "/tutors" },
    ],
  },
  {
    title: "Study Tools",
    links: [
      { label: "Flashcards", href: "/study-tools#flashcards" },
      { label: "focus music", href: "/study-tools#music" },
      { label: "Pomodoro Timer", href: "/study-tools#pomodoro" },
    ],
  },
  {
    title: "LV Points",
    links: [
      { label: "Buy LV Points", href: "/wallet" },
      { label: "Earn Daily Rewards", href: "/dashboard" },
      { label: "Cash Out Earnings", href: "/wallet" },
      { label: "Wallet History", href: "/wallet" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Report Abuse", href: "/report" },
      { label: "Community Guidelines", href: "/guidelines" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#333333] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-white text-sm mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-600 text-center">
          <p className="text-sm text-gray-400">
            © 2026 Learn Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
