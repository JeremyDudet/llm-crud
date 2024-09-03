import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Coffee,
  ShoppingCart,
  Bell,
  Users,
  BarChart2,
  Mic,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUserEmail } = useSelector((state: RootState) => state.user);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" to="#">
          <Coffee className="h-6 w-6 text-indigo-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            CafeTrack
          </span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            className="text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
            to="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
            to="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
            to="#testimonials"
          >
            Testimonials
          </Link>
          {currentUserEmail ? (
            <Link to="/dashboard">
              <Button
                variant="default"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {currentUserEmail}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                variant="default"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Login / Register
              </Button>
            </Link>
          )}
        </nav>

        <button className="lg:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Mobile menu */}
      <nav
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } lg:hidden absolute top-16 left-0 right-0 flex-col items-center bg-white pb-4 shadow-md`}
      >
        <Link
          className="w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
          to="#features"
          onClick={toggleMenu}
        >
          Features
        </Link>
        <Link
          className="w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
          to="#how-it-works"
          onClick={toggleMenu}
        >
          How It Works
        </Link>
        <Link
          className="w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
          to="#testimonials"
          onClick={toggleMenu}
        >
          Testimonials
        </Link>
        {currentUserEmail ? (
          <Link to="/dashboard" className="w-full px-4 py-2">
            <Button
              variant="default"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {currentUserEmail}
            </Button>
          </Link>
        ) : (
          <Link to="/login" className="w-full px-4 py-2">
            <Button
              variant="default"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Login / Register
            </Button>
          </Link>
        )}
      </nav>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-indigo-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                  Effortless Cafe Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  CafeTrack simplifies your cafe operations. Speak to manage
                  inventory, create shopping lists, and stay on top of your
                  business with ease.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto">
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  className="text-indigo-500 border-indigo-500 hover:bg-indigo-50 w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">
              Features Designed for Busy Cafe Owners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Mic className="h-8 w-8 text-indigo-500" />}
                title="Voice-Powered Inventory"
                description="Simply speak to count and manage your inventory. It's as easy as having a conversation."
              />
              <FeatureCard
                icon={<ShoppingCart className="h-8 w-8 text-indigo-500" />}
                title="Smart Shopping Lists"
                description="Automatically generated lists ensure you never forget what to order."
              />
              <FeatureCard
                icon={<Bell className="h-8 w-8 text-indigo-500" />}
                title="Timely Alerts"
                description="Get friendly reminders when stock is low. Stay ahead of your inventory needs."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-indigo-500" />}
                title="Team Collaboration"
                description="Your whole team can use it together, improving communication and efficiency."
              />
              <FeatureCard
                icon={<BarChart2 className="h-8 w-8 text-indigo-500" />}
                title="Simple Analytics"
                description="Easy-to-understand insights to help you make better business decisions."
              />
              <FeatureCard
                icon={<Coffee className="h-8 w-8 text-indigo-500" />}
                title="Cafe-Centric Design"
                description="Built specifically for cafes, understanding your unique needs and workflows."
              />
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">
              How CafeTrack Works
            </h2>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
              <div className="w-full lg:w-1/2 aspect-video bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                <span className="text-2xl text-gray-400">Demo Video</span>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Three Simple Steps:
                </h3>
                <ol className="space-y-4">
                  {[
                    "Open the CafeTrack app on your phone",
                    "Tap the microphone and say what you've counted",
                    "Let CafeTrack organize everything for you",
                  ].map((step, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-gray-600">
                  No complicated menus or confusing buttons. CafeTrack is
                  designed to be as easy as having a conversation, perfect for
                  busy cafe owners focused on crafting great experiences.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">
              Loved by Cafe Owners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="CafeTrack has transformed how I manage my cafe. It's so intuitive, it feels like it reads my mind!"
                author="Sarah, Sunrise Cafe"
              />
              <TestimonialCard
                quote="I'm not tech-savvy, but CafeTrack makes me feel like a pro. It's like having a personal assistant for my cafe."
                author="Mike, The Daily Grind"
              />
            </div>
          </div>
        </section>
        <section
          id="cta"
          className="w-full py-12 md:py-24 lg:py-32 bg-indigo-500 text-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Simplify Your Cafe Management?
                </h2>
                <p className="mx-auto max-w-[600px] md:text-xl opacity-90">
                  Join thousands of happy cafe owners who are saving time and
                  reducing stress with CafeTrack.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    className="bg-gray-900 text-white hover:bg-gray-800 w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Button>
                </form>
                <p className="text-sm opacity-90">
                  Try it free for 14 days. No credit card needed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <p className="text-xs text-gray-500">
          © 2023 CafeTrack Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-indigo-500"
            to="#"
          >
            How to Use
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-indigo-500"
            to="#"
          >
            Contact Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="rounded-full bg-indigo-50 p-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <p className="italic text-gray-600 mb-4">"{quote}"</p>
      <p className="font-semibold text-gray-900">- {author}</p>
    </div>
  );
}
