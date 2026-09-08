import { FiSearch, FiX } from 'react-icons/fi'
import './CampoBusca.css'

// Componente controlado: quem guarda o texto é a página Busca.
function CampoBusca({ valor, aoMudar, placeholder = 'Buscar séries...' }) {
  return (
    <div className="campo-busca">
      <span className="campo-busca__icone">
        <FiSearch size={19} />
      </span>

      <input
        type="search"
        className="campo-busca__entrada"
        value={valor}
        placeholder={placeholder}
        aria-label="Buscar séries"
        autoComplete="off"
        onChange={(evento) => aoMudar(evento.target.value)}
      />

      {valor.length > 0 && (
        <button
          type="button"
          className="campo-busca__limpar"
          onClick={() => aoMudar('')}
          aria-label="Limpar busca"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  )
}

export default CampoBusca
