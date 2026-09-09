# Cliffhanger — Requisitos

> Documento de especificação (fase *Specify* do Spec Driven Development).
> Escrito **antes** do código. Toda funcionalidade implementada deve rastrear
> até uma user story deste documento.

---

## 1. Contexto

O TV Time foi encerrado em **15 de julho de 2026**. Eram cerca de 25 milhões de
usuários registrados que perderam, de uma vez, histórico de episódios,
avaliações, watchlist e o recap anual *REWIND* — sem possibilidade de
recuperação.

O app não fazia uma coisa só. Fazia quatro:

| Camada | O que era |
|---|---|
| Tracker | marcar episódios assistidos, progresso por temporada |
| Social | fórum e comentários por episódio, votação de personagem favorito |
| Descoberta | recomendações, "onde assistir" |
| Retrospectiva | REWIND — o recap anual de estatísticas pessoais |

Depois do encerramento, o mercado se dividiu: **Trakt** e **Simkl** absorveram a
camada de automação (scrobbling via Plex, Kodi e extensão de navegador),
**Serializd** absorveu a camada social/estética (reviews e feed visual, no
modelo Letterboxd), **Moviebase** virou a opção estável no Android.

**A lacuna:** não existe substituto único, e a camada que ficou mais órfã na web
é a de **progresso pessoal + retrospectiva** — o "onde eu parei" somado às
estatísticas do REWIND. Trakt resolve isso para quem tem servidor de mídia;
Serializd é ótimo para quem quer escrever resenhas. Quem só quer saber *qual é o
próximo episódio* e *quanto já assistiu* ficou sem um lugar leve e web-first.

---

## 2. Problema

> Quem acompanha várias séries ao mesmo tempo perde o fio: não lembra em qual
> episódio parou, não sabe o que assistir hoje e não tem nenhuma noção do quanto
> já investiu nisso.

Do enunciado, o problema escolhido é **acompanhar séries e episódios**, com
**acompanhar estatísticas pessoais** como camada de apoio.

### Sintomas do problema

- Abrir o streaming e gastar minutos lembrando onde parou em cada série.
- Abandonar séries por perder o ritmo, não por falta de interesse.
- Não conseguir responder "quantas horas de série eu vi este ano?".
- Planilhas improvisadas no Notion/Excel para controlar episódios.

---

## 3. Objetivo do MVP

Entregar uma **plataforma web responsiva** que responda, em menos de 5 segundos
após abrir, a uma única pergunta: **"o que eu assisto agora?"** — e que, como
consequência do uso, produza estatísticas pessoais que o usuário não teria de
graça em outro lugar.

### Objetivos específicos

1. Permitir buscar uma série e adicioná-la à lista pessoal.
2. Marcar episódios como assistidos, individualmente ou por temporada inteira.
3. Calcular e exibir o **próximo episódio não assistido** de cada série.
4. Mostrar progresso percentual por série e por temporada.
5. Consolidar estatísticas pessoais (episódios, horas, gêneros, séries concluídas).

### Não-objetivos (fora de escopo do MVP)

Registrados explicitamente para evitar *scope creep* — o enunciado diz que **não
é necessário nem recomendado refazer toda a aplicação**.

- Autenticação, contas e servidor próprio (dados ficam no navegador).
- Camada social: comentários, fórum, seguir pessoas, feed.
- Filmes (o MVP é deliberadamente só séries).
- Motor de recomendação personalizado.
- "Onde assistir" / provedores de streaming.
- Importação de dados do TV Time.
- Notificações e lembretes.

---

## 4. Público-alvo

### Persona primária — "A maratonista dispersa"

Acompanha de 5 a 12 séries simultaneamente. Assiste em plataformas diferentes
(Netflix, Prime, Max, Crunchyroll) e em dispositivos diferentes. O atrito não é
achar o que assistir — é **lembrar onde parou**. Era usuária diária do TV Time e
hoje usa uma nota no celular.

- **Precisa de:** uma tela inicial que já diz o próximo episódio.
- **Não tolera:** ter que configurar servidor de mídia ou instalar extensão.

### Persona secundária — "O colecionador de números"

Gosta do lado quantificado do hábito. Sentia falta do REWIND antes mesmo do app
fechar. Compara-se com o próprio histórico, não com outras pessoas.

- **Precisa de:** total de horas, séries concluídas, gêneros dominantes.
- **Não tolera:** estatísticas vagas ou que não batem com o que ele marcou.

---

## 5. User stories e critérios de aceitação

Prioridade: **P0** = obrigatória no MVP · **P1** = desejável · **P2** = se sobrar tempo.

---

### US-01 — Buscar séries · P0

> **Como** pessoa que assiste séries,
> **quero** buscar uma série pelo nome,
> **para** encontrá-la e começar a acompanhar.

**Critérios de aceitação**

- [ ] Existe um campo de busca acessível a partir da página de busca.
- [ ] Ao enviar um termo com 1+ caractere, a aplicação consulta a API e lista os resultados.
- [ ] Cada resultado exibe pôster, nome, ano de estreia e nota média.
- [ ] Resultados sem pôster exibem uma imagem de fallback (nunca imagem quebrada).
- [ ] Durante a requisição, um estado de carregamento é exibido.
- [ ] Busca sem resultados exibe mensagem de estado vazio, não uma lista em branco.
- [ ] Falha de rede exibe mensagem de erro com opção de tentar novamente.
- [ ] Clicar em um resultado navega para os detalhes daquela série.

---

### US-02 — Ver detalhes de uma série · P0

> **Como** pessoa interessada em uma série,
> **quero** ver sinopse, temporadas e informações gerais,
> **para** decidir se vou acompanhá-la.

**Critérios de aceitação**

- [ ] A rota é dinâmica e identifica a série pelo seu id (`/serie/:id`).
- [ ] Exibe pôster, título, ano, gêneros, nota, status e sinopse.
- [ ] Lista todas as temporadas com número de episódios de cada uma.
- [ ] Temporada 0 (especiais) não é exibida.
- [ ] Exibe um botão para adicionar/remover a série da lista pessoal.
- [ ] Se a série já está na lista, exibe a barra de progresso e o próximo episódio.
- [ ] Acessar um id inexistente exibe estado de erro, não uma tela quebrada.
- [ ] Recarregar a página (F5) mantém a mesma série carregada.

---

### US-03 — Adicionar e remover séries da minha lista · P0

> **Como** usuária,
> **quero** manter uma lista das séries que acompanho,
> **para** ter um só lugar com tudo que estou assistindo.

**Critérios de aceitação**

- [ ] Adicionar uma série a insere na lista pessoal imediatamente.
- [ ] O botão reflete o estado atual ("Acompanhar" / "Seguindo").
- [ ] Remover uma série pede confirmação, pois apaga o progresso registrado.
- [ ] A lista persiste após fechar e reabrir o navegador.
- [ ] A mesma série não pode ser adicionada duas vezes.

---

### US-04 — Marcar episódios como assistidos · P0

> **Como** usuária,
> **quero** marcar quais episódios já vi,
> **para** que a aplicação saiba onde eu parei.

**Critérios de aceitação**

- [ ] A rota de temporada é dinâmica e aninhada (`/serie/:id/temporada/:numero`).
- [ ] Cada episódio da temporada exibe número, título, data de exibição e duração.
- [ ] Cada episódio tem um controle de marcar/desmarcar como assistido.
- [ ] A marcação é refletida na interface sem recarregar a página.
- [ ] Existe a ação "marcar temporada inteira" e "desmarcar temporada inteira".
- [ ] Episódios com data de exibição futura são exibidos como não lançados e não podem ser marcados.
- [ ] A marcação persiste após recarregar a página.

---

### US-05 — Saber qual é o próximo episódio · P0

> **Como** usuária com pouco tempo,
> **quero** ver na tela inicial o próximo episódio de cada série,
> **para** começar a assistir sem ter que lembrar de nada.

**Critérios de aceitação**

- [ ] A página inicial lista as séries em andamento, cada uma com seu próximo episódio.
- [ ] "Próximo episódio" = o primeiro episódio já lançado e ainda não assistido, na ordem temporada → episódio.
- [ ] O cartão exibe `T{temporada}E{episódio} — {título}`.
- [ ] Clicar no cartão leva à temporada correspondente.
- [ ] Séries com todos os episódios lançados já assistidos aparecem como "Em dia", separadas das em andamento.
- [ ] Se a lista pessoal estiver vazia, a página exibe um estado vazio com chamada para a busca.

---

### US-06 — Acompanhar meu progresso · P1

> **Como** usuária,
> **quero** ver o quanto já avancei em cada série,
> **para** ter noção do que falta.

**Critérios de aceitação**

- [ ] Cada série da lista exibe uma barra de progresso e o texto `X de Y episódios`.
- [ ] O denominador considera apenas episódios já lançados.
- [ ] A página de detalhes mostra o progresso por temporada, além do total.
- [ ] Séries 100% concluídas recebem indicação visual distinta.

---

### US-07 — Ver minhas estatísticas · P1

> **Como** colecionador de números,
> **quero** um painel com meus totais,
> **para** enxergar o hábito que o REWIND me mostrava.

**Critérios de aceitação**

- [ ] Página dedicada exibe: total de episódios assistidos, tempo total, séries acompanhadas e séries concluídas.
- [ ] O tempo total é exibido em formato legível (ex.: `4d 7h`), não em minutos crus.
- [ ] Exibe a distribuição por gênero das séries acompanhadas.
- [ ] Exibe a série com mais episódios assistidos.
- [ ] Sem dados, a página exibe estado vazio explicando como gerar estatísticas.
- [ ] Os números batem exatamente com o que foi marcado (verificável manualmente).

---

### US-08 — Filtrar minha lista · P2

> **Como** usuária com muitas séries,
> **quero** filtrar por situação,
> **para** achar rápido o que interessa agora.

**Critérios de aceitação**

- [ ] Filtros: `Todas` · `Em andamento` · `Em dia` · `Concluídas`.
- [ ] O filtro selecionado tem destaque visual.
- [ ] O filtro é estado de interação e não recarrega a página.
- [ ] Um filtro sem resultados exibe estado vazio próprio.

---

## 6. Estados da aplicação

Todo componente que consome dados assíncronos implementa os quatro primeiros
estados. **Nenhum deles pode ser a ausência de tela.**

| Estado | Quando ocorre | O que a interface mostra |
|---|---|---|
| **Carregando** | Requisição à API em andamento | Esqueleto de conteúdo (skeleton) com a forma do resultado esperado |
| **Sucesso** | Dados recebidos e não vazios | O conteúdo |
| **Vazio** | Requisição OK, mas sem resultados | Ícone + mensagem + ação sugerida |
| **Erro** | Falha de rede, 4xx ou 5xx | Mensagem em linguagem comum + botão "Tentar novamente" |
| **Sem chave de API** | Variável de ambiente ausente | Aviso explicando como configurar o `.env` |

### Estados por página

| Página | Carregando | Vazio | Erro |
|---|---|---|---|
| Início | Skeleton de cartões | "Você ainda não acompanha nenhuma série" → busca | Falha ao carregar dados das séries |
| Busca | Skeleton de grade | "Nenhuma série encontrada para *termo*" | Falha na busca |
| Detalhes da série | Skeleton de cabeçalho + temporadas | — | "Série não encontrada" |
| Temporada | Skeleton de lista | "Temporada sem episódios cadastrados" | Falha ao carregar temporada |
| Estatísticas | — (cálculo local, instantâneo) | "Marque episódios para ver suas estatísticas" | — |

---

## 7. Regras do produto

Regras de negócio que o código deve respeitar. Numeradas para serem citadas nos
testes manuais e no `architecture.md`.

**RP-01 — Ordem canônica.** Episódios são ordenados por temporada crescente e,
dentro dela, por número de episódio crescente. Toda lógica de "próximo" segue
essa ordem.

**RP-02 — Próximo episódio.** É o primeiro episódio na ordem canônica que
esteja **já lançado** e **não assistido**. Se não existir, a série está "Em dia".

**RP-03 — Episódio lançado.** Um episódio é considerado lançado se possui data
de exibição e essa data é anterior ou igual a hoje. Episódio sem data é tratado
como **não lançado**.

**RP-04 — Progresso.** `progresso = assistidos ÷ lançados`. Episódios não
lançados nunca entram no denominador — caso contrário uma série em exibição
jamais chegaria a 100%.

**RP-05 — Série concluída.** Uma série é concluída quando todos os episódios
lançados foram assistidos **e** seu status na API indica encerramento
(`Ended` ou `Canceled`). Séries em exibição totalmente em dia recebem o rótulo
"Em dia", não "Concluída".

**RP-06 — Marcação retroativa não é automática.** Marcar o episódio 5 **não**
marca os anteriores. O usuário pode ter assistido fora de ordem. Para isso
existe a ação explícita de marcar a temporada inteira.

**RP-07 — Especiais fora.** A temporada 0 (especiais) é ignorada em listagens,
progresso e estatísticas.

**RP-08 — Duração padrão.** Para calcular tempo assistido, usa-se a duração do
episódio informada pela API. Quando ausente, adota-se **45 minutos** como
padrão, e a página de estatísticas informa que o total é estimado.

**RP-09 — Remoção apaga progresso.** Remover uma série da lista apaga o
progresso dela. Por isso a ação exige confirmação.

**RP-10 — Dados são locais.** Todo o progresso vive no `localStorage` do
navegador. Não há sincronização entre dispositivos, e isso é comunicado ao
usuário na página de estatísticas.

**RP-11 — Idioma.** As requisições à API pedem conteúdo em `pt-BR`. Quando a
sinopse não existir em português, exibe-se o texto original disponível.

---

## 8. Fonte de dados

**TMDB — The Movie Database** (<https://developer.themoviedb.org/docs/getting-started>).

Escolhida por: catálogo completo de séries com detalhamento por temporada e
episódio (necessário para RP-01 a RP-04), suporte a `pt-BR`, imagens hospedadas
e uso gratuito para projetos não comerciais.

A chave de API é lida de variável de ambiente e **não é versionada** no
repositório.

---

## 9. Métricas de sucesso do MVP

| Métrica | Meta |
|---|---|
| Tempo até saber o próximo episódio | ≤ 5 s a partir de abrir a página inicial |
| Cliques para marcar um episódio | ≤ 3 a partir da página inicial |
| Estados tratados | 100% das telas com dados assíncronos |
| Responsividade | Funcional de 320 px a 1440 px sem rolagem horizontal |
| Persistência | Progresso sobrevive a recarregar e fechar o navegador |

---

## 10. Rastreabilidade

Cada user story é implementada por componentes e rotas definidos em
[`architecture.md`](./architecture.md). Referências de interface que motivaram
decisões de design estão em [`references/references.md`](./references/references.md).
