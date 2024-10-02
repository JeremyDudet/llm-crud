import { Home, BarChart, Library } from "lucide-react";
import { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";

type Nav = Array<{
  name: string;
  href: string;
  current: boolean;
  icon: React.ElementType;
}>;

export default function FixedFooter() {
  const currentPath = useLocation().pathname;

  const icons = (Icon: React.ElementType, isActive: boolean): ReactElement => (
    <Icon
      className={`w-5 h-5 mb-2 ${
        isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
      }`}
    />
  );

  const nav: Nav = [
    {
      name: "Home",
      href: "/dashboard",
      current: currentPath === "/dashboard",
      icon: Home,
    },
    {
      name: "Analytics",
      href: "/analytics",
      current: currentPath === "/analytics",
      icon: BarChart,
    },
    {
      name: "Library",
      href: "/library",
      current: currentPath === "/library",
      icon: Library,
    },
  ];

  const links = (navItems: Nav) =>
    navItems.map((navItem) => {
      const isActive = currentPath === navItem.href;
      return (
        <Link
          key={navItem.name}
          to={navItem.href}
          className={`flex-1 flex flex-col items-center justify-center py-2 group relative ${
            isActive ? "border-t-2 border-blue-600" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {icons(navItem.icon, isActive)}
            <span
              className={`text-sm ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 group-hover:text-blue-600"
              }`}
            >
              {navItem.name}
            </span>
          </div>
        </Link>
      );
    });

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200">
      <div className="max-w-3xl mx-auto w-full h-16 flex justify-between font-medium">
        {links(nav)}
      </div>
    </footer>
  );
}
