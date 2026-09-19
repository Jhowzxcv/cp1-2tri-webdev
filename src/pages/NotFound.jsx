import { FiFilm } from "react-icons/fi";
import Message from "../components/Message";

function NotFound() {
  return (
    <Message
      icone={<FiFilm />}
      titulo="Página não encontrada"
      texto="Essa cena foi cortada da edição final."
      link="/"
      textoLink="Voltar para o início"
    />
  );
}

export default NotFound;
