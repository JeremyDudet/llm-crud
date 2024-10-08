import AppShell from "@/components/AppShell";
import LLMChat from "@/components/LLMChat";

function Dashboard() {
  return (
    <AppShell>
      <div className="flex flex-col text-indigo-900">
        <main className="flex-grow p-4 space-y-6">
          <section className="h-full">{/* <NewCommandStack /> */}</section>
          <section>
            <LLMChat />
          </section>
        </main>
      </div>
    </AppShell>
  );
}

export default Dashboard;
