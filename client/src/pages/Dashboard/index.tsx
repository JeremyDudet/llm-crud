import AppShell from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";

import { SparklesIcon } from "lucide-react";
function Dashboard() {
  return (
    <AppShell>
      <div className="flex flex-col min-h-screen text-indigo-900">
        <main className="flex-grow p-4 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-indigo-800 flex items-center">
              <SparklesIcon className="w-6 h-6 mr-2 text-indigo-600" />
              AI Insights
            </h3>
            <Card className="bg-white">
              <CardContent className="p-0">
                <ul className="divide-y divide-indigo-100">
                  <li className="p-4 hover:bg-indigo-50 transition-colors">
                    <p className="text-sm text-indigo-600 font-medium flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      Espresso beans stock is low. Consider restocking soon.
                    </p>
                    <p className="text-xs text-indigo-400 mt-1 ml-6">
                      Based on your current usage patterns
                    </p>
                  </li>
                  <li className="p-4 hover:bg-indigo-50 transition-colors">
                    <p className="text-sm text-indigo-600 font-medium flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      New inventory count completed. Review suggested
                      adjustments.
                    </p>
                    <p className="text-xs text-indigo-400 mt-1 ml-6">
                      AI detected potential discrepancies
                    </p>
                  </li>
                  <li className="p-4 hover:bg-indigo-50 transition-colors">
                    <p className="text-sm text-indigo-600 font-medium flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      Coffee sales are up 15% this week. Consider increasing
                      stock.
                    </p>
                    <p className="text-xs text-indigo-400 mt-1 ml-6">
                      Based on sales trend analysis
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </AppShell>
  );
}

export default Dashboard;
