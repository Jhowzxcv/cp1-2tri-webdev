import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

import CampoBusca from '../../components/CampoBusca/CampoBusca.jsx'
import CardSerie from '../../components/CardSerie/CardSerie.jsx'
import EstadoErro from '../../components/EstadoErro/EstadoErro.jsx'
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio.jsx'
import Skeleton from '../../components/Skeleton/Skeleton.jsx'

import { buscarPopulares, buscarSeries } from '../../services/tmdb.js'
import { anoDe } from '../../utils/formato.js'
import './Busca.css'

function Busca({ estaAcompanhando }) {
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState([])
  const [populares, setPopulares] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  // Sugestões para quando o campo está vazio: a página nunca abre em branco.
  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const dados = await buscarPopulares()
        if (ativo) {
          setPopulares(dados)
        }
      } catch {
        // Sugestão é conteúdo secundário: se falhar, a busca continua funcionando.
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  // O debounce evita disparar uma requisição por tecla digitada.
  useEffect(() => {
    const limpo = termo.trim()

    if (limpo.length === 0) {
      setResultados([])
      setCarregando(false)
      setErro(null)
      return undefined
    }

    let ativo = true
    setCarregando(true)
    setErro(null)

    const tempo = setTimeout(async () => {
      try {
        const dados = await buscarSeries(limpo)
        if (ativo) {
          setResultados(dados)
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
    }, 400)

    return () => {
      ativo = false
      clearTimeout(tempo)
    }
  }, [termo, tentativa])

  const buscou = termo.trim().length > 0

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1 className="pagina__titulo">Buscar séries</h1>
      </div>

      <CampoBusca valor={termo} aoMudar={setTermo} />

      {!buscou && (
        <>
          <div className="secao">
            <h2 className="secao__titulo">Populares agora</h2>
            <div className="secao__linha" />
          </div>
          <div className="grade-posteres">
            {populares.map((serie) => (
              <CardSerie
                key={serie.id}
                id={serie.id}
                nome={serie.name}
                poster={serie.poster_path}
                ano={anoDe(serie.first_air_date)}
                nota={serie.vote_average}
                acompanhando={estaAcompanhando(serie.id)}
              />
            ))}
          </div>
        </>
      )}

      {buscou && (
        <div className="busca__resultados">
          {carregando && <Skeleton variante="poster" quantidade={12} />}

          {!carregando && erro && (
            <EstadoErro mensagem={erro} aoTentarNovamente={() => setTentativa(tentativa + 1)} />
          )}

          {!carregando && !erro && resultados.length === 0 && (
            <EstadoVazio
              icone={<FiSearch size={44} />}
              titulo="Nenhuma série encontrada"
              descricao={`Não achamos nada para "${termo.trim()}". Tente outro nome ou o título original.`}
            />
          )}

          {!carregando && !erro && resultados.length > 0 && (
            <>
              <p className="busca__contagem">
                {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'} para{' '}
                <span>&quot;{termo.trim()}&quot;</span>
              </p>
              <div className="grade-posteres">
                {resultados.map((serie) => (
                  <CardSerie
                    key={serie.id}
                    id={serie.id}
                    nome={serie.name}
                    poster={serie.poster_path}
                    ano={anoDe(serie.first_air_date)}
                    nota={serie.vote_average}
                    acompanhando={estaAcompanhando(serie.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Busca
