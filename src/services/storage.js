const KEY = "maratona:series";

export function getTrackedSeries() {
  const dados = localStorage.getItem(KEY);
  return dados ? JSON.parse(dados) : {};
}

function saveTrackedSeries(series) {
  localStorage.setItem(KEY, JSON.stringify(series));
}

export function episodeKey(temporada, episodio) {
  return `T${temporada}E${episodio}`;
}

// Guarda só o que a página "Minhas séries" precisa para funcionar sem chamar a API
export function trackSeries(serie) {
  const todas = getTrackedSeries();
  if (todas[serie.id]) return todas;

  todas[serie.id] = {
    id: serie.id,
    name: serie.name,
    poster_path: serie.poster_path,
    seasons: serie.seasons
      .filter((s) => s.season_number > 0 && s.episode_count > 0)
      .map((s) => ({ season_number: s.season_number, episode_count: s.episode_count })),
    watched: [],
  };
  saveTrackedSeries(todas);
  return todas;
}

export function untrackSeries(id) {
  const todas = getTrackedSeries();
  delete todas[id];
  saveTrackedSeries(todas);
  return todas;
}

export function toggleEpisode(id, chave) {
  const todas = getTrackedSeries();
  const serie = todas[id];
  if (!serie) return todas;

  serie.watched = serie.watched.includes(chave)
    ? serie.watched.filter((item) => item !== chave)
    : [...serie.watched, chave];
  saveTrackedSeries(todas);
  return todas;
}

export function setSeasonWatched(id, temporada, totalEpisodios, assistido) {
  const todas = getTrackedSeries();
  const serie = todas[id];
  if (!serie) return todas;

  const chaves = [];
  for (let ep = 1; ep <= totalEpisodios; ep++) {
    chaves.push(episodeKey(temporada, ep));
  }

  const semTemporada = serie.watched.filter((item) => !chaves.includes(item));
  serie.watched = assistido ? [...semTemporada, ...chaves] : semTemporada;
  saveTrackedSeries(todas);
  return todas;
}

export function getTotalEpisodes(serie) {
  return serie.seasons.reduce((total, s) => total + s.episode_count, 0);
}

export function getNextEpisode(serie) {
  for (const s of serie.seasons) {
    for (let ep = 1; ep <= s.episode_count; ep++) {
      if (!serie.watched.includes(episodeKey(s.season_number, ep))) {
        return { temporada: s.season_number, episodio: ep };
      }
    }
  }
  return null;
}
