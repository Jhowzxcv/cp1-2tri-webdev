import { Link, NavLink } from 'react-router-dom'
import { FiBarChart2, FiHome, FiSearch } from 'react-icons/fi'
import './Cabecalho.css'

function Cabecalho({ totalSeries }) {
  function classeDoLink({ isActive }) {
    return isActive ? 'cabecalho__link cabecalho__link--ativo' : 'cabecalho__link'
  }

  return (
    <header className="cabecalho">
      <div className="cabecalho__interno">
        <Link to="/" className="cabecalho__marca">
          <span className="cabecalho__marca-1">Cliff</span>
          <span className="cabecalho__marca-2">hanger</span>
        </Link>

        <nav className="cabecalho__nav">
          <NavLink to="/" end className={classeDoLink}>
            <FiHome size={16} />
            <span>Minhas séries</span>
          </NavLink>
          <NavLink to="/busca" className={classeDoLink}>
            <FiSearch size={16} />
            <span>Buscar</span>
          </NavLink>
          <NavLink to="/estatisticas" className={classeDoLink}>
            <FiBarChart2 size={16} />
            <span>Estatísticas</span>
          </NavLink>
        </nav>

        {totalSeries > 0 && (
          <span className="cabecalho__contador">
            {totalSeries} {totalSeries === 1 ? 'série acompanhada' : 'séries acompanhadas'}
          </span>
        )}
      </div>
    </header>
  )
}

export default Cabecalho
