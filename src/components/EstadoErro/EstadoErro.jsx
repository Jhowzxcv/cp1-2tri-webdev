import { FiAlertCircle, FiKey, FiRefreshCw } from 'react-icons/fi'
import { SEM_CHAVE } from '../../services/tmdb.js'
import './EstadoErro.css'

// Trata dois casos diferentes com telas diferentes: falha de rede (o usuário
// pode tentar de novo) e chave de API ausente (é erro de configuração, e
// mandar "tentar novamente" não resolveria nada).
function EstadoErro({ mensagem, aoTentarNovamente }) {
  if (mensagem === SEM_CHAVE) {
    return (
      <div className="estado-erro estado-erro--chave">
        <span className="estado-erro__icone estado-erro__icone--chave">
          <FiKey size={30} />
        </span>
        <h2 className="estado-erro__titulo-menor">Chave da API não configurada</h2>
        <p className="estado-erro__descricao">
          Crie um arquivo <code>.env</code> na raiz do projeto com:
        </p>
        <pre className="estado-erro__codigo">
          <code>VITE_TMDB_API_KEY=sua_chave</code>
        </pre>
        <p className="estado-erro__nota">Depois reinicie o servidor de desenvolvimento.</p>
      </div>
    )
  }

  return (
    <div className="estado-erro">
      <span className="estado-erro__icone">
        <FiAlertCircle size={44} />
      </span>
      <h2 className="estado-erro__titulo">Não deu para carregar</h2>
      <p className="estado-erro__descricao">{mensagem}</p>
      {aoTentarNovamente && (
        <button type="button" className="botao" onClick={aoTentarNovamente}>
          <FiRefreshCw size={16} />
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export default EstadoErro
