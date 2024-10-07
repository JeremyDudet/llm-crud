import { useLogout } from "@/hooks/useLogout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const logout = useLogout();
  const { currentUserEmail, currentUserName } = useSelector(
    (state: RootState) => state.user
  );

  const navigation = currentUserEmail
    ? [
        {
          name: "Dashboard",
          href: "/dashboard",
          current: currentPath === "/dashboard",
        },
        {
          name: "Profile",
          href: "/profile",
          current: currentPath === "/profile",
        },
      ]
    : [
        { name: "Login", href: "/login", current: currentPath === "/login" },
        {
          name: "Register",
          href: "/create-account",
          current: currentPath === "/create-account",
        },
      ];

  const userNavigation = [
    { name: "Your Profile", href: "/profile" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#", onClick: logout },
  ];

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b border-gray-200 bg-white"
    >
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 justify-between">
          <div className="flex">
            <Link to="/dashboard" className="flex flex-shrink-0 items-center">
              <h1 className="font-bold">LLM CHAT</h1>
            </Link>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={`${item.href}`}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          {currentUserEmail ? (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://via.placeholder.com/40"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        to={`${item.href}`}
                        onClick={item.onClick}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          ) : (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            </div>
          )}
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            {currentUserEmail ? (
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            ) : (
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        {currentUserEmail ? (
          <>
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    alt=""
                    src="https://via.placeholder.com/40"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUserName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUserEmail}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    to={item.href}
                    onClick={item.onClick}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </DisclosurePanel>
    </Disclosure>
  );
}
