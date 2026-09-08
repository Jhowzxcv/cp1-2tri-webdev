import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import BarraProgresso from '../BarraProgresso/BarraProgresso.jsx'
import { rotuloEpisodio, urlImagem } from '../../utils/formato.js'
import './CardProximoEpisodio.css'

// O cartão central do produto: responde "o que eu assisto agora?" e permite
// marcar o episódio sem sair da página inicial.
function CardProximoEpisodio({ serie, episodio, progresso, aoMarcar }) {
  return (
    <article className="card-proximo">
      <Link to={`/serie/${serie.id}`} className="card-proximo__poster">
        <img src={urlImagem(serie.poster, 'w185')} alt={`Pôster de ${serie.nome}`} loading="lazy" />
      </Link>

      <div className="card-proximo__corpo">
        <div className="card-proximo__topo">
          <Link to={`/serie/${serie.id}`} className="card-proximo__nome">
            {serie.nome}
          </Link>
          {serie.ano && <span className="card-proximo__ano">{serie.ano}</span>}
        </div>

        <Link
          to={`/serie/${serie.id}/temporada/${episodio.season_number}`}
          className="card-proximo__episodio"
        >
          <span className="card-proximo__etiqueta">
            {rotuloEpisodio(episodio.season_number, episodio.episode_number)}
          </span>
          <span className="card-proximo__titulo">{episodio.name}</span>
        </Link>

        <BarraProgresso assistidos={progresso.assistidos} total={progresso.total} />

        <button type="button" className="botao card-proximo__botao" onClick={aoMarcar}>
          <FiCheckCircle size={16} />
          Marcar como visto
        </button>
      </div>
    </article>
  )
}

export default CardProximoEpisodio
