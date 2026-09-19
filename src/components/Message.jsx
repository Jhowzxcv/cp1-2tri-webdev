import { Link } from "react-router-dom";

// Usado para os estados de vazio e de erro
function Message({ icone, titulo, texto, link, textoLink }) {
  return (
    <div className="status">
      <div className="status__icon">{icone}</div>
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
      {link && (
        <Link to={link} className="btn btn--ghost">
          {textoLink}
        </Link>
      )}
    </div>
  );
}

export default Message;
