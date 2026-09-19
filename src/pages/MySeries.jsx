import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTv, FiPlay, FiAward, FiTrash2 } from "react-icons/fi";
import {
  getTrackedSeries,
  untrackSeries,
  getTotalEpisodes,
  getNextEpisode,
} from "../services/storage";
import { IMG_URL } from "../services/api";
import ProgressBar from "../components/ProgressBar";
import Message from "../components/Message";

function MySeries() {
  const [acompanhadas, setAcompanhadas] = useState(getTrackedSeries());
  const lista = Object.values(acompanhadas);

  if (lista.length === 0) {
    return (
      <Message
        icone={<FiTv />}
        titulo="Você ainda não acompanha nenhuma série"
        texto="Encontre uma série e clique em Acompanhar para ver seu progresso aqui."
        link="/"
        textoLink="Descobrir séries"
      />
    );
  }

  return (
    <div className="container container--top">
      <h1 className="page-title">Minhas séries</h1>

      <div className="tracked-list">
        {lista.map((serie, index) => {
          const proximo = getNextEpisode(serie);
          return (
            <article
              key={serie.id}
              className="tracked"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Link to={`/serie/${serie.id}`} className="tracked__poster">
                {serie.poster_path ? (
                  <img src={`${IMG_URL}w185${serie.poster_path}`} alt={serie.name} />
                ) : (
                  <FiTv />
                )}
              </Link>

              <div className="tracked__info">
                <Link to={`/serie/${serie.id}`}>
                  <h2>{serie.name}</h2>
                </Link>
                <ProgressBar atual={serie.watched.length} total={getTotalEpisodes(serie)} />

                {proximo ? (
                  <Link
                    to={`/serie/${serie.id}/temporada/${proximo.temporada}`}
                    className="btn btn--primary btn--small"
                  >
                    <FiPlay /> Próximo: T{proximo.temporada} E{proximo.episodio}
                  </Link>
                ) : (
                  <span className="tag tag--done">
                    <FiAward /> Série concluída
                  </span>
                )}
              </div>

              <button
                className="icon-btn"
                onClick={() => setAcompanhadas(untrackSeries(serie.id))}
                aria-label="Parar de acompanhar"
              >
                <FiTrash2 />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default MySeries;
