import { Link } from 'react-router-dom'
import { FiAward, FiBarChart2, FiCheckCircle, FiClock, FiInfo, FiTv } from 'react-icons/fi'

import CardEstatistica from '../../components/CardEstatistica/CardEstatistica.jsx'
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio.jsx'

import { formatarDuracao, formatarNumero, urlImagem } from '../../utils/formato.js'
import { calcularEstatisticas } from '../../utils/progresso.js'
import './Estatisticas.css'

function Estatisticas({ series, assistidos, resumos }) {
  // Sem estado próprio e sem requisição: número derivado de outro estado não
  // deve virar estado, senão passa a existir uma segunda fonte de verdade.
  const dados = calcularEstatisticas(series, assistidos, resumos)

  if (dados.episodios === 0) {
    return (
      <div className="pagina">
        <div className="pagina__cabecalho">
          <h1 className="pagina__titulo">Suas estatísticas</h1>
        </div>
        <EstadoVazio
          icone={<FiBarChart2 size={44} />}
          titulo="Ainda não há o que somar"
          descricao="Marque episódios como assistidos e este painel começa a se preencher sozinho."
          acao={
            <Link to="/" className="botao botao--principal">
              Ir para minhas séries
            </Link>
          }
        />
      </div>
    )
  }

  const maiorGenero = dados.generos.length > 0 ? dados.generos[0].episodios : 1

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1 className="pagina__titulo">Suas estatísticas</h1>
        <p className="pagina__subtitulo">
          Tudo que você marcou desde que começou a usar o Cliffhanger.
        </p>
      </div>

      <div className="estatisticas__blocos">
        <CardEstatistica
          icone={<FiCheckCircle size={19} />}
          valor={formatarNumero(dados.episodios)}
          rotulo="episódios assistidos"
        />
        <CardEstatistica
          icone={<FiClock size={19} />}
          valor={formatarDuracao(dados.minutos)}
          rotulo="de tela"
          detalhe={dados.estimado ? 'estimado' : null}
        />
        <CardEstatistica
          icone={<FiTv size={19} />}
          valor={dados.acompanhadas}
          rotulo={dados.acompanhadas === 1 ? 'série acompanhada' : 'séries acompanhadas'}
        />
        <CardEstatistica
          icone={<FiAward size={19} />}
          valor={dados.concluidas}
          rotulo={dados.concluidas === 1 ? 'série concluída' : 'séries concluídas'}
          destaque
        />
      </div>

      <div className="estatisticas__colunas">
        <section className="estatisticas__painel">
          <div className="estatisticas__painel-cabecalho">
            <h2 className="estatisticas__painel-titulo">Episódios por gênero</h2>
            <span className="estatisticas__painel-nota">
              Uma série pode contar em mais de um gênero.
            </span>
          </div>

          <div className="estatisticas__barras">
            {dados.generos.map((genero) => (
              <div key={genero.nome} className="estatisticas__barra">
                <span className="estatisticas__barra-rotulo">{genero.nome}</span>
                <div className="estatisticas__barra-trilho">
                  <div
                    className="estatisticas__barra-preenchimento"
                    style={{ width: `${Math.round((genero.episodios / maiorGenero) * 100)}%` }}
                  />
                </div>
                <span className="estatisticas__barra-valor">{genero.episodios}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="estatisticas__lateral">
          {dados.maisAssistida && (
            <section className="estatisticas__painel">
              <h2 className="estatisticas__painel-titulo">Mais assistida</h2>
              <Link to={`/serie/${dados.maisAssistida.serie.id}`} className="estatisticas__destaque">
                <img
                  className="estatisticas__destaque-poster"
                  src={urlImagem(dados.maisAssistida.serie.poster, 'w185')}
                  alt={`Pôster de ${dados.maisAssistida.serie.nome}`}
                />
                <div className="estatisticas__destaque-texto">
                  <span className="estatisticas__destaque-nome">
                    {dados.maisAssistida.serie.nome}
                  </span>
                  <strong className="estatisticas__destaque-numero">
                    {dados.maisAssistida.episodios}
                  </strong>
                  <span className="estatisticas__destaque-rotulo">episódios assistidos</span>
                </div>
              </Link>
            </section>
          )}

          <section className="estatisticas__aviso">
            <span className="estatisticas__aviso-icone">
              <FiInfo size={17} />
            </span>
            <p>
              Seus dados ficam salvos <strong>neste navegador</strong>. Não há conta nem
              sincronização entre dispositivos — limpar os dados do site apaga o progresso.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Estatisticas
