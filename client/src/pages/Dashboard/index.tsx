import AppShell from "@/components/AppShell";
import NewCommandStack from "@/components/commandStack/NewCommandStack";

function Dashboard() {
  return (
    <AppShell>
      <div className="flex flex-col text-indigo-900">
        <main className="flex-grow p-4 space-y-6">
          <section className="h-full">
            <NewCommandStack />
          </section>
        </main>
      </div>
    </AppShell>
  );
}

export default Dashboard;
