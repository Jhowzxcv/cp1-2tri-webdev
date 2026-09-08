import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiSearch, FiTv } from 'react-icons/fi'

import CardProximoEpisodio from '../../components/CardProximoEpisodio/CardProximoEpisodio.jsx'
import CardSerie from '../../components/CardSerie/CardSerie.jsx'
import EstadoErro from '../../components/EstadoErro/EstadoErro.jsx'
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio.jsx'
import FiltroSituacao from '../../components/FiltroSituacao/FiltroSituacao.jsx'
import Skeleton from '../../components/Skeleton/Skeleton.jsx'

import { buscarTodosEpisodios } from '../../services/tmdb.js'
import {
  acharProximoEpisodio,
  calcularProgresso,
  marcadosDaSerie,
  situacaoDaSerie,
} from '../../utils/progresso.js'
import './Inicio.css'

function Inicio({ series, assistidos, aoMarcarEpisodio, aoSalvarResumo }) {
  // Um item por série acompanhada: episódios carregados da API + o que
  // derivamos deles (próximo episódio, progresso, situação).
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtro, setFiltro] = useState('andamento')
  const [tentativa, setTentativa] = useState(0)

  // Depende de [series]: entrar ou sair uma série muda o que precisa ser
  // carregado. Marcar episódio não recarrega nada — o recálculo acontece
  // no render, a partir de `assistidos`.
  useEffect(() => {
    let ativo = true

    async function carregar() {
      if (series.length === 0) {
        setDados([])
        setCarregando(false)
        setErro(null)
        return
      }

      setCarregando(true)
      setErro(null)

      try {
        const carregadas = await Promise.all(
          series.map(async (serie) => {
            const episodios = await buscarTodosEpisodios(serie.id, serie.temporadas)
            return { serie, episodios }
          }),
        )

        if (ativo) {
          setDados(carregadas)
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
  }, [series, tentativa])

  // Guarda quantos episódios já foram lançados por série, para a página de
  // estatísticas saber quais estão concluídas sem refazer requisição.
  useEffect(() => {
    dados.forEach((item) => {
      const progresso = calcularProgresso(item.episodios, [])
      aoSalvarResumo(item.serie.id, {
        totalLancados: progresso.total,
        status: item.serie.status,
      })
    })
  }, [dados, aoSalvarResumo])

  // Derivado no render: nunca vira estado, para não haver duas fontes de verdade.
  const listas = { andamento: [], emDia: [], concluidas: [] }

  dados.forEach((item) => {
    const marcados = marcadosDaSerie(assistidos, item.serie.id)
    const progresso = calcularProgresso(item.episodios, marcados)
    const proximo = acharProximoEpisodio(item.episodios, marcados)
    const situacao = situacaoDaSerie(item.serie, progresso)

    const linha = { ...item, marcados, progresso, proximo, situacao }

    if (situacao === 'andamento') {
      listas.andamento.push(linha)
    } else if (situacao === 'emDia') {
      listas.emDia.push(linha)
    } else {
      listas.concluidas.push(linha)
    }
  })

  const contagens = {
    andamento: listas.andamento.length,
    emDia: listas.emDia.length,
    concluidas: listas.concluidas.length,
    todas: dados.length,
  }

  const visiveis =
    filtro === 'todas'
      ? [...listas.andamento, ...listas.emDia, ...listas.concluidas]
      : listas[filtro]

  const emAndamento = visiveis.filter((linha) => linha.proximo)
  const semPendencia = visiveis.filter((linha) => !linha.proximo)

  if (series.length === 0) {
    return (
      <div className="pagina">
        <div className="pagina__cabecalho">
          <h1 className="pagina__titulo">Minhas séries</h1>
        </div>
        <EstadoVazio
          icone={<FiTv size={44} />}
          titulo="Você ainda não acompanha nenhuma série"
          descricao="Busque uma série, adicione à sua lista e marque os episódios que já viu. A partir daí a gente lembra por você."
          acao={
            <Link to="/busca" className="botao botao--principal">
              <FiSearch size={16} />
              Buscar séries
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="pagina">
      <div className="inicio__cabecalho">
        <div>
          <h1 className="pagina__titulo">Continue de onde parou</h1>
          {!carregando && !erro && (
            <p className="pagina__subtitulo">
              {contagens.andamento === 0
                ? 'Você está em dia com tudo.'
                : `${contagens.andamento} ${
                    contagens.andamento === 1 ? 'série com episódio esperando' : 'séries com episódio esperando'
                  } por você.`}
            </p>
          )}
        </div>

        {!carregando && !erro && (
          <FiltroSituacao valor={filtro} aoMudar={setFiltro} contagens={contagens} />
        )}
      </div>

      {carregando && <Skeleton variante="cartao" quantidade={4} />}

      {!carregando && erro && (
        <EstadoErro mensagem={erro} aoTentarNovamente={() => setTentativa(tentativa + 1)} />
      )}

      {!carregando && !erro && visiveis.length === 0 && (
        <EstadoVazio
          icone={<FiCheck size={44} />}
          titulo="Nada nesse filtro"
          descricao="Nenhuma série sua está nessa situação agora."
          acao={
            <button type="button" className="botao" onClick={() => setFiltro('todas')}>
              Ver todas
            </button>
          }
        />
      )}

      {!carregando && !erro && emAndamento.length > 0 && (
        <div className="grade-cartoes">
          {emAndamento.map((linha) => (
            <CardProximoEpisodio
              key={linha.serie.id}
              serie={linha.serie}
              episodio={linha.proximo}
              progresso={linha.progresso}
              aoMarcar={() =>
                aoMarcarEpisodio(
                  linha.serie.id,
                  linha.proximo.season_number,
                  linha.proximo.episode_number,
                  linha.proximo.runtime,
                )
              }
            />
          ))}
        </div>
      )}

      {!carregando && !erro && semPendencia.length > 0 && (
        <>
          <div className="secao">
            <h2 className="secao__titulo">Sem episódio pendente</h2>
            <span className="secao__nota">
              <FiCheck size={15} />
              você está em dia
            </span>
            <div className="secao__linha" />
          </div>

          <div className="grade-posteres">
            {semPendencia.map((linha) => (
              <CardSerie
                key={linha.serie.id}
                id={linha.serie.id}
                nome={linha.serie.nome}
                poster={linha.serie.poster}
                ano={linha.serie.ano}
                progresso={linha.progresso}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Inicio
