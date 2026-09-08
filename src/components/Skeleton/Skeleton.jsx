import './Skeleton.css'

// Esqueleto com a forma do conteúdo esperado. Evita o salto de layout que um
// spinner central provoca quando os dados chegam.
function Skeleton({ variante, quantidade = 1 }) {
  const itens = []
  for (let i = 0; i < quantidade; i += 1) {
    itens.push(i)
  }

  if (variante === 'poster') {
    return (
      <div className="grade-posteres">
        {itens.map((item) => (
          <div key={item} className="skeleton-poster">
            <div className="skeleton skeleton-poster__imagem" />
            <div className="skeleton skeleton-poster__titulo" />
            <div className="skeleton skeleton-poster__meta" />
          </div>
        ))}
      </div>
    )
  }

  if (variante === 'cartao') {
    return (
      <div className="grade-cartoes">
        {itens.map((item) => (
          <div key={item} className="skeleton-cartao">
            <div className="skeleton skeleton-cartao__poster" />
            <div className="skeleton-cartao__texto">
              <div className="skeleton skeleton-linha skeleton-linha--titulo" />
              <div className="skeleton skeleton-linha skeleton-linha--media" />
              <div className="skeleton skeleton-linha skeleton-linha--barra" />
              <div className="skeleton skeleton-linha skeleton-linha--curta" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variante === 'cabecalho') {
    return (
      <div className="skeleton-cabecalho">
        <div className="skeleton skeleton-cabecalho__poster" />
        <div className="skeleton-cabecalho__texto">
          <div className="skeleton skeleton-linha skeleton-linha--grande" />
          <div className="skeleton skeleton-linha skeleton-linha--media" />
          <div className="skeleton skeleton-linha" />
          <div className="skeleton skeleton-linha" />
          <div className="skeleton skeleton-linha skeleton-linha--curta" />
        </div>
      </div>
    )
  }

  return (
    <div className="skeleton-lista">
      {itens.map((item) => (
        <div key={item} className="skeleton skeleton-lista__item" />
      ))}
    </div>
  )
}

export default Skeleton
