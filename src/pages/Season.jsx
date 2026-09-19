import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { getSeries, getSeason } from "../services/api";
import {
  getTrackedSeries,
  trackSeries,
  toggleEpisode,
  setSeasonWatched,
  episodeKey,
} from "../services/storage";
import EpisodeItem from "../components/EpisodeItem";
import ProgressBar from "../components/ProgressBar";
import Loading from "../components/Loading";
import Message from "../components/Message";

function Season() {
  const { id, numero } = useParams();
  const [serie, setSerie] = useState(null);
  const [temporada, setTemporada] = useState(null);
  const [acompanhadas, setAcompanhadas] = useState(getTrackedSeries());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(false);
      try {
        const [dadosSerie, dadosTemporada] = await Promise.all([
          getSeries(id),
          getSeason(id, numero),
        ]);
        setSerie(dadosSerie);
        setTemporada(dadosTemporada);
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id, numero]);

  if (carregando) return <Loading texto="Carregando episódios..." />;

  if (erro || !temporada) {
    return (
      <Message
        icone={<FiAlertTriangle />}
        titulo="Temporada não encontrada"
        texto="Não conseguimos carregar os episódios."
        link={`/serie/${id}`}
        textoLink="Voltar para a série"
      />
    );
  }

  const assistidos = acompanhadas[serie.id]?.watched ?? [];
  const episodios = temporada.episodes;
  const totalAssistidos = episodios.filter((ep) =>
    assistidos.includes(episodeKey(numero, ep.episode_number))
  ).length;
  const temporadaCompleta = episodios.length > 0 && totalAssistidos === episodios.length;

  // Marcar um episódio já coloca a série em "Minhas séries"
  function handleToggle(episodio) {
    trackSeries(serie);
    setAcompanhadas(toggleEpisode(serie.id, episodeKey(numero, episodio)));
  }

  function handleMarcarTodos() {
    trackSeries(serie);
    setAcompanhadas(setSeasonWatched(serie.id, numero, episodios.length, !temporadaCompleta));
  }

  return (
    <div className="container container--top">
      <Link to={`/serie/${serie.id}`} className="back-link">
        <FiArrowLeft /> {serie.name}
      </Link>

      <div className="season-header">
        <div>
          <h1 className="page-title">{temporada.name}</h1>
          <ProgressBar atual={totalAssistidos} total={episodios.length} />
        </div>
        {episodios.length > 0 && (
          <button
            className={temporadaCompleta ? "btn btn--ghost" : "btn btn--primary"}
            onClick={handleMarcarTodos}
          >
            <FiCheckCircle />
            {temporadaCompleta ? "Desmarcar temporada" : "Marcar temporada inteira"}
          </button>
        )}
      </div>

      {episodios.length === 0 ? (
        <Message titulo="Sem episódios" texto="Esta temporada ainda não tem episódios cadastrados." />
      ) : (
        <ul className="episode-list">
          {episodios.map((episodio, index) => (
            <EpisodeItem
              key={episodio.id}
              episodio={episodio}
              index={index}
              assistido={assistidos.includes(episodeKey(numero, episodio.episode_number))}
              onToggle={() => handleToggle(episodio.episode_number)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Season;
