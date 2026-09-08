// Confere as regras de produto (RP-01 a RP-08) contra os critérios de aceitação.
import {
  acharProximoEpisodio,
  calcularEstatisticas,
  calcularProgresso,
  chaveEpisodio,
  foiLancado,
  ordenar,
  serieConcluida,
  situacaoDaSerie,
} from '../src/utils/progresso.js'

let falhas = 0
function conferir(nome, real, esperado) {
  const ok = JSON.stringify(real) === JSON.stringify(esperado)
  if (!ok) {
    falhas += 1
    console.log(`FALHOU  ${nome}\n  esperado: ${JSON.stringify(esperado)}\n  obtido:   ${JSON.stringify(real)}`)
  } else {
    console.log(`ok      ${nome}`)
  }
}

const ontem = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
const amanha = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

function ep(temporada, numero, data, runtime = 45) {
  return {
    id: Number(`${temporada}${String(numero).padStart(2, '0')}`),
    season_number: temporada,
    episode_number: numero,
    air_date: data,
    runtime,
    name: `T${temporada}E${numero}`,
  }
}

// --- RP-03: episódio lançado ---
conferir('RP-03 data passada é lançado', foiLancado(ontem), true)
conferir('RP-03 data futura não é lançado', foiLancado(amanha), false)
conferir('RP-03 sem data não é lançado', foiLancado(null), false)

// --- RP-01: ordem canônica ---
const bagunca = [ep(2, 1, ontem), ep(1, 10, ontem), ep(1, 2, ontem)]
conferir(
  'RP-01 ordena por temporada e depois episódio',
  ordenar(bagunca).map((e) => e.name),
  ['T1E2', 'T1E10', 'T2E1'],
)

// --- RP-04: progresso ignora não lançados ---
const serieEmExibicao = [
  ep(1, 1, ontem),
  ep(1, 2, ontem),
  ep(1, 3, ontem),
  ep(1, 4, amanha),
  ep(1, 5, null),
]
conferir(
  'RP-04 denominador só conta lançados',
  calcularProgresso(serieEmExibicao, ['1-1', '1-2', '1-3']),
  { assistidos: 3, total: 3, percentual: 100 },
)
conferir(
  'RP-04 progresso parcial',
  calcularProgresso(serieEmExibicao, ['1-1']),
  { assistidos: 1, total: 3, percentual: 33 },
)

// --- RP-02: próximo episódio ---
conferir(
  'RP-02 próximo é o primeiro lançado e não assistido',
  acharProximoEpisodio(serieEmExibicao, ['1-1']).name,
  'T1E2',
)
conferir(
  'RP-02 pula buraco quando marcou fora de ordem (RP-06)',
  acharProximoEpisodio(serieEmExibicao, ['1-1', '1-3']).name,
  'T1E2',
)
conferir(
  'RP-02 sem pendência devolve null',
  acharProximoEpisodio(serieEmExibicao, ['1-1', '1-2', '1-3']),
  null,
)
conferir(
  'RP-02 nunca devolve episódio não lançado',
  acharProximoEpisodio([ep(1, 1, ontem), ep(1, 2, amanha)], ['1-1']),
  null,
)

// --- RP-05: em dia x concluída ---
const progressoCheio = calcularProgresso(serieEmExibicao, ['1-1', '1-2', '1-3'])
conferir(
  'RP-05 série em exibição totalmente vista fica "em dia"',
  situacaoDaSerie({ status: 'Returning Series' }, progressoCheio),
  'emDia',
)
conferir(
  'RP-05 série encerrada totalmente vista fica "concluída"',
  situacaoDaSerie({ status: 'Ended' }, progressoCheio),
  'concluida',
)
conferir(
  'RP-05 com pendência fica "em andamento"',
  situacaoDaSerie({ status: 'Ended' }, calcularProgresso(serieEmExibicao, ['1-1'])),
  'andamento',
)

// --- chave de episódio ---
conferir('RP-01 chave do episódio', chaveEpisodio(2, 5), '2-5')

// --- serieConcluida + estatísticas ---
const series = [
  { id: 1, nome: 'Encerrada', generos: ['Drama'] },
  { id: 2, nome: 'Em exibição', generos: ['Drama', 'Comédia'] },
]
const assistidos = {
  1: { episodios: ['1-1', '1-2'], duracoes: { '1-1': 60, '1-2': 60 } },
  2: { episodios: ['1-1'], duracoes: {} },
}
const resumos = {
  1: { totalLancados: 2, status: 'Ended' },
  2: { totalLancados: 5, status: 'Returning Series' },
}

conferir('RP-05 serieConcluida verdadeira', serieConcluida(series[0], assistidos, resumos), true)
conferir('RP-05 serieConcluida falsa', serieConcluida(series[1], assistidos, resumos), false)

const stats = calcularEstatisticas(series, assistidos, resumos)
conferir('US-07 total de episódios', stats.episodios, 3)
conferir('RP-08 duração ausente usa 45 min', stats.minutos, 60 + 60 + 45)
conferir('RP-08 marca o total como estimado', stats.estimado, true)
conferir('US-07 séries concluídas', stats.concluidas, 1)
conferir('US-07 série mais assistida', stats.maisAssistida.serie.nome, 'Encerrada')
conferir(
  'US-07 ranking de gêneros',
  stats.generos,
  [
    { nome: 'Drama', episodios: 3 },
    { nome: 'Comédia', episodios: 1 },
  ],
)

console.log(falhas === 0 ? '\nTodas as regras passaram.' : `\n${falhas} regra(s) falharam.`)
process.exit(falhas === 0 ? 0 : 1)
