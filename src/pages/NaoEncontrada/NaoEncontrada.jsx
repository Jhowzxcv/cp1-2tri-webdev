import { Link } from 'react-router-dom'
import { FiCompass } from 'react-icons/fi'
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio.jsx'

function NaoEncontrada() {
  return (
    <div className="pagina">
      <EstadoVazio
        icone={<FiCompass size={44} />}
        titulo="Essa página não existe"
        descricao="O endereço que você abriu não corresponde a nenhuma tela do Onde Parei."
        acao={
          <Link to="/" className="botao botao--principal">
            Voltar para minhas séries
          </Link>
        }
      />
    </div>
  )
}

export default NaoEncontrada
