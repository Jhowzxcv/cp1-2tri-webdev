import { Link } from 'react-router-dom'
import { FiCheck, FiStar } from 'react-icons/fi'
import BarraProgresso from '../BarraProgresso/BarraProgresso.jsx'
import { urlImagem } from '../../utils/formato.js'
import './CardSerie.css'

function CardSerie({ id, nome, poster, ano, nota, acompanhando = false, progresso = null }) {
  return (
    <Link to={`/serie/${id}`} className="card-serie">
      <div className="card-serie__moldura">
        <img className="card-serie__poster" src={urlImagem(poster)} alt={`Pôster de ${nome}`} loading="lazy" />
        {acompanhando && (
          <span className="card-serie__selo">
            <FiCheck size={12} />
            Seguindo
          </span>
        )}
      </div>

      <div className="card-serie__texto">
        <span className="card-serie__nome">{nome}</span>
        <span className="card-serie__meta">
          {ano || 'sem data'}
          {typeof nota === 'number' && nota > 0 && (
            <span className="card-serie__nota">
              <FiStar size={12} />
              {nota.toFixed(1)}
            </span>
          )}
        </span>
        {progresso && (
          <BarraProgresso
            assistidos={progresso.assistidos}
            total={progresso.total}
            concluida={progresso.assistidos === progresso.total && progresso.total > 0}
          />
        )}
      </div>
    </Link>
  )
}

export default CardSerie
