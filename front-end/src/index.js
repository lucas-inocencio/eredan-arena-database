import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";

import EACards from "./pages/EACards";
import EAEquips from "./pages/EAEquips";
import EASkills from "./pages/EASkills";

import "./styles.css";
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EACards />} />
          <Route path="cards" element={<EACards />} />
          <Route path="equips" element={<EAEquips />} />
          <Route path="skills" element={<EASkills />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);