import { NavLink } from "react-router-dom";
import {
  Home,
  CreditCard,
  TrendingUp,
  Settings,
  CreditCard as SourcesIcon,
} from "react-feather";

export const Footer = () => {
  const navItems = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/transactions", label: "Transactions", Icon: CreditCard },
    { to: "/dashboard", label: "Dashboard", Icon: TrendingUp },
    { to: "/sources", label: "Sources", Icon: SourcesIcon },
    { to: "/categories", label: "Categories", Icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t-2 border-border/50 bg-background/95 backdrop-blur-sm z-40">
      <div className="flex justify-around py-3">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 transition-all duration-200 rounded-xl group relative overflow-hidden ${
                isActive
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              }`
            }
          >
            {/* Active state indicator */}
            {({ isActive }) => (
              <>
                <div
                  className={`absolute inset-0 transition-opacity duration-200 ${
                    isActive
                      ? "bg-primary/10 opacity-100"
                      : "opacity-0 group-hover:opacity-100 group-hover:bg-accent/5"
                  }`}
                />
                
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive
                      ? "text-primary scale-110"
                      : "group-hover:scale-110 group-hover:text-accent"
                  }`}
                />
                
                <span
                  className={`text-xs mt-1 font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "group-hover:font-semibold"
                  }`}
                >
                  {label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Footer;