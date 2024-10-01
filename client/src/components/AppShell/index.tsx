// src/components/AppShell.tsx
import Header from "./Header";
import Footer from "./Footer";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="max-w-3xl mx-auto w-full flex-grow">
        <main className="flex-grow">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</div>
        </main>
      </div>

      <div className="fixed bottom-0 w-full border-t bg-background border-gray-300">
        <Footer />
      </div>
    </div>
  );
}

export default AppShell;
