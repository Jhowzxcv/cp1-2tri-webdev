import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Cabecalho from '../../components/Cabecalho/Cabecalho.jsx'
import Rodape from '../../components/Rodape/Rodape.jsx'
import './LayoutPrincipal.css'

function LayoutPrincipal({ totalSeries }) {
  const location = useLocation()

  // Sem isso, ao navegar de uma lista longa para os detalhes a página abre no
  // meio, na mesma posição de rolagem da tela anterior.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="layout">
      <Cabecalho totalSeries={totalSeries} />
      <main className="layout__conteudo">
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}

export default LayoutPrincipal
