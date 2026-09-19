import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import SeriesDetails from "./pages/SeriesDetails";
import Season from "./pages/Season";
import MySeries from "./pages/MySeries";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="buscar/:termo" element={<Search />} />
        <Route path="serie/:id" element={<SeriesDetails />} />
        <Route path="serie/:id/temporada/:numero" element={<Season />} />
        <Route path="minhas-series" element={<MySeries />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
