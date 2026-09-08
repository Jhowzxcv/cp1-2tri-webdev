import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import LayoutPrincipal from './layouts/LayoutPrincipal/LayoutPrincipal.jsx'
import Inicio from './pages/Inicio/Inicio.jsx'
import Busca from './pages/Busca/Busca.jsx'
import DetalhesSerie from './pages/DetalhesSerie/DetalhesSerie.jsx'
import Temporada from './pages/Temporada/Temporada.jsx'
import Estatisticas from './pages/Estatisticas/Estatisticas.jsx'
import NaoEncontrada from './pages/NaoEncontrada/NaoEncontrada.jsx'

import {
  gravarAssistidos,
  gravarResumos,
  gravarSeries,
  lerAssistidos,
  lerResumos,
  lerSeries,
} from './utils/armazenamento.js'
import { DURACAO_PADRAO, chaveEpisodio, foiLancado } from './utils/progresso.js'

function App() {
  // Estado compartilhado por mais de uma página, elevado para cá e distribuído
  // por props. Estado que só interessa a uma página (termo de busca, resultados,
  // carregamento) mora na própria página.
  const [series, setSeries] = useState(lerSeries)
  const [assistidos, setAssistidos] = useState(lerAssistidos)
  const [resumos, setResumos] = useState(lerResumos)

  useEffect(() => {
    gravarSeries(series)
  }, [series])

  useEffect(() => {
    gravarAssistidos(assistidos)
  }, [assistidos])

  useEffect(() => {
    gravarResumos(resumos)
  }, [resumos])

  // US-03
  function acompanharSerie(serie) {
    setSeries((atual) => {
      if (atual.some((item) => item.id === serie.id)) {
        return atual
      }
      return [...atual, serie]
    })
  }

  // US-03 + RP-09: remover a série apaga também o progresso dela.
  function deixarDeAcompanhar(serieId) {
    setSeries((atual) => atual.filter((item) => item.id !== serieId))

    setAssistidos((atual) => {
      const copia = { ...atual }
      delete copia[serieId]
      return copia
    })

    setResumos((atual) => {
      const copia = { ...atual }
      delete copia[serieId]
      return copia
    })
  }

  // US-04 + RP-06: marcar um episódio não marca os anteriores.
  function alternarEpisodio(serieId, temporada, numero, duracao) {
    const chave = chaveEpisodio(temporada, numero)

    setAssistidos((atual) => {
      const registro = atual[serieId] || { episodios: [], duracoes: {} }
      const jaAssistiu = registro.episodios.includes(chave)

      const episodios = jaAssistiu
        ? registro.episodios.filter((item) => item !== chave)
        : [...registro.episodios, chave]

      const duracoes = { ...registro.duracoes }
      if (jaAssistiu) {
        delete duracoes[chave]
      } else {
        duracoes[chave] = duracao || DURACAO_PADRAO
      }

      return { ...atual, [serieId]: { episodios, duracoes } }
    })
  }

  // US-04: ação explícita para marcar a temporada inteira (só os lançados).
  function marcarTemporada(serieId, episodios) {
    setAssistidos((atual) => {
      const registro = atual[serieId] || { episodios: [], duracoes: {} }
      const marcados = [...registro.episodios]
      const duracoes = { ...registro.duracoes }

      episodios
        .filter((episodio) => foiLancado(episodio.air_date))
        .forEach((episodio) => {
          const chave = chaveEpisodio(episodio.season_number, episodio.episode_number)
          if (!marcados.includes(chave)) {
            marcados.push(chave)
          }
          duracoes[chave] = episodio.runtime || DURACAO_PADRAO
        })

      return { ...atual, [serieId]: { episodios: marcados, duracoes } }
    })
  }

  function desmarcarTemporada(serieId, temporada) {
    setAssistidos((atual) => {
      const registro = atual[serieId]
      if (!registro) {
        return atual
      }

      const prefixo = `${temporada}-`
      const episodios = registro.episodios.filter((chave) => !chave.startsWith(prefixo))

      const duracoes = {}
      episodios.forEach((chave) => {
        duracoes[chave] = registro.duracoes[chave]
      })

      return { ...atual, [serieId]: { episodios, duracoes } }
    })
  }

  // Guarda quantos episódios já foram lançados e qual o status da série.
  // Quem já carregou os episódios grava aqui, para a página de estatísticas
  // não precisar refazer requisição nenhuma.
  function salvarResumo(serieId, resumo) {
    setResumos((atual) => {
      const anterior = atual[serieId]
      if (
        anterior &&
        anterior.totalLancados === resumo.totalLancados &&
        anterior.status === resumo.status
      ) {
        return atual
      }
      return { ...atual, [serieId]: resumo }
    })
  }

  function estaAcompanhando(serieId) {
    return series.some((item) => item.id === serieId)
  }

  return (
    <Routes>
      <Route element={<LayoutPrincipal totalSeries={series.length} />}>
        <Route
          index
          element={
            <Inicio
              series={series}
              assistidos={assistidos}
              aoMarcarEpisodio={alternarEpisodio}
              aoSalvarResumo={salvarResumo}
            />
          }
        />
        <Route path="busca" element={<Busca estaAcompanhando={estaAcompanhando} />} />
        <Route
          path="serie/:id"
          element={
            <DetalhesSerie
              assistidos={assistidos}
              estaAcompanhando={estaAcompanhando}
              aoAcompanhar={acompanharSerie}
              aoDeixarDeAcompanhar={deixarDeAcompanhar}
              aoSalvarResumo={salvarResumo}
            />
          }
        />
        <Route
          path="serie/:id/temporada/:numero"
          element={
            <Temporada
              assistidos={assistidos}
              aoAlternarEpisodio={alternarEpisodio}
              aoMarcarTemporada={marcarTemporada}
              aoDesmarcarTemporada={desmarcarTemporada}
            />
          }
        />
        <Route
          path="estatisticas"
          element={<Estatisticas series={series} assistidos={assistidos} resumos={resumos} />}
        />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default App
