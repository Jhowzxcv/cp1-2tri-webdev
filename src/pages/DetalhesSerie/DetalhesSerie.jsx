import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiCheck, FiChevronRight, FiClock, FiStar } from 'react-icons/fi'

import BarraProgresso from '../../components/BarraProgresso/BarraProgresso.jsx'
import BotaoAcompanhar from '../../components/BotaoAcompanhar/BotaoAcompanhar.jsx'
import EstadoErro from '../../components/EstadoErro/EstadoErro.jsx'
import Skeleton from '../../components/Skeleton/Skeleton.jsx'

import { buscarSerie, buscarTodosEpisodios } from '../../services/tmdb.js'
import { anoDe, rotuloEpisodio, urlImagem } from '../../utils/formato.js'
import { acharProximoEpisodio, calcularProgresso, marcadosDaSerie } from '../../utils/progresso.js'
import './DetalhesSerie.css'

function DetalhesSerie({
  assistidos,
  estaAcompanhando,
  aoAcompanhar,
  aoDeixarDeAcompanhar,
  aoSalvarResumo,
}) {
  const { id } = useParams()

  const [serie, setSerie] = useState(null)
  const [episodios, setEpisodios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  // A dependência é [id]: ao navegar de /serie/1399 para /serie/1396 o React
  // Router reaproveita este componente, e sem o id na lista a tela continuaria
  // mostrando a série anterior.
  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro(null)

      try {
        const dados = await buscarSerie(id)
        if (!ativo) {
          return
        }
        setSerie(dados)

        const todos = await buscarTodosEpisodios(dados.id, dados.seasons)
        if (ativo) {
          setEpisodios(todos)
        }
      } catch (excecao) {
        if (ativo) {
          setErro(excecao.message)
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [id, tentativa])

  useEffect(() => {
    if (!serie || episodios.length === 0) {
      return
    }
    const totais = calcularProgresso(episodios, [])
    aoSalvarResumo(serie.id, { totalLancados: totais.total, status: serie.status })
  }, [serie, episodios, aoSalvarResumo])

  if (carregando) {
    return (
      <div className="pagina">
        <Skeleton variante="cabecalho" />
      </div>
    )
  }

  if (erro || !serie) {
    return (
      <div className="pagina">
        <EstadoErro
          mensagem={erro || 'Não encontramos essa série.'}
          aoTentarNovamente={() => setTentativa(tentativa + 1)}
        />
      </div>
    )
  }

  const acompanhando = estaAcompanhando(serie.id)
  const marcados = marcadosDaSerie(assistidos, serie.id)
  const progresso = calcularProgresso(episodios, marcados)
  const proximo = acharProximoEpisodio(episodios, marcados)

  // RP-07: a temporada 0 (especiais) fica fora.
  const temporadas = serie.seasons.filter((temporada) => temporada.season_number > 0)

  // Formato reduzido guardado no localStorage: é tudo o que a página inicial
  // precisa para montar os cartões sem refazer a requisição de detalhes.
  const registro = {
    id: serie.id,
    nome: serie.name,
    poster: serie.poster_path,
    ano: anoDe(serie.first_air_date),
    status: serie.status,
    generos: serie.genres.map((genero) => genero.name),
    temporadas: temporadas.map((temporada) => ({
      season_number: temporada.season_number,
      episode_count: temporada.episode_count,
      name: temporada.name,
      air_date: temporada.air_date,
    })),
    adicionadaEm: new Date().toISOString(),
  }

  function progressoDaTemporada(numero) {
    const daTemporada = episodios.filter((episodio) => episodio.season_number === numero)
    return calcularProgresso(daTemporada, marcados)
  }

  return (
    <div className="pagina">
      <nav className="trilha">
        <Link to="/">Minhas séries</Link>
        <FiChevronRight size={13} />
        <span>{serie.name}</span>
      </nav>

      <div className="detalhes">
        <aside className="detalhes__lateral">
          <img
            className="detalhes__poster"
            src={urlImagem(serie.poster_path, 'w500')}
            alt={`Pôster de ${serie.name}`}
          />

          <BotaoAcompanhar
            acompanhando={acompanhando}
            nome={serie.name}
            aoAcompanhar={() => aoAcompanhar(registro)}
            aoDeixarDeAcompanhar={() => aoDeixarDeAcompanhar(serie.id)}
          />

          {acompanhando && (
            <div className="detalhes__progresso">
              <span className="detalhes__progresso-rotulo">Seu progresso</span>
              <div className="detalhes__progresso-numero">
                <strong>{progresso.percentual}%</strong>
                <span>
                  {progresso.assistidos} de {progresso.total} episódios
                </span>
              </div>
              <BarraProgresso
                assistidos={progresso.assistidos}
                total={progresso.total}
                compacta
                concluida={!proximo}
              />
              {proximo ? (
                <Link
                  to={`/serie/${serie.id}/temporada/${proximo.season_number}`}
                  className="detalhes__proximo"
                >
                  <span className="detalhes__etiqueta">
                    {rotuloEpisodio(proximo.season_number, proximo.episode_number)}
                  </span>
                  <span className="detalhes__proximo-titulo">{proximo.name}</span>
                </Link>
              ) : (
                <span className="detalhes__em-dia">
                  <FiCheck size={14} />
                  você está em dia
                </span>
              )}
            </div>
          )}
        </aside>

        <div className="detalhes__conteudo">
          <h1 className="detalhes__titulo">{serie.name}</h1>

          <div className="detalhes__meta">
            <span>{anoDe(serie.first_air_date) || 'sem data'}</span>
            {serie.vote_average > 0 && (
              <span className="detalhes__nota">
                <FiStar size={14} />
                {serie.vote_average.toFixed(1)}
              </span>
            )}
            <span>
              {temporadas.length} {temporadas.length === 1 ? 'temporada' : 'temporadas'} ·{' '}
              {serie.number_of_episodes} episódios
            </span>
            <span className="detalhes__status">
              {serie.status === 'Ended' || serie.status === 'Canceled' ? 'Encerrada' : 'Em exibição'}
            </span>
          </div>

          {serie.genres.length > 0 && (
            <div className="detalhes__generos">
              {serie.genres.map((genero) => (
                <span key={genero.id} className="detalhes__genero">
                  {genero.name}
                </span>
              ))}
            </div>
          )}

          <p className="detalhes__sinopse">
            {serie.overview || 'Esta série ainda não tem sinopse em português no catálogo.'}
          </p>

          <div className="secao">
            <h2 className="secao__titulo">Temporadas</h2>
            <div className="secao__linha" />
          </div>

          <ul className="detalhes__temporadas">
            {temporadas.map((temporada) => {
              const daTemporada = progressoDaTemporada(temporada.season_number)
              const naTemporadaAtual =
                proximo && proximo.season_number === temporada.season_number
              const semLancados = daTemporada.total === 0
              const completa = !semLancados && daTemporada.assistidos === daTemporada.total

              let classe = 'temporada-item'
              if (naTemporadaAtual) {
                classe += ' temporada-item--atual'
              } else if (semLancados) {
                classe += ' temporada-item--futura'
              }

              return (
                <li key={temporada.season_number}>
                  <Link
                    to={`/serie/${serie.id}/temporada/${temporada.season_number}`}
                    className={classe}
                  >
                    <span className="temporada-item__numero">{temporada.season_number}</span>

                    <div className="temporada-item__corpo">
                      <div className="temporada-item__topo">
                        <span className="temporada-item__nome">
                          Temporada {temporada.season_number}
                        </span>
                        <span className="temporada-item__meta">
                          {temporada.episode_count} episódios
                          {temporada.air_date ? ` · ${anoDe(temporada.air_date)}` : ''}
                        </span>
                        {naTemporadaAtual && (
                          <span className="detalhes__etiqueta">você está aqui</span>
                        )}
                      </div>

                      {semLancados ? (
                        <span className="temporada-item__aviso">
                          <FiClock size={13} />
                          sem episódios lançados — fora do cálculo de progresso
                        </span>
                      ) : (
                        <div className="temporada-item__barra">
                          <BarraProgresso
                            assistidos={daTemporada.assistidos}
                            total={daTemporada.total}
                            concluida={completa}
                          />
                        </div>
                      )}
                    </div>

                    <FiChevronRight size={18} className="temporada-item__seta" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DetalhesSerie
