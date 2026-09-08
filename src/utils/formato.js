// Formatação de datas, durações e URLs de imagem.

const BASE_IMAGEM = 'https://image.tmdb.org/t/p'

// US-01: caminho ausente cai no fallback, nunca em imagem quebrada.
export function urlImagem(caminho, tamanho = 'w342') {
  if (!caminho) {
    return '/sem-poster.svg'
  }
  return `${BASE_IMAGEM}/${tamanho}${caminho}`
}

export function anoDe(iso) {
  if (!iso) {
    return null
  }
  return Number(iso.slice(0, 4))
}

export function formatarData(iso) {
  if (!iso) {
    return 'sem data'
  }
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

// US-07: tempo legível ("40d 3h"), nunca minutos crus.
export function formatarDuracao(minutos) {
  if (!minutos) {
    return '0h'
  }

  const dias = Math.floor(minutos / 1440)
  const horas = Math.floor((minutos % 1440) / 60)

  if (dias > 0) {
    return `${dias}d ${horas}h`
  }
  if (horas > 0) {
    return `${horas}h ${minutos % 60}min`
  }
  return `${minutos}min`
}

export function formatarNumero(valor) {
  return valor.toLocaleString('pt-BR')
}

export function rotuloEpisodio(temporada, episodio) {
  return `T${temporada}E${episodio}`
}
