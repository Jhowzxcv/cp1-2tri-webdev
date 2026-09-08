# Onde Parei — Arquitetura

> Documento de desenho técnico (fase *Design* do Spec Driven Development).
> Deriva de [`requirements.md`](./requirements.md). Cada componente aqui
> descrito atende a uma ou mais user stories (US-xx) e respeita as regras de
> produto (RP-xx).

---

## 1. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Build | **Vite** | Padrão usado em aula para projetos React |
| UI | **React** (function components) | Requisito do enunciado |
| Rotas | **react-router-dom** | Requisito: múltiplas páginas, layouts e rotas dinâmicas |
| Ícones | **react-icons** | Requisito: biblioteca de ícones |
| Estilos | **CSS por componente** + variáveis CSS | Um `.css` ao lado de cada `.jsx`, importado por ele. Não introduz nenhum conceito além de `import` de CSS |
| Dados | **fetch** nativo → API TMDB | Requisito: consumo de API via `useEffect` |
| Persistência | **localStorage** | RP-10: MVP sem backend |

**Restrição deliberada:** nenhuma biblioteca de estado global (Redux, Zustand),
nenhum data-fetching library (React Query, SWR) e nenhum framework de UI
(MUI, Chakra). O enunciado proíbe recursos não vistos em aula. O estado
compartilhado é resolvido com **estado elevado (lifting state up) + props**,
que é o mecanismo que o enunciado pede explicitamente ("props entre
componentes").

---

## 2. Estrutura de pastas

```
onde-parei/
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   └── references/
│       ├── references.md
│       └── *.png                    ← capturas das referências visuais
├── design/                          ← canvas de design (artboards das telas)
├── scripts/
│   └── testar-regras.mjs            ← confere RP-01 a RP-08 em Node puro
├── public/
│   ├── favicon.svg
│   └── sem-poster.svg               ← fallback de imagem (US-01)
├── src/
│   ├── components/                  ← componentes reutilizáveis, sem rota
│   │   ├── BarraProgresso/
│   │   ├── BotaoAcompanhar/
│   │   ├── Cabecalho/
│   │   ├── CardProximoEpisodio/
│   │   ├── CardSerie/
│   │   ├── CardEstatistica/
│   │   ├── CampoBusca/
│   │   ├── EstadoErro/
│   │   ├── EstadoVazio/
│   │   ├── FiltroSituacao/
│   │   ├── ItemEpisodio/
│   │   ├── Rodape/
│   │   └── Skeleton/
│   ├── layouts/
│   │   └── LayoutPrincipal/         ← cabecalho + <Outlet /> + rodape
│   ├── pages/                       ← um componente por rota
│   │   ├── Inicio/
│   │   ├── Busca/
│   │   ├── DetalhesSerie/
│   │   ├── Temporada/
│   │   ├── Estatisticas/
│   │   └── NaoEncontrada/
│   ├── services/
│   │   └── tmdb.js                  ← todas as chamadas HTTP ficam aqui
│   ├── utils/
│   │   ├── armazenamento.js         ← leitura/escrita no localStorage
│   │   ├── progresso.js             ← RP-01 a RP-08
│   │   └── formato.js               ← datas, duração, imagens
│   ├── styles/
│   │   └── global.css               ← reset + variáveis de tema
│   ├── App.jsx                      ← estado global + <Routes />
│   └── main.jsx                     ← <BrowserRouter> + <App />
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vercel.json                      ← rewrite SPA para o React Router
└── README.md
```

**Convenção:** uma pasta por componente, contendo `NomeDoComponente.jsx` e
`NomeDoComponente.css`. Nomes de componentes e pastas em `PascalCase`, funções e
variáveis em `camelCase`, em português — mesmo padrão usado em aula. As classes
CSS são prefixadas pelo nome do componente (`card-serie__titulo`), o que dá o
escopo na prática sem depender de CSS Modules.

---

## 3. Rotas

Definidas em `App.jsx` com `<Routes>` / `<Route>`. O layout é uma rota-pai sem
path próprio, que renderiza `<Outlet />`.

| Rota | Tipo | Página | User stories |
|---|---|---|---|
| `/` | índice | `Inicio` | US-05, US-06, US-08 |
| `/busca` | estática | `Busca` | US-01 |
| `/serie/:id` | **dinâmica** | `DetalhesSerie` | US-02, US-03, US-06 |
| `/serie/:id/temporada/:numero` | **dinâmica aninhada** | `Temporada` | US-04 |
| `/estatisticas` | estática | `Estatisticas` | US-07 |
| `*` | curinga | `NaoEncontrada` | — |

### Árvore de rotas

```jsx
<Routes>
  <Route element={<LayoutPrincipal />}>
    <Route index element={<Inicio ... />} />
    <Route path="busca" element={<Busca ... />} />
    <Route path="serie/:id" element={<DetalhesSerie ... />} />
    <Route path="serie/:id/temporada/:numero" element={<Temporada ... />} />
    <Route path="estatisticas" element={<Estatisticas ... />} />
    <Route path="*" element={<NaoEncontrada />} />
  </Route>
</Routes>
```

Os parâmetros dinâmicos são lidos com `useParams()`:
`const { id, numero } = useParams()`.

Navegação usa `<Link>` (links de conteúdo) e `<NavLink>` (menu do cabeçalho,
que precisa de estado ativo, via a função `className={({ isActive }) => ...}`).
A busca não navega: ela filtra na própria rota conforme o usuário digita, então
não precisa de `useNavigate()`.

> **Deploy:** por ser SPA, a Vercel precisa reescrever todas as rotas para
> `index.html`, senão `/serie/1399` dá 404 ao recarregar. É o papel do
> `vercel.json`.

---

## 4. Onde vive cada estado

O estado que **mais de uma página precisa** (a lista pessoal e o progresso) é
elevado para `App.jsx` e desce por props. O estado que só uma página usa
(termo de busca, resultados, carregamento) fica na própria página.

### 4.1 Estado global — `App.jsx`

| Estado | Tipo | Inicial | Descrição |
|---|---|---|---|
| `series` | `array` | `lerSeries()` do localStorage | Séries acompanhadas, com metadados resumidos |
| `assistidos` | `object` | `lerAssistidos()` do localStorage | Mapa de episódios marcados |
| `resumos` | `object` | `lerResumos()` do localStorage | Total de episódios lançados e status por série |

**Formato de `series`** — guardamos só o que a página inicial precisa, para não
depender de nova requisição de detalhes a cada render:

```js
[
  {
    id: 1399,
    nome: "Game of Thrones",
    poster: "/xyz.jpg",
    ano: 2011,
    status: "Ended",
    generos: ["Drama", "Fantasia"],
    temporadas: [
      { season_number: 1, episode_count: 10, name: "Temporada 1", air_date: "2011-04-17" }
    ],
    adicionadaEm: "2026-09-08T12:00:00.000Z"
  }
]
```

**Formato de `assistidos`** — chave `serieId`, valor com o conjunto de
episódios marcados. Usamos array de strings `"T-E"` porque `Set` não é
serializável em JSON:

```js
{
  "1399": {
    episodios: ["1-1", "1-2", "1-3", "2-1"],
    duracoes: { "1-1": 62, "1-2": 56, "1-3": 58, "2-1": 53 }
  }
}
```

`duracoes` é gravado no momento da marcação (RP-08). Sem isso, a página de
estatísticas precisaria refazer uma requisição por temporada só para somar
minutos.

**Formato de `resumos`** — chave `serieId`. Gravado pelas páginas que já
carregaram os episódios (Início e Detalhes), consumido pela página de
Estatísticas para saber quantas séries estão concluídas sem refazer requisição
nenhuma (RP-05):

```js
{
  "1399": { totalLancados: 73, status: "Ended" }
}
```

> **Por que não guardar a situação já calculada:** ela muda toda vez que um
> episódio é marcado. Guardar `'concluida'` criaria uma segunda fonte de verdade
> capaz de dessincronizar do `assistidos`. Guardamos os dois números crus e
> derivamos a situação no render.

### 4.2 Funções de mutação (definidas em `App.jsx`, passadas por props)

| Função | Assinatura | Regra |
|---|---|---|
| `acompanharSerie` | `(serie) => void` | Adiciona se não existir (US-03) |
| `deixarDeAcompanhar` | `(serieId) => void` | Remove série, progresso **e** resumo (RP-09) |
| `alternarEpisodio` | `(serieId, temporada, episodio, duracao) => void` | Marca/desmarca um episódio (US-04, RP-06) |
| `marcarTemporada` | `(serieId, listaEpisodios) => void` | Marca todos os lançados da temporada (RP-03) |
| `desmarcarTemporada` | `(serieId, temporada) => void` | Remove todas as marcações daquela temporada |
| `salvarResumo` | `(serieId, { totalLancados, status }) => void` | Atualiza o resumo; devolve o estado anterior quando nada mudou, para não disparar renders em cadeia |
| `estaAcompanhando` | `(serieId) => boolean` | Consulta usada por Busca e Detalhes |

Todas usam atualização imutável (`spread`/`map`/`filter`), nunca mutação direta
do estado.

### 4.3 Estado local por página

| Página | Estados |
|---|---|
| `Inicio` | `dados` (série + episódios carregados), `filtro` (`'todas'` · `'andamento'` · `'emDia'` · `'concluidas'`), `carregando`, `erro`, `tentativa` |
| `Busca` | `termo`, `resultados`, `populares`, `carregando`, `erro` |
| `DetalhesSerie` | `serie`, `episodios`, `carregando`, `erro`, `tentativa` |
| `Temporada` | `temporada`, `carregando`, `erro`, `tentativa` |
| `Estatisticas` | — (tudo derivado das props, calculado no render) |

`tentativa` é um contador que só existe para o botão "Tentar novamente":
incrementá-lo muda a lista de dependências do efeito e força uma nova
requisição, sem precisar de nenhuma API além de `useState` e `useEffect`.

Progresso, próximo episódio e situação **não são estado**: são recalculados no
render a partir de `episodios` (que veio da API) e `assistidos` (que veio das
props). É o que garante que marcar um episódio atualize a barra, o contador e a
classificação da série na mesma interação, sem nova requisição.

> **Decisão:** `Estatisticas` não tem estado próprio. Números derivados de
> outro estado não devem virar estado — seriam uma segunda fonte de verdade
> capaz de dessincronizar (US-07 exige que os números batam exatamente).

---

## 5. Efeitos (`useEffect`)

| Página / arquivo | Dependências | O que faz | Cleanup |
|---|---|---|---|
| `App.jsx` | `[series]` | Grava `series` no localStorage | — |
| `App.jsx` | `[assistidos]` | Grava `assistidos` no localStorage | — |
| `App.jsx` | `[resumos]` | Grava `resumos` no localStorage | — |
| `Inicio.jsx` | `[series, tentativa]` | Carrega os episódios de cada série acompanhada | `ativo = false` |
| `Inicio.jsx` | `[dados, aoSalvarResumo]` | Grava o resumo de cada série carregada | — |
| `Busca.jsx` | `[]` | Carrega séries populares para o estado inicial da página | `ativo = false` |
| `Busca.jsx` | `[termo, tentativa]` | Consulta `buscarSeries(termo)` com debounce de 400 ms | `clearTimeout` + `ativo = false` |
| `DetalhesSerie.jsx` | `[id, tentativa]` | Consulta `buscarSerie(id)` e depois os episódios | `ativo = false` |
| `DetalhesSerie.jsx` | `[serie, episodios, aoSalvarResumo]` | Grava o resumo da série | — |
| `Temporada.jsx` | `[id, numero, tentativa]` | Consulta `buscarTemporada(id, numero)` | `ativo = false` |
| `LayoutPrincipal.jsx` | `[location.pathname]` | `window.scrollTo(0, 0)` ao trocar de rota | — |

> **Por que os efeitos de resumo não entram em laço infinito:** `salvarResumo`
> compara com o valor já guardado e devolve o mesmo objeto de estado quando nada
> mudou. O React não re-renderiza quando o estado é idêntico, então a cadeia
> converge na segunda passada.

### Padrão de efeito com requisição

Todo efeito que faz `fetch` segue esta forma, para não chamar `setState` depois
que o componente saiu da tela (o clássico "race condition" quando o usuário
navega rápido entre séries):

```jsx
useEffect(() => {
  let ativo = true;

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await buscarSerie(id);
      if (ativo) setSerie(dados);
    } catch (e) {
      if (ativo) setErro(e.message);
    } finally {
      if (ativo) setCarregando(false);
    }
  }

  carregar();
  return () => { ativo = false; };
}, [id]);
```

> **Por que a dependência é `[id]` e não `[]`:** ao navegar de `/serie/1399`
> para `/serie/1396`, o React Router reaproveita o mesmo componente. Com `[]`
> o efeito não rodaria de novo e a tela mostraria a série anterior.

---

## 6. Catálogo de componentes e contratos de props

### 6.1 Layout

#### `LayoutPrincipal`

Casca de todas as rotas. Renderiza `<Cabecalho />`, `<main><Outlet /></main>` e
`<Rodape />`.

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| — | — | — | Não recebe props; consome `<Outlet />` |

---

### 6.2 Componentes de navegação

#### `Cabecalho`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `totalSeries` | `number` | não | Contador exibido ao lado do link "Minhas séries" |

Contém `<NavLink>` para `/`, `/busca` e `/estatisticas`, com ícones
`FiHome`, `FiSearch`, `FiBarChart2` (react-icons/fi). Em telas < 768 px vira
uma barra inferior fixa.

#### `CampoBusca`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `valor` | `string` | sim | Texto atual (componente controlado) |
| `aoMudar` | `function(string)` | sim | Chamada a cada digitação |
| `placeholder` | `string` | não | Padrão: `"Buscar séries..."` |

Componente **controlado**: não tem estado próprio, o dono do estado é a página
`Busca`. Ícone `FiSearch`, e `FiX` para limpar quando há texto.

---

### 6.3 Componentes de conteúdo

#### `CardSerie` — usado em `Busca` e `Inicio`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `id` | `number` | sim | Id TMDB, usado no `<Link>` |
| `nome` | `string` | sim | Título |
| `poster` | `string \| null` | sim | Caminho do pôster; `null` cai no fallback |
| `ano` | `number \| null` | não | Ano de estreia |
| `nota` | `number` | não | Nota média (exibe `FiStar`) |
| `progresso` | `object` | não | `{ assistidos, total, percentual }` — quando presente, renderiza `<BarraProgresso />` |

#### `CardProximoEpisodio` — coração da página inicial (US-05)

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `serie` | `object` | sim | `{ id, nome, poster }` |
| `episodio` | `object \| null` | sim | `{ temporada, numero, titulo, duracao }`; `null` = série em dia |
| `progresso` | `object` | sim | `{ assistidos, total, percentual }` |
| `aoMarcar` | `function()` | sim | Marca esse episódio direto do cartão (atalho de 1 clique) |

#### `ItemEpisodio` — linha da lista de episódios (US-04)

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `numero` | `number` | sim | Número do episódio |
| `titulo` | `string` | sim | Nome do episódio |
| `dataExibicao` | `string \| null` | sim | ISO `YYYY-MM-DD` |
| `duracao` | `number \| null` | não | Minutos |
| `assistido` | `boolean` | sim | Estado da marcação |
| `lancado` | `boolean` | sim | RP-03; quando `false`, o controle fica desabilitado |
| `aoAlternar` | `function()` | sim | Handler de marcar/desmarcar |

Ícones: `FiCheckCircle` (assistido) / `FiCircle` (não assistido) / `FiClock`
(não lançado).

#### `BarraProgresso`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `assistidos` | `number` | sim | Numerador |
| `total` | `number` | sim | Denominador (só episódios lançados — RP-04) |
| `compacta` | `boolean` | não | Esconde o texto, mantém só a barra |

Renderiza `role="progressbar"` com `aria-valuenow` / `aria-valuemax`.

#### `BotaoAcompanhar`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `acompanhando` | `boolean` | sim | Define rótulo e variante visual |
| `aoClicar` | `function()` | sim | Handler |

`FiPlus` → "Acompanhar" · `FiCheck` → "Seguindo". Ao clicar em "Seguindo",
`window.confirm` antes de remover (RP-09).

#### `FiltroSituacao`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `valor` | `string` | sim | Filtro ativo |
| `aoMudar` | `function(string)` | sim | Handler |
| `contagens` | `object` | não | `{ todas, andamento, emDia, concluidas }` para exibir números |

#### `CardEstatistica`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `icone` | `ReactNode` | sim | Elemento de ícone já instanciado |
| `valor` | `string \| number` | sim | Número em destaque |
| `rotulo` | `string` | sim | Legenda |
| `detalhe` | `string` | não | Linha secundária (ex.: "estimado") |

---

### 6.4 Componentes de estado

#### `Skeleton`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `variante` | `'card' \| 'linha' \| 'cabecalho'` | sim | Forma do esqueleto |
| `quantidade` | `number` | não | Quantas repetições (padrão 1) |

#### `EstadoVazio`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `icone` | `ReactNode` | não | Ícone ilustrativo |
| `titulo` | `string` | sim | Frase principal |
| `descricao` | `string` | não | Texto de apoio |
| `acao` | `ReactNode` | não | Botão ou `<Link>` sugerindo o próximo passo |

#### `EstadoErro`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `mensagem` | `string` | sim | Mensagem em linguagem comum |
| `aoTentarNovamente` | `function()` | não | Quando presente, exibe o botão de retry |

---

## 7. Camada de serviços — `services/tmdb.js`

Todas as chamadas HTTP ficam neste arquivo. Nenhum componente faz `fetch`
diretamente — isso mantém a URL base, a chave e o tratamento de erro em um
lugar só.

```js
const BASE = "https://api.themoviedb.org/3";
const CHAVE = import.meta.env.VITE_TMDB_API_KEY;
const IDIOMA = "pt-BR";
```

| Função | Endpoint | Retorno | Usada em |
|---|---|---|---|
| `buscarSeries(termo)` | `GET /search/tv` | Array de séries resumidas | `Busca` (US-01) |
| `buscarSerie(id)` | `GET /tv/{id}` | Série com temporadas | `DetalhesSerie` (US-02) |
| `buscarTemporada(id, numero)` | `GET /tv/{id}/season/{numero}` | Temporada com episódios | `Temporada` (US-04) |
| `buscarTodosEpisodios(id, temporadas)` | várias chamadas de temporada em `Promise.all` | Array único de episódios | `Inicio`, `DetalhesSerie` (US-05, US-06) |
| `buscarPopulares()` | `GET /tv/popular` | Sugestões | Estado inicial de `Busca` |

Todas passam `api_key` e `language=pt-BR` (RP-11), verificam `resposta.ok` e
lançam `Error` com mensagem em português quando a resposta falha. O componente
que chamou é quem decide como exibir o erro.

**Imagens:** `https://image.tmdb.org/t/p/w500{caminho}`. A função
`urlImagem(caminho, tamanho)` em `utils/formato.js` devolve `/sem-poster.svg`
quando o caminho é `null` (US-01).

**Chave de API:** vive em `.env` como `VITE_TMDB_API_KEY`. O `.env` está no
`.gitignore`; o repositório traz apenas `.env.example`. Na Vercel a variável é
configurada em *Settings → Environment Variables*.

---

## 8. Utilitários

### `utils/progresso.js` — implementa RP-01 a RP-05

| Função | Assinatura | Regra |
|---|---|---|
| `chaveEpisodio(t, e)` | `→ "T-E"` | RP-01 |
| `foiLancado(dataExibicao)` | `→ boolean` | RP-03 |
| `calcularProgresso(episodios, assistidos)` | `→ { assistidos, total, percentual }` | RP-04 |
| `ordenar(episodios)` | `→ episodios[]` | RP-01 |
| `acharProximoEpisodio(episodios, marcados)` | `→ episodio \| null` | RP-02 |
| `situacaoDaSerie(serie, progresso)` | `→ 'andamento' \| 'emDia' \| 'concluida'` | RP-05 |
| `serieConcluida(serie, assistidos, resumos)` | `→ boolean` | RP-05 |
| `calcularEstatisticas(series, assistidos, resumos)` | `→ { episodios, minutos, estimado, acompanhadas, concluidas, generos, maisAssistida }` | US-07, RP-08 |

Funções puras, sem React e sem `fetch` — recebem dados, devolvem dados. Isso as
torna verificáveis contra os critérios de aceitação: `npm run testar-regras`
roda 22 conferências sobre elas em Node puro, sem nenhuma biblioteca de teste.

### `utils/armazenamento.js`

`lerSeries()`, `gravarSeries()`, `lerAssistidos()`, `gravarAssistidos()`.
Toda leitura é envolvida em `try/catch`: navegador em modo anônimo ou com
dados de site bloqueados pode lançar exceção, e nesse caso a aplicação deve
abrir vazia em vez de quebrar.

Chaves: `ondeparei:series` e `ondeparei:assistidos`.

### `utils/formato.js`

`urlImagem(caminho, tamanho)`, `formatarData(iso)` → `08/09/2026`,
`formatarDuracao(minutos)` → `4d 7h` (US-07), `anoDe(iso)`.

---

## 9. Fluxos principais

### Fluxo A — Da busca ao primeiro episódio marcado (US-01 → US-04)

```
Busca                 digita "Severance"
  └─ useEffect [termo] ─→ tmdb.buscarSeries()
       └─ <CardSerie> ─ Link ─→ /serie/95396
DetalhesSerie
  └─ useEffect [id] ─→ tmdb.buscarSerie()
       └─ <BotaoAcompanhar aoClicar={acompanharSerie}>
            └─ App: setSeries([...series, nova])
                 └─ useEffect [series] ─→ localStorage
       └─ Link ─→ /serie/95396/temporada/1
Temporada
  └─ useEffect [id, numero] ─→ tmdb.buscarTemporada()
       └─ <ItemEpisodio aoAlternar={alternarEpisodio}>
            └─ App: setAssistidos({...})
                 └─ useEffect [assistidos] ─→ localStorage
```

### Fluxo B — Cálculo do próximo episódio na página inicial (US-05)

```
Inicio recebe props { series, assistidos }
  └─ useEffect [series]
       └─ Promise.all: buscarTodosEpisodios() de cada série acompanhada
            └─ setDados([{ serie, episodios }])
                 └─ no render, para cada série:
                      calcularProgresso(episodios, marcados)       ← RP-04
                      acharProximoEpisodio(episodios, marcados)    ← RP-02
                      situacaoDaSerie(serie, progresso)            ← RP-05
                           └─ <CardProximoEpisodio episodio={...}>
```

> **Trade-off assumido:** carregar todas as temporadas de todas as séries custa
> uma requisição por temporada. Para a escala do MVP (uma dúzia de séries) isso
> é aceitável, e é o que permite calcular progresso e próximo episódio pela
> mesma regra em todas as telas. A alternativa — buscar só a temporada onde o
> usuário parou — economizaria requisições, mas deixaria o denominador do
> progresso incompleto e quebraria a RP-04. Preferimos a regra correta.

### Fluxo C — Estatísticas (US-07)

Nenhuma requisição. `calcularEstatisticas(series, assistidos)` roda no render,
somando `duracoes` já gravadas na marcação (RP-08) e agrupando `generos` das
séries acompanhadas.

---

## 10. Responsividade

Abordagem *mobile first*. Breakpoints em `styles/global.css`:

| Faixa | Layout |
|---|---|
| < 768 px | 1 coluna; navegação em barra inferior fixa; grade de pôsteres 2 colunas |
| 768–1023 px | Navegação no topo; grade 3–4 colunas |
| ≥ 1024 px | Conteúdo com largura máxima de 1200 px, centralizado; grade 5–6 colunas |

Grades usam `grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))`, o
que evita media queries só para contar colunas.

---

## 11. Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Estado elevado + props | Context API / Redux | O enunciado avalia "props entre componentes"; a árvore é rasa o suficiente (máx. 3 níveis) para não sofrer com prop drilling |
| CSS por componente | CSS Modules / Tailwind | Não introduz nenhum conceito além de `import` de arquivo CSS, respeitando a restrição de usar só o que foi visto em aula |
| `resumos` como terceiro estado | Recalcular a situação na tela de estatísticas | Sem os episódios em mãos não dá para saber quantos foram lançados; guardar os dois números crus evita uma enxurrada de requisições e mantém uma só fonte de verdade |
| `localStorage` | Backend com banco | Fora do escopo do MVP; mantém o foco no React |
| Guardar `duracoes` na marcação | Recalcular buscando temporadas | Evita N requisições só para exibir estatísticas |
| Sem marcação retroativa automática (RP-06) | Marcar tudo até o episódio clicado | Assumir ordem linear geraria dados falsos para quem assiste fora de ordem |
| Só séries, sem filmes | Séries + filmes | Filmes não têm o conceito de "próximo episódio", que é a proposta central |
| Skeletons em vez de spinner | Spinner central | Reduz a percepção de espera e evita salto de layout |

---

## 12. Rastreabilidade — user story → implementação

| US | Rota | Componentes | Estado / Efeito |
|---|---|---|---|
| US-01 | `/busca` | `CampoBusca`, `CardSerie`, `Skeleton`, `EstadoVazio`, `EstadoErro` | `termo`, `resultados` · efeito `[termo]` |
| US-02 | `/serie/:id` | `BarraProgresso`, `BotaoAcompanhar` | `serie` · efeito `[id]` |
| US-03 | `/serie/:id` | `BotaoAcompanhar` | `series` (App) |
| US-04 | `/serie/:id/temporada/:numero` | `ItemEpisodio` | `assistidos` (App) · efeito `[id, numero]` |
| US-05 | `/` | `CardProximoEpisodio` | `proximos` · efeito `[series]` |
| US-06 | `/`, `/serie/:id` | `BarraProgresso` | derivado de `assistidos` |
| US-07 | `/estatisticas` | `CardEstatistica` | derivado (sem estado) |
| US-08 | `/` | `FiltroSituacao` | `filtro` |
