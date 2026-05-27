import { NavLink } from "react-router-dom";
import "../header.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export const Nav = () => {
  return (
    <nav className="nav">
      <NavLink to="/" end className={navLinkClass}>
        Dashboards
      </NavLink>
      <NavLink to="/incomes" className={navLinkClass}>
        Revenus
      </NavLink>
      <NavLink to="/investments" className={navLinkClass}>
        Investissements
      </NavLink>
      <NavLink to="/net-worth" className={navLinkClass}>
        Capital
      </NavLink>
    </nav>
  );
};
