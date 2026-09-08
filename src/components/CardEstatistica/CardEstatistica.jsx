import './CardEstatistica.css'

// Bloco numérico grande: o valor é lido antes do rótulo.
function CardEstatistica({ icone, valor, rotulo, detalhe, destaque = false }) {
  return (
    <div className="card-estatistica">
      <span className={destaque ? 'card-estatistica__icone card-estatistica__icone--sucesso' : 'card-estatistica__icone'}>
        {icone}
      </span>
      <span className="card-estatistica__valor">{valor}</span>
      <span className="card-estatistica__rotulo">
        {rotulo}
        {detalhe && <span className="card-estatistica__detalhe"> · {detalhe}</span>}
      </span>
    </div>
  )
}

export default CardEstatistica
