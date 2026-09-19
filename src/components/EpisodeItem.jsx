import { FiCheck, FiClock, FiImage } from "react-icons/fi";
import { IMG_URL } from "../services/api";

function EpisodeItem({ episodio, assistido, onToggle, index }) {
  return (
    <li
      className={assistido ? "episode episode--watched" : "episode"}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="episode__still">
        {episodio.still_path ? (
          <img src={`${IMG_URL}w300${episodio.still_path}`} alt={episodio.name} loading="lazy" />
        ) : (
          <FiImage />
        )}
      </div>

      <div className="episode__info">
        <span className="episode__number">Episódio {episodio.episode_number}</span>
        <h3>{episodio.name}</h3>
        <p className="episode__meta">
          {episodio.runtime && (
            <>
              <FiClock /> {episodio.runtime} min
            </>
          )}
        </p>
        {episodio.overview && <p className="episode__overview">{episodio.overview}</p>}
      </div>

      <button
        className={assistido ? "check check--active" : "check"}
        onClick={onToggle}
        aria-label={assistido ? "Desmarcar episódio" : "Marcar como assistido"}
      >
        <FiCheck />
      </button>
    </li>
  );
}

export default EpisodeItem;
