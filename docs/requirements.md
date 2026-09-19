# Requirements — Maratona

## 1. Visão do Produto

### Nome
Maratona

### Problema
Com o fim do TV Time em julho de 2026, milhões de pessoas perderam a ferramenta que usavam para saber em qual episódio pararam em cada série. Sem ela, fica difícil:
- lembrar o próximo episódio de cada série que se está assistindo;
- ver quanto falta para terminar uma temporada ou uma série;
- descobrir novas séries para começar a assistir.

### Público
Pessoas que assistem a várias séries ao mesmo tempo, em diferentes streamings, e querem um lugar único e simples para acompanhar o próprio progresso. Inclui ex-usuários do TV Time.

### Proposta de solução
Uma plataforma web responsiva que junta duas funções:
1. **Descobrir:** mostra séries em alta, populares e mais bem avaliadas, além de uma busca por nome.
2. **Acompanhar:** o usuário marca os episódios assistidos, vê o progresso por temporada e por série e sabe qual é o próximo episódio.

## 2. Objetivo do MVP

Ao final do projeto, o usuário deve conseguir encontrar uma série, começar a acompanhá-la, marcar episódios assistidos e ver na página "Minhas séries" o progresso e o próximo episódio de cada série. O progresso deve continuar salvo depois que a página for recarregada.

## 3. Funcionalidades

### F01 — Descobrir séries

**Descrição:** a página inicial mostra um destaque em tela cheia (a série mais em alta da semana) e três carrosséis horizontais: Em alta, Populares e Mais bem avaliadas. Os dados vêm da API do TMDB.

**User story:** como pessoa que não sabe o que assistir, quero ver séries em alta e bem avaliadas para escolher a próxima série.

**Critérios de aceitação:**
- [ ] O destaque mostra imagem de fundo, nome, nota, ano, sinopse e o botão "Ver série".
- [ ] Cada carrossel mostra cards com pôster, nome e nota.
- [ ] Clicar em um card leva para `/serie/:id`.
- [ ] Os cards aparecem com animação de slide, um após o outro.

**Estados:**
- [x] Inicial
- [x] Carregando (spinner com "Buscando séries em alta...")
- [x] Sucesso (destaque + carrosséis)
- [ ] Vazio (não se aplica: a API sempre retorna séries em alta)
- [x] Erro (mensagem "Algo deu errado")

### F02 — Buscar séries

**Descrição:** a barra de busca no header leva para `/buscar/:termo`, que mostra os resultados em grade.

**User story:** como usuário, quero buscar uma série pelo nome para encontrar rapidamente a série que já estou assistindo.

**Critérios de aceitação:**
- [ ] Buscar com o campo vazio não faz nada.
- [ ] A busca funciona em qualquer página, porque a barra fica no header.
- [ ] Os resultados aparecem em grade de cards.
- [ ] Mudar o termo na URL refaz a busca.

**Estados:**
- [x] Inicial
- [x] Carregando
- [x] Sucesso (grade de resultados)
- [x] Vazio ("Nenhuma série encontrada" + link para Descobrir)
- [x] Erro

### F03 — Detalhes da série

**Descrição:** a página `/serie/:id` mostra backdrop, pôster, nota, ano, número de temporadas, gêneros, sinopse, a lista de temporadas e séries recomendadas.

**User story:** como usuário, quero ver as informações de uma série e as temporadas dela para decidir se vou acompanhá-la.

**Critérios de aceitação:**
- [ ] A página mostra todas as temporadas, sem a temporada 0 (especiais).
- [ ] Cada temporada leva para `/serie/:id/temporada/:numero`.
- [ ] O botão "Acompanhar série" adiciona a série em "Minhas séries". Clicar de novo ("Acompanhando") remove.
- [ ] Se a série estiver sendo acompanhada, aparecem a barra de progresso geral e a barra de progresso de cada temporada.

**Estados:**
- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [ ] Vazio (não se aplica)
- [x] Erro ("Série não encontrada")

### F04 — Marcar episódios assistidos

**Descrição:** a página `/serie/:id/temporada/:numero` lista os episódios com imagem, número, nome, duração e sinopse. Cada episódio tem um botão de check.

**User story:** como usuário, quero marcar os episódios que já assisti para saber onde parei.

**Critérios de aceitação:**
- [ ] Clicar no check marca o episódio. Clicar de novo desmarca.
- [ ] Um episódio assistido fica com a imagem em tons de cinza e o check preenchido, com animação de "pop".
- [ ] O botão "Marcar temporada inteira" marca todos os episódios. Quando a temporada está completa, o botão muda para "Desmarcar temporada".
- [ ] Marcar um episódio de uma série ainda não acompanhada já adiciona a série em "Minhas séries".
- [ ] A barra de progresso da temporada é atualizada na hora.
- [ ] Os episódios marcados continuam salvos depois de recarregar a página (localStorage).

**Estados:**
- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio ("Esta temporada ainda não tem episódios cadastrados")
- [x] Erro

### F05 — Minhas séries

**Descrição:** a página `/minhas-series` lista as séries acompanhadas, com o progresso e o próximo episódio de cada uma.

**User story:** como usuário, quero ver todas as séries que acompanho e o próximo episódio de cada uma para continuar de onde parei.

**Critérios de aceitação:**
- [ ] Cada série mostra pôster, nome, barra de progresso (episódios assistidos / total).
- [ ] O botão "Próximo: T_ E_" leva para a temporada do próximo episódio não assistido.
- [ ] Quando todos os episódios foram assistidos, aparece o selo "Série concluída".
- [ ] O botão da lixeira remove a série da lista.
- [ ] A página funciona sem chamar a API, só com os dados do localStorage.

**Estados:**
- [x] Inicial
- [ ] Carregando (não se aplica: os dados são locais)
- [x] Sucesso
- [x] Vazio ("Você ainda não acompanha nenhuma série" + link para Descobrir)
- [ ] Erro (não se aplica)

## 4. Regras do Produto

- A temporada 0 (especiais) não entra na contagem de progresso.
- O progresso é calculado como episódios assistidos ÷ total de episódios das temporadas regulares.
- O próximo episódio é o primeiro episódio não assistido, seguindo a ordem de temporada e episódio.
- Os dados ficam salvos apenas no navegador do usuário (localStorage). Não existe login.
- Todo o conteúdo vem da API do TMDB em português (`language=pt-BR`).

## 5. Fora do Escopo

- Filmes (o MVP cobre apenas séries).
- Login, contas e sincronização entre dispositivos.
- Onde assistir (streamings), estatísticas pessoais e conquistas.
- Comentários, avaliações e comunidade.
- Notificações de novos episódios.
