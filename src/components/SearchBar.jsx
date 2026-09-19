import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

function SearchBar() {
  const [termo, setTermo] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (termo.trim() === "") return;
    navigate(`/buscar/${encodeURIComponent(termo.trim())}`);
    setTermo("");
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <FiSearch className="search__icon" />
      <input
        type="text"
        placeholder="Buscar série..."
        value={termo}
        onChange={(event) => setTermo(event.target.value)}
      />
    </form>
  );
}

export default SearchBar;
