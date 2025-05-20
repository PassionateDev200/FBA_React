import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Header0 from "./components/Header0";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Home0 from "./pages/Home0";
import ProductDetail from "./pages/ProductDetail";
import ProductDetail0 from "./pages/ProductDetail0";
import ExportPage from "./pages/ExportPage";
import ExportPage0 from "./pages/ExportPage0";
import BoxSummary from "./pages/BoxSummary";
import BoxSummary0 from "./pages/BoxSummary0";
import ShipmentsPage from "./pages/ShipmentsPage";
import ImportSummary from "./pages/ImportSummary";
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
            {/* <Header /> */}
            <Header0 />
            <main className="flex-grow-1 container my-4">
              <Routes>
                <Route path="/" element={<Home0 />} />
                <Route path="/test" element={<Home />} />
                <Route path="/products" element={<ProductDetail />} />
                <Route path="/products0" element={<ProductDetail0 />} />
                <Route path="/export" element={<ExportPage />} />
                <Route path="/export0" element={<ExportPage0 />} />
                <Route path="/boxsummary" element={<BoxSummary />} />
                <Route path="/boxsummary0" element={<BoxSummary0 />} />
                <Route path="/shipments" element={<ShipmentsPage />} />
                <Route path="/importSummary" element={<ImportSummary />} />
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
