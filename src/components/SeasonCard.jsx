import { Link } from "react-router-dom";
import { FiChevronRight, FiFilm } from "react-icons/fi";
import { IMG_URL } from "../services/api";
import ProgressBar from "./ProgressBar";

function SeasonCard({ serieId, temporada, assistidos, acompanhando, index }) {
  return (
    <Link
      to={`/serie/${serieId}/temporada/${temporada.season_number}`}
      className="season-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="season-card__poster">
        {temporada.poster_path ? (
          <img src={`${IMG_URL}w185${temporada.poster_path}`} alt={temporada.name} loading="lazy" />
        ) : (
          <FiFilm />
        )}
      </div>
      <div className="season-card__info">
        <h3>{temporada.name}</h3>
        <p>{temporada.episode_count} episódios</p>
        {acompanhando && <ProgressBar atual={assistidos} total={temporada.episode_count} />}
      </div>
      <FiChevronRight className="season-card__arrow" />
    </Link>
  );
}

export default SeasonCard;
