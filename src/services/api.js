const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG_URL = "https://image.tmdb.org/t/p/";

async function request(path) {
  const separador = path.includes("?") ? "&" : "?";
  const response = await fetch(
    `${BASE_URL}${path}${separador}api_key=${API_KEY}&language=pt-BR`
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dados.");
  }

  return response.json();
}

export function getTrending() {
  return request("/trending/tv/week");
}

export function getPopular() {
  return request("/tv/popular");
}

export function getTopRated() {
  return request("/tv/top_rated");
}

export function searchSeries(termo) {
  return request(`/search/tv?query=${encodeURIComponent(termo)}`);
}

export function getSeries(id) {
  return request(`/tv/${id}`);
}

export function getSeason(id, numero) {
  return request(`/tv/${id}/season/${numero}`);
}

export function getRecommendations(id) {
  return request(`/tv/${id}/recommendations`);
}
