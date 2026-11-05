import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "../header.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export const Nav = () => {
  const location = useLocation();
  // Mémorise la route sur laquelle le menu a été ouvert : il se referme
  // automatiquement dès que la route change (liens, retour arrière…).
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const isOpen = openedOnPath === location.pathname;
  const setIsOpen = (open: boolean) =>
    setOpenedOnPath(open ? location.pathname : null);
  const navRef = useRef<HTMLElement>(null);

  // Ferme le menu mobile sur Échap ou clic en dehors.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOnPath(null);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node))
        setOpenedOnPath(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

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
    <nav ref={navRef} className={`nav ${isOpen ? "nav-open" : ""}`}>
      <button
        type="button"
        className="nav-toggle"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
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
