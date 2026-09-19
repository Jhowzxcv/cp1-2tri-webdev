function Loading({ texto = "Carregando..." }) {
  return (
    <div className="status">
      <div className="spinner" />
      <p>{texto}</p>
    </div>
  );
}

export default Loading;
