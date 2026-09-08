import './EstadoVazio.css'

// Nunca uma lista em branco: ícone, o que aconteceu e qual é o próximo passo.
function EstadoVazio({ icone, titulo, descricao, acao }) {
  return (
    <div className="estado-vazio">
      {icone && <span className="estado-vazio__icone">{icone}</span>}
      <h2 className="estado-vazio__titulo">{titulo}</h2>
      {descricao && <p className="estado-vazio__descricao">{descricao}</p>}
      {acao && <div className="estado-vazio__acao">{acao}</div>}
    </div>
  )
}

export default EstadoVazio
