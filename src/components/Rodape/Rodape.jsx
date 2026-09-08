import './Rodape.css'

function Rodape() {
  return (
    <footer className="rodape">
      <p>
        Dados de séries e imagens fornecidos por{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          TMDB
        </a>
        . Este produto não é endossado nem certificado pelo TMDB.
      </p>
      <p className="rodape__nota">Seu progresso fica salvo apenas neste navegador.</p>
    </footer>
  )
}

export default Rodape
