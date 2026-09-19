# Architecture — Maratona

## 1. Visão Geral

SPA em React criada com Vite. O React Router controla as páginas, todas dentro de um layout comum (`Layout`), que tem Header, Footer e um `<Outlet />`. Os dados das séries vêm da API do TMDB. O progresso do usuário (séries acompanhadas e episódios assistidos) fica salvo no `localStorage`.

As chamadas à API ficam em `services/api.js`, e a leitura e escrita no localStorage ficam em `services/storage.js`. Assim as páginas cuidam só da tela e dos estados.

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── Footer.jsx
│   ├── HeroBanner.jsx
│   ├── SeriesRow.jsx
│   ├── SeriesCard.jsx
│   ├── SeasonCard.jsx
│   ├── EpisodeItem.jsx
│   ├── ProgressBar.jsx
│   ├── Loading.jsx
│   └── Message.jsx
├── pages/
│   ├── Home.jsx
│   ├── Search.jsx
│   ├── SeriesDetails.jsx
│   ├── Season.jsx
│   ├── MySeries.jsx
│   └── NotFound.jsx
├── services/
│   ├── api.js
│   └── storage.js
├── App.jsx
├── main.jsx
└── index.css
```

A pasta `services/` foi adicionada para separar o acesso à API e ao localStorage dos componentes visuais.

## 3. Páginas e Rotas

| Página | Rota | Objetivo |
|---|---|---|
| Home | `/` | Descobrir séries: destaque + carrosséis (em alta, populares, mais bem avaliadas) |
| Search | `/buscar/:termo` | Mostrar os resultados da busca pelo termo da URL |
| SeriesDetails | `/serie/:id` | Detalhes da série, temporadas, botão Acompanhar e recomendações |
| Season | `/serie/:id/temporada/:numero` | Lista de episódios da temporada para marcar como assistidos |
| MySeries | `/minhas-series` | Séries acompanhadas, com progresso e próximo episódio |
| NotFound | `*` | Página 404 |

Todas as rotas ficam aninhadas na rota `/`, que renderiza o `Layout`.

## 4. Componentes

| Componente | Responsabilidade | Props |
|---|---|---|
| Layout | Estrutura comum (Header, `<Outlet />`, Footer) e animação de troca de página | — |
| Header | Logo, navegação (NavLink) e barra de busca. Fica sólido ao rolar | — |
| SearchBar | Formulário de busca que navega para `/buscar/:termo` | — |
| Footer | Rodapé com o crédito ao TMDB | — |
| HeroBanner | Destaque em tela cheia da série em alta | `serie` |
| SeriesRow | Título + carrossel horizontal de cards | `titulo`, `series` |
| SeriesCard | Card com pôster, nota e nome. Leva para a série | `serie`, `index` (atraso da animação) |
| SeasonCard | Card de temporada com progresso | `serieId`, `temporada`, `assistidos`, `acompanhando`, `index` |
| EpisodeItem | Episódio com imagem, informações e botão de check | `episodio`, `assistido`, `onToggle`, `index` |
| ProgressBar | Barra de progresso com contagem e porcentagem | `atual`, `total` |
| Loading | Estado de carregamento (spinner) | `texto` |
| Message | Estados de vazio e erro, com link opcional | `icone`, `titulo`, `texto`, `link`, `textoLink` |

## 5. Estado da Aplicação

| Estado | Onde será controlado? | Por quê? |
|---|---|---|
| `rolou` | Header | Muda o visual do header quando a página rola |
| `termo` | SearchBar | Controla o valor do input de busca |
| `emAlta`, `populares`, `maisAvaliadas` | Home | Listas vindas da API |
| `resultados` | Search | Resultado da busca |
| `serie`, `recomendadas` | SeriesDetails | Dados da série e as recomendações |
| `serie`, `temporada` | Season | Dados da série e os episódios da temporada |
| `acompanhadas` | SeriesDetails, Season, MySeries | Cópia do localStorage. É atualizada a cada ação para a tela reagir na hora |
| `carregando`, `erro` | Home, Search, SeriesDetails, Season | Controlam os estados de carregando, sucesso e erro |

## 6. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Carregar a home | Ao montar a Home | Busca as séries em alta, populares e mais bem avaliadas (`Promise.all`) |
| Buscar séries | Ao montar a Search e quando `termo` muda | Chama a busca do TMDB |
| Carregar a série | Ao montar a SeriesDetails e quando `id` muda | Busca os detalhes e as recomendações |
| Carregar a temporada | Ao montar a Season e quando `id` ou `numero` mudam | Busca a série e os episódios da temporada |
| Scroll do header | Ao montar o Header | Adiciona o listener de scroll e remove na desmontagem |
| Voltar ao topo | Quando a rota muda (Layout) | `window.scrollTo(0, 0)` |

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| react / react-dom | Base da aplicação | Requisito da disciplina |
| react-router-dom | Rotas, layout com Outlet, rotas dinâmicas, NavLink, useParams, useNavigate | Navegação entre várias páginas |
| react-icons | Ícones (Feather: `react-icons/fi`) | Requisito de biblioteca de ícones. O Feather tem traço fino e combina com o visual minimalista |

As animações (fade, slide, zoom e pop) usam apenas CSS (`@keyframes` e `transition`), sem biblioteca extra.
