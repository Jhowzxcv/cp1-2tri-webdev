import { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { getTrending, getPopular, getTopRated } from "../services/api";
import HeroBanner from "../components/HeroBanner";
import SeriesRow from "../components/SeriesRow";
import Loading from "../components/Loading";
import Message from "../components/Message";

function Home() {
  const [emAlta, setEmAlta] = useState([]);
  const [populares, setPopulares] = useState([]);
  const [maisAvaliadas, setMaisAvaliadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const [trending, popular, topRated] = await Promise.all([
          getTrending(),
          getPopular(),
          getTopRated(),
        ]);
        setEmAlta(trending.results);
        setPopulares(popular.results);
        setMaisAvaliadas(topRated.results);
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) return <Loading texto="Buscando séries em alta..." />;

  if (erro) {
    return (
      <Message
        icone={<FiAlertTriangle />}
        titulo="Algo deu errado"
        texto="Não conseguimos carregar as séries. Tente novamente em instantes."
      />
    );
  }

  const destaque = emAlta.find((serie) => serie.backdrop_path);

  return (
    <>
      {destaque && <HeroBanner serie={destaque} />}
      <div className="container">
        <SeriesRow titulo="Em alta" series={emAlta} />
        <SeriesRow titulo="Populares" series={populares} />
        <SeriesRow titulo="Mais bem avaliadas" series={maisAvaliadas} />
      </div>
    </>
  );
}

export default Home;
