# Cliffhanger — Referências visuais

> Referências de produtos digitais que motivaram decisões concretas de design.
> Para cada uma: **qual elemento observamos**, **onde ele foi usado** no nosso
> produto e **por que ele é adequado** ao problema que escolhemos
> (acompanhar séries e episódios + estatísticas pessoais).

Nenhuma referência foi copiada visualmente. O que foi reaproveitado é a
**decisão de design** por trás do elemento.

---

## Referência 1 — Spotify

**Arquivo:** `spotify-home.png`
**Onde ver:** tela inicial do app / web player

### Elemento observado

A primeira seção da home é **"Tocados recentemente"** — não é o catálogo, não é
descoberta, não é busca. O produto assume que quem abre o app na maior parte
das vezes quer **retomar algo**, não começar algo novo. A ação de continuar
está a zero clique de distância: já está na tela.

### Onde usamos

Na página **Início** (`/`). A primeira coisa acima da dobra é a lista
`<CardProximoEpisodio>` — cada série acompanhada com o episódio exato que vem a
seguir, com o botão de marcar dentro do próprio cartão. Busca e descoberta
foram empurradas para uma rota separada (`/busca`), acessível pelo menu.

### Por que é adequado

Nosso problema declarado em [`requirements.md`](../requirements.md) é
literalmente "não lembro onde parei". A métrica de sucesso do MVP é **saber o
próximo episódio em até 5 segundos**. Uma home que começasse com um catálogo de
séries populares seria bonita e responderia à pergunta errada. O Spotify já
resolveu essa tensão entre *retomar* e *descobrir* no mesmo produto, e a
resolveu a favor do retomar — que é exatamente a nossa hierarquia.

---

## Referência 2 — Strava

**Arquivo:** `strava-stats.png`
**Onde ver:** aba de perfil / resumo de atividades

### Elemento observado

O resumo de estatísticas em **blocos numéricos grandes** (distância, tempo,
elevação), com o número em destaque tipográfico forte e o rótulo pequeno
embaixo. O valor é lido antes do rótulo. Nenhum gráfico complexo na primeira
camada — os gráficos vêm depois, se a pessoa quiser aprofundar.

### Onde usamos

Na página **Estatísticas** (`/estatisticas`), no componente
`<CardEstatistica>`: uma grade de quatro blocos com episódios assistidos, tempo
total, séries acompanhadas e séries concluídas. A distribuição por gênero
aparece **abaixo** dessa grade, como camada secundária.

### Por que é adequado

Essa página existe para preencher a lacuna deixada pelo **REWIND**, o recap
anual do TV Time que sumiu com o app e que nenhum concorrente replicou bem na
web. O Strava é o melhor exemplo de produto que transforma esforço acumulado em
identidade — e faz isso com números grandes e legíveis, não com dashboards. Como
o nosso volume de dados no MVP é modesto (um usuário, sem histórico importado),
uma visualização pesada pareceria vazia. Blocos numéricos escalam bem tanto com
10 episódios quanto com 2.000.

---

## Referência 3 — Duolingo

**Arquivo:** `duolingo-lesson.png`
**Onde ver:** trilha de lições e barra de progresso da lição

### Elemento observado

Duas coisas: (1) a **barra de progresso sempre visível** durante a lição, que
mostra o quanto falta e não o quanto já foi; (2) o **feedback imediato** ao
completar um item — o estado muda na hora, sem tela de confirmação, sem
recarregar.

### Onde usamos

- A `<BarraProgresso>` aparece em três lugares: no cartão de cada série na
  Início, no cabeçalho da página de detalhes e por temporada.
- `<ItemEpisodio>` alterna o estado no clique, atualizando barra e contador na
  mesma interação — sem modal, sem "salvar".

### Por que é adequado

O critério de aceitação da US-04 exige que a marcação seja "refletida na
interface sem recarregar a página", e o da US-06 exige progresso visível por
série e por temporada. Marcar episódio é uma ação **repetitiva e de baixo
valor individual** — quem maratona marca 10 seguidos. Qualquer atrito (confirmação,
espera, recarga) multiplica por 10. O Duolingo é o produto que mais otimizou
esse tipo específico de microinteração repetida.

> **Onde discordamos da referência:** o Duolingo é linear — completar a lição 5
> pressupõe as anteriores. Nós não adotamos isso (RP-06): marcar o episódio 5
> **não** marca os anteriores, porque as pessoas assistem fora de ordem, pulam
> episódio de enchimento e reveem temporadas. Copiar a linearidade geraria dados
> falsos nas estatísticas.

---

## Referência 4 — Letterboxd

**Arquivo:** `letterboxd-film.png`
**Onde ver:** página de um filme

### Elemento observado

O **pôster como âncora da página**: imagem grande à esquerda, metadados
compactos à direita (ano, duração, gêneros, nota), sinopse abaixo, e as ações do
usuário (marcar como visto, avaliar, listar) agrupadas em um bloco só, sempre no
mesmo lugar. Densidade alta de informação sem parecer poluído.

### Onde usamos

Na página **Detalhes da série** (`/serie/:id`): pôster à esquerda em telas
largas (empilhado no mobile), metadados e `<BotaoAcompanhar>` agrupados à
direita, lista de temporadas abaixo.

### Por que é adequado

Séries têm mais metadados que filmes (status de produção, número de temporadas,
progresso pessoal) e menos espaço vertical para desperdiçar. O Letterboxd
resolve o problema de "muito dado, uma tela" mantendo o pôster como ponto de
reconhecimento — a pessoa confirma que está na série certa pela imagem, em
milissegundos, antes de ler qualquer texto. É também a referência mais próxima do
nosso domínio, e por isso a que mais precisou de filtro: o Letterboxd é
centrado em **resenha e opinião**, que estão explicitamente fora do escopo do
nosso MVP.

---

## Referência 5 — Google Calendar

**Arquivo:** `google-calendar.png`
**Onde ver:** visualização de agenda / eventos futuros

### Elemento observado

O tratamento visual distinto para **o que ainda não aconteceu**: eventos
futuros aparecem, mas com peso visual menor, e não são acionáveis como os
passados. O usuário vê que existe algo à frente sem confundir com o presente.

### Onde usamos

Em `<ItemEpisodio>`, para episódios ainda não lançados (RP-03): eles aparecem
na lista da temporada com opacidade reduzida, ícone `FiClock` em vez do controle
de marcação, e o controle desabilitado. Também sustentam a RP-04 — episódios não
lançados ficam fora do denominador do progresso.

### Por que é adequado

Séries em exibição têm episódios anunciados mas não lançados, e a API do TMDB os
retorna junto com os demais. Duas soluções ruins seriam: esconder (o usuário
perde a informação de que a temporada continua) ou tratar igual (deixaria marcar
algo que não existe e travaria o progresso abaixo de 100% para sempre). O Google
Calendar mostra a terceira via — **presente, porém inerte**.

---

## Tabela-resumo

| Referência | Necessidade atendida | Elemento | Onde foi aplicado |
|---|---|---|---|
| Spotify | Retomada | "Tocados recentemente" no topo da home | `Inicio` → `CardProximoEpisodio` |
| Strava | Estatísticas | Blocos numéricos de resumo | `Estatisticas` → `CardEstatistica` |
| Duolingo | Progresso e microinteração | Barra de progresso + feedback imediato | `BarraProgresso`, `ItemEpisodio` |
| Letterboxd | Perfil de conteúdo | Pôster como âncora + metadados agrupados | `DetalhesSerie` |
| Google Calendar | Conteúdo futuro | Item futuro presente porém inerte | `ItemEpisodio` (não lançado) |

---

## Capturas de tela — pendente

As imagens citadas acima devem ser salvas **nesta pasta**
(`docs/references/`) com os nomes exatos:

- [ ] `spotify-home.png`
- [ ] `strava-stats.png`
- [ ] `duolingo-lesson.png`
- [ ] `letterboxd-film.png`
- [ ] `google-calendar.png`

Recomendação: capturar a tela real do produto (print do app ou do site),
recortando apenas a região do elemento descrito. Prints próprios evitam
problema de direito de imagem de bancos de screenshots.
