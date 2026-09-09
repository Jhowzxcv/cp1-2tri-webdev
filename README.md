# Cliffhanger

> Você sempre parou no meio. A gente lembra onde.

MVP em React desenvolvido para o **CP1 — 2º trimestre — Web Development**, a
partir do encerramento do TV Time em julho de 2026.

- **Site publicado:** <https://cliffhanger-tv.vercel.app>
- **Repositório:** <https://github.com/Jhowzxcv/cp1-2tri-webdev>

---

## Integrantes

| Nome | RM |
|---|---|
| Jhonathan Dourado | 569568 |
| João Matheus Feliciano de Bueno | 569850 |

---

## O problema

O TV Time foi encerrado em 15 de julho de 2026 e cerca de 25 milhões de pessoas
perderam, de uma vez, histórico de episódios, avaliações, watchlist e o recap
anual *REWIND* — sem possibilidade de recuperação.

O mercado se dividiu depois disso: **Trakt** e **Simkl** ficaram com a
automação (scrobbling via Plex, Kodi e extensão de navegador), **Serializd**
ficou com o lado social e de resenhas, **Moviebase** virou a opção estável no
Android. Nenhum deles é substituto único, porque o TV Time fazia várias coisas
ao mesmo tempo.

A camada que ficou mais órfã na web é a mais simples de todas:

> **Quem acompanha várias séries ao mesmo tempo não lembra em qual episódio
> parou, não sabe o que assistir hoje e não tem noção do quanto já investiu
> nisso.**

Escolhemos esse problema — **acompanhar séries e episódios**, com
**estatísticas pessoais** como camada de apoio.

## A solução

Uma plataforma web responsiva que responde a uma pergunta em menos de cinco
segundos: **"o que eu assisto agora?"**

A página inicial não abre com catálogo nem com descoberta. Abre com a lista das
séries que você acompanha, cada uma já mostrando o **próximo episódio exato** e
um botão para marcá-lo como visto sem sair da tela. Como consequência do uso,
o painel de estatísticas se preenche sozinho — o lugar que ocupa o vazio
deixado pelo REWIND.

O escopo é deliberadamente estreito: **só séries**, sem conta, sem rede social,
sem recomendação. O enunciado pede um MVP, não a reconstrução do TV Time.

---

## Funcionalidades

| | Funcionalidade | User story |
|---|---|---|
| ✅ | Buscar séries pelo nome, com sugestões de populares quando o campo está vazio | US-01 |
| ✅ | Ver detalhes da série: sinopse, gêneros, nota, status e temporadas | US-02 |
| ✅ | Adicionar e remover séries da lista pessoal (remoção pede confirmação) | US-03 |
| ✅ | Marcar episódios como assistidos, um a um ou por temporada inteira | US-04 |
| ✅ | Ver o próximo episódio de cada série já na página inicial | US-05 |
| ✅ | Acompanhar progresso por série e por temporada | US-06 |
| ✅ | Painel de estatísticas: episódios, horas, gêneros e série mais assistida | US-07 |
| ✅ | Filtrar a lista por situação (em andamento, em dia, concluídas) | US-08 |

Detalhes que sustentam essas funcionalidades:

- **Episódios não lançados** aparecem na lista, mas inertes: não podem ser
  marcados e ficam fora do cálculo de progresso — sem isso, uma série em
  exibição nunca chegaria a 100%.
- **Marcar o episódio 5 não marca os anteriores.** As pessoas assistem fora de
  ordem; assumir linearidade produziria estatísticas falsas.
- **Todos os estados são tratados**: carregando (esqueleto com a forma do
  conteúdo), vazio, erro com botão de tentar novamente, e um estado próprio
  para "chave de API não configurada".

---

## Tecnologias

| Camada | Escolha |
|---|---|
| Build | Vite |
| UI | React 18 (componentes de função) |
| Rotas | React Router DOM 6 — layout, rotas dinâmicas e aninhadas |
| Ícones | react-icons (conjunto Feather) |
| Estilos | CSS por componente + variáveis CSS, mobile first |
| Dados | `fetch` nativo dentro de `useEffect` |
| Persistência | `localStorage` |

**Restrição deliberada:** nenhuma biblioteca de estado global (Redux, Zustand),
nenhuma de data fetching (React Query, SWR) e nenhum framework de UI. O estado
compartilhado é resolvido com **estado elevado + props**, que é o mecanismo que
o enunciado avalia.

### API usada

**[TMDB — The Movie Database](https://developer.themoviedb.org/docs/getting-started)**

Escolhida por ter o catálogo de séries detalhado até o nível de episódio (o que
o cálculo de "próximo episódio" exige), suporte a `pt-BR`, imagens hospedadas e
uso gratuito para projetos não comerciais.

Endpoints consumidos:

| Função | Endpoint | Onde |
|---|---|---|
| `buscarSeries` | `GET /search/tv` | Busca |
| `buscarSerie` | `GET /tv/{id}` | Detalhes da série |
| `buscarTemporada` | `GET /tv/{id}/season/{n}` | Temporada |
| `buscarTodosEpisodios` | várias temporadas em `Promise.all` | Início, Detalhes da série |
| `buscarPopulares` | `GET /tv/popular` | Sugestões na Busca |

---

## Como executar

Pré-requisitos: **Node.js 18+** e uma chave gratuita do TMDB.

```bash
# 1. clonar e entrar na pasta
git clone https://github.com/Jhowzxcv/cp1-2tri-webdev.git
cd cp1-2tri-webdev

# 2. instalar as dependências
npm install

# 3. configurar a chave da API
cp .env.example .env
# abra o .env e cole sua chave em VITE_TMDB_API_KEY

# 4. rodar
npm run dev
```

A aplicação sobe em <http://localhost:5173>.

**Como conseguir a chave do TMDB:** crie uma conta em
[themoviedb.org](https://www.themoviedb.org), vá em *Configurações → API* e
copie a **API Key (v3 auth)**.

> Se abrir a aplicação sem a chave configurada, ela não quebra: mostra uma tela
> explicando exatamente o que fazer.

### Outros comandos

```bash
npm run build          # build de produção em dist/
npm run preview        # serve o build localmente
npm run testar-regras  # confere as regras de produto (RP-01 a RP-08)
```

`npm run testar-regras` roda 22 verificações em Node puro, sem framework, sobre
as funções de `src/utils/progresso.js` — cálculo de próximo episódio,
progresso, situação da série e estatísticas.

### Publicação na Vercel

1. Importe o repositório na Vercel (ela detecta Vite sozinha).
2. Em *Settings → Environment Variables*, adicione `VITE_TMDB_API_KEY`.
3. O `vercel.json` já reescreve todas as rotas para o `index.html` — sem isso,
   recarregar a página em `/serie/1399` daria 404, porque é uma SPA.

---

## Estrutura do projeto

```
cp1-2tri-webdev/
├── docs/                    ← especificação (Spec Driven Development)
│   ├── requirements.md      ← objetivo, público, user stories, estados, regras
│   ├── architecture.md      ← páginas, rotas, componentes, props, estados, efeitos
│   └── references/          ← referências visuais + justificativas
├── design/                  ← canvas de design (artboards das telas)
├── scripts/
│   └── testar-regras.mjs
├── src/
│   ├── components/          ← componentes reutilizáveis, sem rota
│   ├── layouts/             ← casca com cabeçalho, <Outlet /> e rodapé
│   ├── pages/               ← um componente por rota
│   ├── services/tmdb.js     ← todas as chamadas HTTP ficam aqui
│   ├── utils/               ← regras de produto, formatação, localStorage
│   ├── App.jsx              ← estado compartilhado + <Routes />
│   └── main.jsx
├── vercel.json              ← rewrite de SPA para o React Router
└── README.md
```

### Rotas

| Rota | Página |
|---|---|
| `/` | Início — próximo episódio de cada série |
| `/busca` | Busca |
| `/serie/:id` | Detalhes da série *(rota dinâmica)* |
| `/serie/:id/temporada/:numero` | Temporada *(rota dinâmica aninhada)* |
| `/estatisticas` | Estatísticas |
| `*` | Página não encontrada |

---

## Uso de IA

Usamos IA em todas as etapas, seguindo a metodologia de **Spec Driven
Development** exigida pelo enunciado: primeiro a especificação, depois o
desenho, depois o código.

**Onde a IA ajudou:**

- Pesquisa de contexto sobre o encerramento do TV Time e o que os concorrentes
  (SofaTime, Trakt, Simkl, Serializd, Moviebase) cobrem hoje — foi essa pesquisa
  que apontou a lacuna que escolhemos atacar.
- Redação de `docs/requirements.md` e `docs/architecture.md` a partir das nossas
  decisões de escopo.
- Implementação dos componentes e páginas conforme a arquitetura já definida.
- Revisão das regras de produto e escrita do script de verificação.

**O que continuou sendo nosso:**

- A escolha do problema e o recorte do MVP (só séries, sem rede social, sem
  recomendação).
- As regras de produto — em especial as três que mais definem o produto:
  progresso ignora episódios não lançados, marcação não é retroativa, e "em dia"
  é diferente de "concluída".
- As decisões de design: hierarquia da página inicial, tratamento de episódio
  futuro, e a opção por blocos numéricos em vez de gráficos na tela de
  estatísticas.
- A restrição técnica de usar apenas o que foi visto em aula.

Cada arquivo do `src/` foi lido e entendido antes de entrar no projeto. As
funções de `src/utils/progresso.js` estão comentadas com a regra de produto
(RP-xx) que implementam, e `npm run testar-regras` prova que elas fazem o que a
especificação diz.

---

## Créditos

Dados de séries e imagens fornecidos pelo [TMDB](https://www.themoviedb.org).
Este produto usa a API do TMDB, mas não é endossado nem certificado por ele.
