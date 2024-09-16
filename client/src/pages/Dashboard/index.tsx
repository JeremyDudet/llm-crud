import AppShell from "@/components/AppShell";
import CommandStack from "@/components/commandStack/CommandStack";

function Dashboard() {
  return (
    <AppShell>
      <div className="flex flex-col text-indigo-900">
        <main className="flex-grow p-4 space-y-6">
          <section>
            <CommandStack />
          </section>
        </main>
      </div>
    </AppShell>
  );
}

export default Dashboard;
