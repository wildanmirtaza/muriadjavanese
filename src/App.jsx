import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UndanganPages from "./pages/undanganPages";
import DashboardAdmin from "./pages/dashboardAdmin";
import NotFound from "./pages/notFound";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Halaman Utama</div>} />
        <Route path="/:slug" element={<UndanganPages />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
