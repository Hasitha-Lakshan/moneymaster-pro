import { NavLink } from "react-router-dom";
import {
  Home,
  CreditCard,
  TrendingUp,
  Settings,
  CreditCard as SourcesIcon,
} from "react-feather";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

export const Footer = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const navItems = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/transactions", label: "Transactions", Icon: CreditCard },
    { to: "/dashboard", label: "Dashboard", Icon: TrendingUp },
    { to: "/sources", label: "Sources", Icon: SourcesIcon },
    { to: "/categories", label: "Categories", Icon: Settings },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-around py-2">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 transition-colors ${
                isActive
                  ? darkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Footer;
