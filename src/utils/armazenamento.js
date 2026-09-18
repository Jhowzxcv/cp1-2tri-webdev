// Persistência no localStorage (RP-10).
// Toda leitura e escrita fica em try/catch: navegador anônimo ou com dados de
// site bloqueados lança exceção, e nesse caso a aplicação deve abrir vazia em
// vez de quebrar.

const CHAVE_SERIES = 'cliffhanger:series'
const CHAVE_ASSISTIDOS = 'cliffhanger:assistidos'
const CHAVE_RESUMOS = 'cliffhanger:resumos'

function ler(chave, padrao) {
  try {
    const bruto = window.localStorage.getItem(chave)
    if (!bruto) {
      return padrao
    }
    return JSON.parse(bruto)
  } catch {
    return padrao
  }
}

function gravar(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Sem espaço ou sem permissão: a aplicação continua funcionando na sessão.
  }
}

export function lerSeries() {
  return ler(CHAVE_SERIES, [])
}

export function gravarSeries(series) {
  gravar(CHAVE_SERIES, series)
}

export function lerAssistidos() {
  return ler(CHAVE_ASSISTIDOS, {})
}

export function gravarAssistidos(assistidos) {
  gravar(CHAVE_ASSISTIDOS, assistidos)
}

// Resumo por série (total de episódios lançados e status), gravado pelas
// páginas que já carregaram os episódios. É o que permite à página de
// estatísticas saber quantas séries estão concluídas sem refazer requisições.
export function lerResumos() {
  return ler(CHAVE_RESUMOS, {})
}

export function gravarResumos(resumos) {
  gravar(CHAVE_RESUMOS, resumos)
}
