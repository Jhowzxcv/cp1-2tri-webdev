function ProgressBar({ atual, total }) {
  const porcentagem = total > 0 ? Math.round((atual / total) * 100) : 0;

  return (
    <div className="progress">
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${porcentagem}%` }} />
      </div>
      <span className="progress__label">
        {atual}/{total} · {porcentagem}%
      </span>
    </div>
  );
}

export default ProgressBar;
