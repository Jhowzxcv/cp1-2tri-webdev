import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";
import { searchSeries } from "../services/api";
import SeriesCard from "../components/SeriesCard";
import Loading from "../components/Loading";
import Message from "../components/Message";

function Search() {
  const { termo } = useParams();
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function buscar() {
      setCarregando(true);
      setErro(false);
      try {
        const dados = await searchSeries(termo);
        setResultados(dados.results);
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    buscar();
  }, [termo]);

  if (carregando) return <Loading texto={`Buscando "${termo}"...`} />;

  if (erro) {
    return (
      <Message
        icone={<FiAlertTriangle />}
        titulo="Erro na busca"
        texto="Não foi possível buscar agora. Tente novamente."
      />
    );
  }

  if (resultados.length === 0) {
    return (
      <Message
        icone={<FiSearch />}
        titulo="Nenhuma série encontrada"
        texto={`Não encontramos resultados para "${termo}".`}
        link="/"
        textoLink="Voltar para Descobrir"
      />
    );
  }

  return (
    <div className="container container--top">
      <h1 className="page-title">
        Resultados para <span className="accent">"{termo}"</span>
      </h1>
      <div className="grid">
        {resultados.map((serie, index) => (
          <SeriesCard key={serie.id} serie={serie} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Search;
