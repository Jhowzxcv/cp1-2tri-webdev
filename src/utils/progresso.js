// Regras de produto do Cliffhanger (RP-01 a RP-08 do docs/requirements.md).
// Funções puras: recebem dados, devolvem dados. Sem React e sem fetch, para
// que possam ser conferidas manualmente contra os critérios de aceitação.

// RP-08: quando a API não informa a duração do episódio.
export const DURACAO_PADRAO = 45

// RP-01: a identidade de um episódio na ordem canônica.
export function chaveEpisodio(temporada, episodio) {
  return `${temporada}-${episodio}`
}

// RP-03: episódio sem data é tratado como não lançado.
export function foiLancado(dataExibicao) {
  if (!dataExibicao) {
    return false
  }
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return new Date(`${dataExibicao}T00:00:00`) <= hoje
}

// RP-01: temporada crescente e, dentro dela, episódio crescente.
export function ordenar(episodios) {
  return [...episodios].sort((a, b) => {
    if (a.season_number !== b.season_number) {
      return a.season_number - b.season_number
    }
    return a.episode_number - b.episode_number
  })
}

export function marcadosDaSerie(assistidos, serieId) {
  const registro = assistidos[serieId]
  return registro ? registro.episodios : []
}

// RP-04: episódios não lançados nunca entram no denominador.
export function calcularProgresso(episodios, marcados) {
  const lancados = episodios.filter((episodio) => foiLancado(episodio.air_date))
  const vistos = lancados.filter((episodio) =>
    marcados.includes(chaveEpisodio(episodio.season_number, episodio.episode_number)),
  )

  return {
    assistidos: vistos.length,
    total: lancados.length,
    percentual: lancados.length === 0 ? 0 : Math.round((vistos.length / lancados.length) * 100),
  }
}

// RP-02: primeiro episódio lançado e não assistido na ordem canônica.
export function acharProximoEpisodio(episodios, marcados) {
  const proximo = ordenar(episodios).find(
    (episodio) =>
      foiLancado(episodio.air_date) &&
      !marcados.includes(chaveEpisodio(episodio.season_number, episodio.episode_number)),
  )
  return proximo || null
}

// RP-05: "concluída" exige que a série tenha terminado; senão é "em dia".
export function situacaoDaSerie(serie, progresso) {
  if (progresso.total === 0 || progresso.assistidos < progresso.total) {
    return 'andamento'
  }
  const encerrada = serie.status === 'Ended' || serie.status === 'Canceled'
  return encerrada ? 'concluida' : 'emDia'
}

export function rotuloDaSituacao(situacao) {
  if (situacao === 'concluida') return 'Concluída'
  if (situacao === 'emDia') return 'Em dia'
  return 'Em andamento'
}

// Decide se uma série já foi terminada, usando o resumo que as páginas de
// Início e Detalhes gravam depois de carregar os episódios (RP-05).
export function serieConcluida(serie, assistidos, resumos) {
  const resumo = resumos[serie.id]
  if (!resumo || resumo.totalLancados === 0) {
    return false
  }
  const marcados = marcadosDaSerie(assistidos, serie.id).length
  const encerrada = resumo.status === 'Ended' || resumo.status === 'Canceled'
  return encerrada && marcados >= resumo.totalLancados
}

// US-07: tudo derivado do que já está no localStorage, sem nenhuma requisição.
export function calcularEstatisticas(series, assistidos, resumos) {
  let episodios = 0
  let minutos = 0
  let estimado = false

  const porSerie = []
  const generos = {}

  series.forEach((serie) => {
    const registro = assistidos[serie.id]
    const marcados = registro ? registro.episodios : []
    const duracoes = registro ? registro.duracoes : {}

    let minutosDaSerie = 0
    marcados.forEach((chave) => {
      const duracao = duracoes[chave]
      if (!duracao) {
        estimado = true
      }
      minutosDaSerie += duracao || DURACAO_PADRAO
    })

    episodios += marcados.length
    minutos += minutosDaSerie
    porSerie.push({ serie, episodios: marcados.length })

    if (marcados.length > 0) {
      serie.generos.forEach((genero) => {
        generos[genero] = (generos[genero] || 0) + marcados.length
      })
    }
  })

  const ranking = Object.keys(generos)
    .map((nome) => ({ nome, episodios: generos[nome] }))
    .sort((a, b) => b.episodios - a.episodios)

  const maisAssistida = porSerie
    .filter((item) => item.episodios > 0)
    .sort((a, b) => b.episodios - a.episodios)[0]

  return {
    episodios,
    minutos,
    estimado,
    acompanhadas: series.length,
    concluidas: series.filter((serie) => serieConcluida(serie, assistidos, resumos)).length,
    generos: ranking,
    maisAssistida: maisAssistida || null,
  }
}
