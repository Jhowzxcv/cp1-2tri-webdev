import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi'
import { formatarData } from '../../utils/formato.js'
import './ItemEpisodio.css'

// Episódio ainda não lançado aparece na lista, mas inerte: o controle fica
// desabilitado e ele não entra no cálculo de progresso (RP-03 e RP-04).
function ItemEpisodio({ numero, titulo, dataExibicao, duracao, assistido, lancado, proximo, aoAlternar }) {
  let classe = 'item-episodio'
  if (assistido) {
    classe += ' item-episodio--assistido'
  } else if (!lancado) {
    classe += ' item-episodio--futuro'
  } else if (proximo) {
    classe += ' item-episodio--proximo'
  }

  return (
    <li className={classe}>
      <button
        type="button"
        className="item-episodio__marcador"
        onClick={aoAlternar}
        disabled={!lancado}
        aria-pressed={assistido}
        aria-label={
          lancado
            ? `${assistido ? 'Desmarcar' : 'Marcar'} episódio ${numero} como assistido`
            : `Episódio ${numero} ainda não lançado`
        }
      >
        {!lancado && <FiClock size={22} />}
        {lancado && assistido && <FiCheckCircle size={22} />}
        {lancado && !assistido && <FiCircle size={22} />}
      </button>

      <span className="item-episodio__numero">E{numero}</span>

      <div className="item-episodio__texto">
        <span className="item-episodio__titulo">{titulo}</span>
        {proximo && <span className="item-episodio__etiqueta">próximo</span>}
        {!lancado && <span className="item-episodio__etiqueta-futuro">ainda não lançado</span>}
      </div>

      <span className="item-episodio__data">{formatarData(dataExibicao)}</span>
      <span className="item-episodio__duracao">{duracao ? `${duracao} min` : '—'}</span>
    </li>
  )
}

export default ItemEpisodio
