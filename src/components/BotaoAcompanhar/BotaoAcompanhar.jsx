import { FiCheck, FiPlus } from 'react-icons/fi'
import './BotaoAcompanhar.css'

// RP-09: deixar de acompanhar apaga o progresso, então a ação pede confirmação.
function BotaoAcompanhar({ acompanhando, nome, aoAcompanhar, aoDeixarDeAcompanhar }) {
  function tratarClique() {
    if (!acompanhando) {
      aoAcompanhar()
      return
    }

    const confirmou = window.confirm(
      `Deixar de acompanhar "${nome}"?\n\nIsso apaga o progresso registrado nesta série.`,
    )
    if (confirmou) {
      aoDeixarDeAcompanhar()
    }
  }

  return (
    <button
      type="button"
      className={acompanhando ? 'botao botao-acompanhar--ativo' : 'botao botao--principal'}
      onClick={tratarClique}
    >
      {acompanhando ? <FiCheck size={17} /> : <FiPlus size={17} />}
      {acompanhando ? 'Seguindo' : 'Acompanhar'}
    </button>
  )
}

export default BotaoAcompanhar
