export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Dark blurred background */}
      <div
        className="fixed inset-0 bg-cover bg-center blur-xl scale-110 -z-10"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920)",
          backgroundColor: "#1a1a2e",
        }}
      />
      <div className="fixed inset-0 bg-black/40 -z-10" />
      <div className="relative flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
