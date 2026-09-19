import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiPlayCircle, FiCompass, FiList } from "react-icons/fi";
import SearchBar from "./SearchBar";

function Header() {
  const [rolou, setRolou] = useState(false);

  // Header fica sólido depois que a página rola um pouco
  useEffect(() => {
    function handleScroll() {
      setRolou(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={rolou ? "header header--solid" : "header"}>
      <div className="header__inner">
        <Link to="/" className="logo">
          <FiPlayCircle />
          <span>Maratona</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end className="nav__link">
            <FiCompass />
            <span>Descobrir</span>
          </NavLink>
          <NavLink to="/minhas-series" className="nav__link">
            <FiList />
            <span>Minhas séries</span>
          </NavLink>
        </nav>

        <SearchBar />
      </div>
    </header>
  );
}

export default Header;
