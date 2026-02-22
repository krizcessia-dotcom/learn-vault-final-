import { HeaderWithBalance } from "@/components/HeaderWithBalance";
import { Footer } from "@/components/Footer";
import { AuthGuard } from "@/components/AuthGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <HeaderWithBalance />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
