# Maratona

Plataforma web para descobrir séries e acompanhar os episódios assistidos. Nasceu do vazio deixado pelo fim do TV Time.

- **Site publicado:** <https://maratona-series.vercel.app>
- **Repositório:** <https://github.com/Jhowzxcv/cp1-2tri-webdev>

## Integrantes

| Nome | RM |
|---|---|
| Jhonathan Dourado | 569568 |
| João Matheus Feliciano de Bueno | 569850 |

## Problema

Com o fim do TV Time em julho de 2026, quem assiste a várias séries ao mesmo tempo perdeu o lugar onde registrava em qual episódio parou, quanto faltava para terminar cada série e onde descobria novas séries.

## Solução

O Maratona junta duas funções:
- **Descobrir:** séries em alta, populares, mais bem avaliadas e busca por nome.
- **Acompanhar:** marcar episódios assistidos, ver o progresso por temporada e por série, e ver o próximo episódio de cada série em "Minhas séries".

## Funcionalidades

- Home com destaque da semana e carrosséis de séries
- Busca por nome (`/buscar/:termo`)
- Página de detalhes da série com temporadas e recomendações
- Lista de episódios com check para marcar como assistido e opção de marcar a temporada inteira
- Página "Minhas séries" com progresso, próximo episódio e selo de série concluída
- Progresso salvo no navegador (localStorage)
- Estados de carregando, vazio e erro
- Animações de fade, slide, zoom e pop feitas com CSS
- Layout responsivo

## Tecnologias

- React + Vite
- React Router DOM (layout com Outlet, rotas dinâmicas)
- React Icons (Feather Icons)
- CSS puro com animações em `@keyframes`

## API utilizada

[The Movie Database (TMDB)](https://developer.themoviedb.org/docs/getting-started): endpoints de trending, popular, top rated, search, detalhes da série, temporada e recomendações.

## Documentação (Spec Driven Development)

- [docs/requirements.md](docs/requirements.md): visão, user stories, critérios de aceitação, estados e regras
- [docs/architecture.md](docs/architecture.md): páginas, rotas, componentes, props, estados e efeitos
- [docs/references/references.md](docs/references/references.md): referências visuais

## Uso de IA

Usamos IA (Claude) como apoio, seguindo o Spec Driven Development:
- As decisões de produto foram do grupo: o problema escolhido (acompanhar séries + descobrir o que assistir), o nome, o estilo visual (cinema escuro e minimalista, com animações) e salvar o progresso no localStorage.
- Com essas decisões, a IA ajudou a escrever as specs em `docs/` e a gerar o código a partir delas.
- O grupo revisou o código e as specs e é responsável por explicar cada parte.

## Como executar

1. Crie uma conta no [TMDB](https://www.themoviedb.org/) e copie a **Chave da API (API Key)** (Configurações → API).
2. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/Jhowzxcv/cp1-2tri-webdev.git
   cd cp1-2tri-webdev
   npm install
   ```
3. Copie `.env.example` para `.env` e cole a sua API Key:
   ```
   VITE_TMDB_API_KEY=sua_api_key_aqui
   ```
4. Rode o projeto:
   ```bash
   npm run dev
   ```

### Deploy na Vercel

Importe o repositório na Vercel e adicione a variável de ambiente `VITE_TMDB_API_KEY` em Settings → Environment Variables. O arquivo `vercel.json` já redireciona todas as rotas para o `index.html`, para que o React Router funcione ao recarregar a página.
