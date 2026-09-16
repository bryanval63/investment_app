import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import "../header.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export const Nav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const investmentsLinkClass = () => {
    const isActive =
      location.pathname === "/" || location.pathname.startsWith("/investments");

    return `nav-link ${isActive ? "nav-link-active" : ""}`;
  };

  const accountsLinkClass = () => {
    const isActive = location.pathname.startsWith("/accounts");

    return `nav-link ${isActive ? "nav-link-active" : ""}`;
  };

  const settingsLinkClass = () => {
    const isActive = location.pathname.startsWith("/settings");

    return `nav-link ${isActive ? "nav-link-active" : ""}`;
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`nav ${isOpen ? "nav-open" : ""}`}>
      <button
        type="button"
        className="nav-toggle"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className="nav-links">
        <NavLink to="/incomes" className={navLinkClass} onClick={closeMenu}>
          Revenus
        </NavLink>
        <NavLink
          to="/investments"
          className={investmentsLinkClass}
          onClick={closeMenu}
        >
          Investissements
        </NavLink>
        <NavLink to="/net-worth" className={navLinkClass} onClick={closeMenu}>
          Capital
        </NavLink>
        <NavLink
          to="/accounts"
          className={accountsLinkClass}
          onClick={closeMenu}
        >
          Comptes
        </NavLink>
        <NavLink
          to="/settings"
          className={settingsLinkClass}
          onClick={closeMenu}
        >
          Paramètres
        </NavLink>
      </div>
    </nav>
  );
};
