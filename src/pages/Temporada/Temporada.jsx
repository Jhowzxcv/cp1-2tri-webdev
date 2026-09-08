import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiCheck, FiChevronRight, FiFilm } from 'react-icons/fi'

import BarraProgresso from '../../components/BarraProgresso/BarraProgresso.jsx'
import EstadoErro from '../../components/EstadoErro/EstadoErro.jsx'
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio.jsx'
import ItemEpisodio from '../../components/ItemEpisodio/ItemEpisodio.jsx'
import Skeleton from '../../components/Skeleton/Skeleton.jsx'

import { buscarTemporada } from '../../services/tmdb.js'
import {
  acharProximoEpisodio,
  calcularProgresso,
  chaveEpisodio,
  foiLancado,
  marcadosDaSerie,
} from '../../utils/progresso.js'
import './Temporada.css'

function Temporada({ assistidos, aoAlternarEpisodio, aoMarcarTemporada, aoDesmarcarTemporada }) {
  const { id, numero } = useParams()

  const [temporada, setTemporada] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro(null)

      try {
        const dados = await buscarTemporada(id, numero)
        if (ativo) {
          setTemporada(dados)
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
  }, [id, numero, tentativa])

  if (carregando) {
    return (
      <div className="pagina">
        <Skeleton variante="lista" quantidade={8} />
      </div>
    )
  }

  if (erro || !temporada) {
    return (
      <div className="pagina">
        <EstadoErro
          mensagem={erro || 'Não encontramos essa temporada.'}
          aoTentarNovamente={() => setTentativa(tentativa + 1)}
        />
      </div>
    )
  }

  const episodios = temporada.episodes || []
  const marcados = marcadosDaSerie(assistidos, Number(id))
  const progresso = calcularProgresso(episodios, marcados)
  const proximo = acharProximoEpisodio(episodios, marcados)

  return (
    <div className="pagina">
      <nav className="trilha">
        <Link to="/">Minhas séries</Link>
        <FiChevronRight size={13} />
        <Link to={`/serie/${id}`}>Voltar para a série</Link>
        <FiChevronRight size={13} />
        <span>Temporada {numero}</span>
      </nav>

      <div className="temporada__cabecalho">
        <div>
          <h1 className="pagina__titulo">Temporada {numero}</h1>
          <p className="pagina__subtitulo">
            {episodios.length} {episodios.length === 1 ? 'episódio' : 'episódios'}
            {temporada.air_date ? ` · ${temporada.air_date.slice(0, 4)}` : ''}
          </p>
        </div>

        <div className="temporada__acoes">
          <button
            type="button"
            className="botao"
            onClick={() => aoMarcarTemporada(Number(id), episodios)}
          >
            <FiCheck size={16} />
            Marcar temporada inteira
          </button>
          <button
            type="button"
            className="botao botao--discreto"
            onClick={() => aoDesmarcarTemporada(Number(id), Number(numero))}
          >
            Desmarcar
          </button>
        </div>
      </div>

      {episodios.length === 0 ? (
        <EstadoVazio
          icone={<FiFilm size={44} />}
          titulo="Temporada sem episódios cadastrados"
          descricao="O catálogo ainda não tem os episódios desta temporada."
        />
      ) : (
        <>
          <div className="temporada__progresso">
            <BarraProgresso assistidos={progresso.assistidos} total={progresso.total} compacta />
            <span className="temporada__progresso-texto">
              {progresso.assistidos} de {progresso.total} lançados
            </span>
          </div>

          <ul className="temporada__lista">
            {episodios.map((episodio) => {
              const chave = chaveEpisodio(episodio.season_number, episodio.episode_number)
              return (
                <ItemEpisodio
                  key={episodio.id}
                  numero={episodio.episode_number}
                  titulo={episodio.name}
                  dataExibicao={episodio.air_date}
                  duracao={episodio.runtime}
                  assistido={marcados.includes(chave)}
                  lancado={foiLancado(episodio.air_date)}
                  proximo={Boolean(proximo && proximo.id === episodio.id)}
                  aoAlternar={() =>
                    aoAlternarEpisodio(
                      Number(id),
                      episodio.season_number,
                      episodio.episode_number,
                      episodio.runtime,
                    )
                  }
                />
              )
            })}
          </ul>

          <p className="temporada__nota">
            Episódios ainda não lançados não podem ser marcados e ficam fora do cálculo de progresso.
          </p>
        </>
      )}
    </div>
  )
}

export default Temporada
