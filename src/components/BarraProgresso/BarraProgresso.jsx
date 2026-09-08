import './BarraProgresso.css'

// O total recebido já vem contando só os episódios lançados (RP-04).
function BarraProgresso({ assistidos, total, compacta = false, concluida = false }) {
  const percentual = total === 0 ? 0 : Math.round((assistidos / total) * 100)

  return (
    <div className="barra-progresso">
      <div
        className="barra-progresso__trilho"
        role="progressbar"
        aria-valuenow={assistidos}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${assistidos} de ${total} episódios assistidos`}
      >
        <div
          className={
            concluida
              ? 'barra-progresso__preenchimento barra-progresso__preenchimento--concluida'
              : 'barra-progresso__preenchimento'
          }
          style={{ width: `${percentual}%` }}
        />
      </div>
      {!compacta && (
        <span className="barra-progresso__texto">
          {assistidos} de {total}
        </span>
      )}
    </div>
  )
}

export default BarraProgresso
