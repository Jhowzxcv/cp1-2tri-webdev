import './FiltroSituacao.css'

const OPCOES = [
  { valor: 'andamento', rotulo: 'Em andamento' },
  { valor: 'emDia', rotulo: 'Em dia' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
  { valor: 'todas', rotulo: 'Todas' },
]

function FiltroSituacao({ valor, aoMudar, contagens }) {
  return (
    <div className="filtro-situacao">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className={
            valor === opcao.valor ? 'filtro-situacao__item filtro-situacao__item--ativo' : 'filtro-situacao__item'
          }
          onClick={() => aoMudar(opcao.valor)}
          aria-pressed={valor === opcao.valor}
        >
          {opcao.rotulo}
          {contagens && <span className="filtro-situacao__numero">{contagens[opcao.valor]}</span>}
        </button>
      ))}
    </div>
  )
}

export default FiltroSituacao
