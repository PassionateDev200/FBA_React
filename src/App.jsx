import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import BoxManagement from './pages/BoxManagement';
import ExportPage from './pages/ExportPage';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />

        <main className="flex-grow-1 container my-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage-boxes" element={<BoxManagement />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
