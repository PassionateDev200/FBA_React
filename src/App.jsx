import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import BoxManagement from "./pages/BoxManagement";
import ExportPage from "./pages/ExportPage";
import BoxSummary from "./pages/BoxSummary";
import { ToastContainer } from "react-toastify";
import { BoxProvider } from "./context/BoxContent";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
const App = () => {
  return (
    <Router>
      <ToastContainer />
      <BoxProvider>
        <div className="app-background">
          <div className="app-overlay" />
          <div className="app-content">
            <Header />
            <main className="flex-grow-1 container my-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<BoxManagement />} />
                <Route path="/export" element={<ExportPage />} />
                <Route path="/boxsummary" element={<BoxSummary />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </BoxProvider>
    </Router>
  );
};

export default App;
