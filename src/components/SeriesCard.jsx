import { Link } from "react-router-dom";
import { FiStar, FiFilm } from "react-icons/fi";
import { IMG_URL } from "../services/api";

function SeriesCard({ serie, index = 0 }) {
  return (
    <Link
      to={`/serie/${serie.id}`}
      className="card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="card__poster">
        {serie.poster_path ? (
          <img src={`${IMG_URL}w342${serie.poster_path}`} alt={serie.name} loading="lazy" />
        ) : (
          <div className="card__placeholder">
            <FiFilm />
          </div>
        )}
        {serie.vote_average > 0 && (
          <span className="card__rating">
            <FiStar /> {serie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
      <p className="card__title">{serie.name}</p>
    </Link>
  );
}

export default SeriesCard;
