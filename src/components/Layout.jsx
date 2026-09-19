import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();

  // Volta ao topo sempre que a página muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Header />
      {/* A key faz a animação de entrada rodar em toda troca de página */}
      <main key={location.pathname} className="page">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
