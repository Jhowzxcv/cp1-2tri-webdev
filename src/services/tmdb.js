// Camada de acesso à API do TMDB.
// Nenhum componente faz fetch direto: tudo passa por aqui, para manter a URL
// base, a chave e o tratamento de erro em um lugar só.

const BASE = 'https://api.themoviedb.org/3'
const CHAVE = import.meta.env.VITE_TMDB_API_KEY
const IDIOMA = 'pt-BR'

export const SEM_CHAVE = 'SEM_CHAVE'

export function temChave() {
  return Boolean(CHAVE)
}

async function pedir(caminho, parametros = '') {
  if (!CHAVE) {
    throw new Error(SEM_CHAVE)
  }

  const url = `${BASE}${caminho}?api_key=${CHAVE}&language=${IDIOMA}${parametros}`
  const resposta = await fetch(url)

  if (!resposta.ok) {
    if (resposta.status === 404) {
      throw new Error('Não encontramos essa série.')
    }
    if (resposta.status === 401) {
      throw new Error('A chave da API não foi aceita. Confira o valor no arquivo .env.')
    }
    throw new Error('Não deu para carregar agora. Verifique sua conexão e tente de novo.')
  }

  return resposta.json()
}

export async function buscarSeries(termo) {
  const dados = await pedir('/search/tv', `&query=${encodeURIComponent(termo)}&include_adult=false`)
  return dados.results
}

export async function buscarSerie(id) {
  return pedir(`/tv/${id}`)
}

export async function buscarTemporada(id, numero) {
  return pedir(`/tv/${id}/season/${numero}`)
}

export async function buscarPopulares() {
  const dados = await pedir('/tv/popular')
  return dados.results
}

// Busca todas as temporadas de uma série e devolve um único array de episódios.
// É o que permite calcular "próximo episódio" e progresso (RP-02 e RP-04) sem
// espalhar essa lógica pelas páginas. A temporada 0 (especiais) fica de fora
// por causa da RP-07.
export async function buscarTodosEpisodios(id, temporadas) {
  const numeros = temporadas
    .filter((temporada) => temporada.season_number > 0)
    .map((temporada) => temporada.season_number)

  const respostas = await Promise.all(numeros.map((numero) => buscarTemporada(id, numero)))

  const episodios = []
  respostas.forEach((temporada) => {
    temporada.episodes.forEach((episodio) => episodios.push(episodio))
  })

  return episodios
}
