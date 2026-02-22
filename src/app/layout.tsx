import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Learn Vault - Study Platform",
  description: "Learn, teach, and earn with our comprehensive study platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart.variable}>
      <body className="font-sans antialiased min-h-screen bg-white text-black">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
