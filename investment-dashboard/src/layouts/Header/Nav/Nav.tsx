import { NavLink, useLocation } from "react-router-dom";
import "../header.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export const Nav = () => {
  const location = useLocation();

  const investmentsLinkClass = () => {
    const isActive =
      location.pathname === "/" || location.pathname.startsWith("/investments");

    return `nav-link ${isActive ? "nav-link-active" : ""}`;
  };

  const accountsLinkClass = () => {
    const isActive = location.pathname.startsWith("/accounts");

    return `nav-link ${isActive ? "nav-link-active" : ""}`;
  };

  return (
    <nav className="nav">
      <NavLink to="/incomes" className={navLinkClass}>
        Revenus
      </NavLink>
      <NavLink to="/investments" className={investmentsLinkClass}>
        Investissements
      </NavLink>
      <NavLink to="/net-worth" className={navLinkClass}>
        Capital
      </NavLink>
      <NavLink to="/accounts" className={accountsLinkClass}>
        Comptes
      </NavLink>
    </nav>
  );
};
