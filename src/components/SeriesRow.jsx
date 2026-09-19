import SeriesCard from "./SeriesCard";

function SeriesRow({ titulo, series }) {
  return (
    <section className="row">
      <h2 className="section-title">{titulo}</h2>
      <div className="row__list">
        {series.map((serie, index) => (
          <SeriesCard key={serie.id} serie={serie} index={index} />
        ))}
      </div>
    </section>
  );
}

export default SeriesRow;
