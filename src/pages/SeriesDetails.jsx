import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiStar, FiPlus, FiCheck, FiAlertTriangle, FiCalendar, FiTv } from "react-icons/fi";
import { getSeries, getRecommendations, IMG_URL } from "../services/api";
import {
  getTrackedSeries,
  trackSeries,
  untrackSeries,
  getTotalEpisodes,
} from "../services/storage";
import SeasonCard from "../components/SeasonCard";
import SeriesRow from "../components/SeriesRow";
import ProgressBar from "../components/ProgressBar";
import Loading from "../components/Loading";
import Message from "../components/Message";

function SeriesDetails() {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [recomendadas, setRecomendadas] = useState([]);
  const [acompanhadas, setAcompanhadas] = useState(getTrackedSeries());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(false);
      try {
        const [dados, recomendacoes] = await Promise.all([
          getSeries(id),
          getRecommendations(id),
        ]);
        setSerie(dados);
        setRecomendadas(recomendacoes.results);
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  if (carregando) return <Loading />;

  if (erro || !serie) {
    return (
      <Message
        icone={<FiAlertTriangle />}
        titulo="Série não encontrada"
        texto="Não conseguimos carregar esta série."
        link="/"
        textoLink="Voltar para Descobrir"
      />
    );
  }

  const acompanhada = acompanhadas[serie.id];
  const temporadas = serie.seasons.filter((s) => s.season_number > 0 && s.episode_count > 0);

  function handleAcompanhar() {
    if (acompanhada) {
      setAcompanhadas(untrackSeries(serie.id));
    } else {
      setAcompanhadas(trackSeries(serie));
    }
  }

  function assistidosNaTemporada(numero) {
    if (!acompanhada) return 0;
    return acompanhada.watched.filter((chave) => chave.startsWith(`T${numero}E`)).length;
  }

  return (
    <>
      <section
        className="details-hero"
        style={{
          backgroundImage: serie.backdrop_path
            ? `url(${IMG_URL}original${serie.backdrop_path})`
            : "none",
        }}
      >
        <div className="hero__overlay" />
        <div className="details-hero__content container">
          {serie.poster_path && (
            <img
              className="details-hero__poster"
              src={`${IMG_URL}w342${serie.poster_path}`}
              alt={serie.name}
            />
          )}
          <div className="details-hero__info">
            <h1 className="hero__title">{serie.name}</h1>
            <div className="chips">
              <span className="chip">
                <FiStar /> {serie.vote_average.toFixed(1)}
              </span>
              {serie.first_air_date && (
                <span className="chip">
                  <FiCalendar /> {serie.first_air_date.slice(0, 4)}
                </span>
              )}
              <span className="chip">
                <FiTv /> {serie.number_of_seasons} temporada(s)
              </span>
              {serie.genres.map((genero) => (
                <span key={genero.id} className="chip chip--muted">
                  {genero.name}
                </span>
              ))}
            </div>
            <p className="hero__overview">{serie.overview || "Sinopse não disponível."}</p>

            <button
              className={acompanhada ? "btn btn--ghost" : "btn btn--primary"}
              onClick={handleAcompanhar}
            >
              {acompanhada ? (
                <>
                  <FiCheck /> Acompanhando
                </>
              ) : (
                <>
                  <FiPlus /> Acompanhar série
                </>
              )}
            </button>

            {acompanhada && (
              <div className="details-hero__progress">
                <ProgressBar
                  atual={acompanhada.watched.length}
                  total={getTotalEpisodes(acompanhada)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        <section className="row">
          <h2 className="section-title">Temporadas</h2>
          <div className="season-list">
            {temporadas.map((temporada, index) => (
              <SeasonCard
                key={temporada.id}
                serieId={serie.id}
                temporada={temporada}
                assistidos={assistidosNaTemporada(temporada.season_number)}
                acompanhando={Boolean(acompanhada)}
                index={index}
              />
            ))}
          </div>
        </section>

        {recomendadas.length > 0 && (
          <SeriesRow titulo="Você também pode gostar" series={recomendadas} />
        )}
      </div>
    </>
  );
}

export default SeriesDetails;
