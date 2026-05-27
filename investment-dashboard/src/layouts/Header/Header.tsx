import "./header.css";
import { Nav } from "./Nav/Nav";

export const Header = () => {
  return (
    <header className="header">
      <div className="logo flex-1">InvestTrack</div>

      <Nav />

      <div className="flex-1"></div>
    </header>
  );
};
