import "./header.css";
import { Nav } from "./Nav/Nav";

export const Header = () => {
  return (
    <header className="header min-h-12">
      <div className="logo flex-1 hidden md:block">InvestTrack</div>

      <Nav />

      <div className="flex-1"></div>
    </header>
  );
};
