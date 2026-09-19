import { Link } from "react-router-dom";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { IMG_URL } from "../services/api";

function HeroBanner({ serie }) {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${IMG_URL}original${serie.backdrop_path})` }}
    >
      <div className="hero__overlay" />
      <div className="hero__content">
        <span className="tag">Em alta na semana</span>
        <h1 className="hero__title">{serie.name}</h1>
        <p className="hero__meta">
          <FiStar /> {serie.vote_average.toFixed(1)}
          {serie.first_air_date && <span>· {serie.first_air_date.slice(0, 4)}</span>}
        </p>
        <p className="hero__overview">{serie.overview}</p>
        <Link to={`/serie/${serie.id}`} className="btn btn--primary">
          Ver série <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default HeroBanner;
