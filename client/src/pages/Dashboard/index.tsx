import AppShell from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  MicIcon,
  PlusCircleIcon,
  SearchIcon,
  BarChartIcon,
  CoffeeIcon,
  SparklesIcon,
  CameraIcon,
} from "lucide-react";
function Dashboard() {
  return (
    <AppShell>
      <div className="flex flex-col min-h-screen bg-indigo-50 text-indigo-900">
        <header className="p-4 bg-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-indigo-600">CafeTrack</h1>
            <Button variant="ghost" size="icon" className="text-indigo-600">
              <PlusCircleIcon className="w-6 h-6" />
              <span className="sr-only">Add New</span>
            </Button>
          </div>
          <h2 className="text-3xl font-light mb-6 text-indigo-800">
            Where inventory management begins
          </h2>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
            <Input
              type="text"
              placeholder="Search inventory, create lists, set alerts..."
              className="w-full pl-10 pr-20 py-3 bg-indigo-100 border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
              <Button variant="ghost" size="icon" className="text-indigo-600">
                <MicIcon className="w-5 h-5" />
                <span className="sr-only">Voice input</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-indigo-600">
                <CameraIcon className="w-5 h-5" />
                <span className="sr-only">Camera input</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-indigo-800">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="bg-white hover:bg-indigo-50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <MicIcon className="w-8 h-8 mb-2 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">
                    Voice Count
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-white hover:bg-indigo-50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <BarChartIcon className="w-8 h-8 mb-2 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">
                    Analytics
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-white hover:bg-indigo-50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <CoffeeIcon className="w-8 h-8 mb-2 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">
                    Inventory
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-white hover:bg-indigo-50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <PlusCircleIcon className="w-8 h-8 mb-2 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">
                    Add Inventory
                  </span>
                </CardContent>
              </Card>
            </div>
          </section>

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
