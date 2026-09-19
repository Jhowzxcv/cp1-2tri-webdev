# References — Maratona

## 1. Objetivo

As referências abaixo orientam as decisões de experiência e interface.

## 2. Referência 01 — Netflix

### Fonte
https://www.netflix.com (página inicial logada)

### Imagem

![Referência 01](./imagens/referencia-01.png)

### O que observamos?
Um banner em tela cheia com a imagem do título em destaque, seguido de carrosséis horizontais por categoria.

### O que vamos aproveitar?
O banner de destaque com degradê escuro sobre a imagem e os carrosséis horizontais de pôsteres.

### Como será adaptado?
O `HeroBanner` da Home mostra a série mais em alta da semana, com nota, ano e o botão "Ver série". O componente `SeriesRow` monta os carrosséis "Em alta", "Populares" e "Mais bem avaliadas". A página de detalhes reaproveita o mesmo estilo de backdrop.

## 3. Referência 02 — TV Time

### Fonte
App TV Time (encerrado em julho de 2026). Capturas de tela da lista de episódios e da aba "Watchlist".

### Imagem

![Referência 02](./imagens/referencia-02.png)

### O que observamos?
Cada episódio tem um botão de check grande para marcar como assistido. A watchlist mostra o próximo episódio de cada série.

### O que vamos aproveitar?
O check por episódio, o "marcar temporada inteira" e o atalho para o próximo episódio.

### Como será adaptado?
O `EpisodeItem` tem um botão circular que fica preenchido com a cor de destaque (e anima com um "pop") quando o episódio é marcado. A página "Minhas séries" mostra "Próximo: T_ E_" com um link direto para a temporada.

## 4. Referência 03 — Letterboxd

### Fonte
https://letterboxd.com

### Imagem

![Referência 03](./imagens/referencia-03.png)

### O que observamos?
Interface escura e minimalista, com os pôsteres como o principal elemento visual e pouca decoração em volta.

### O que vamos aproveitar?
O fundo escuro neutro, uma única cor de destaque e as grades de pôsteres limpas.

### Como será adaptado?
A paleta usa fundo `#0b0b0f` e um dourado (`#e8b04b`) como única cor de destaque, que lembra a iluminação de cinema. A busca mostra os resultados em grade de pôsteres. Os títulos usam a fonte Bebas Neue (estilo letreiro de cinema) e o corpo usa Inter.
