import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CloudUploadFill,
  Grid3x3GapFill,
  BoxSeamFill,
  FileEarmarkArrowDownFill,
  Amazon,
} from "react-bootstrap-icons";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top ${
        scrolled ? "navbar-scrolled shadow-sm" : ""
      }`}
      style={{
        background: "linear-gradient(135deg, #1e2a4a 0%, #2d3a5f 100%)",
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-icon me-2">
            <div className="cube-wrapper">
              <div className="cube">
                <div className="cube-face front">
                  <Amazon size={20} color="white" />
                </div>
                <div className="cube-face back">
                  <BoxSeamFill size={20} color="white" />
                </div>
                <div className="cube-face top">
                  <BoxSeamFill size={20} color="white" />
                </div>
                <div className="cube-face bottom">
                  <BoxSeamFill size={20} color="white" />
                </div>
              </div>
            </div>
          </div>
          <span className="fw-bold text-white">FBA Tool</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ border: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                to="/"
              >
                <CloudUploadFill className="nav-icon" /> Upload
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/products") ? "active" : ""}`}
                to="/products"
              >
                <Grid3x3GapFill className="nav-icon" /> Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  isActive("/boxsummary") ? "active" : ""
                }`}
                to="/boxsummary"
              >
                <BoxSeamFill className="nav-icon" /> Boxes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/export") ? "active" : ""}`}
                to="/export"
              >
                <FileEarmarkArrowDownFill className="nav-icon" /> Export
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Add CSS styles */}
      <style>
        {`
          .navbar {
            padding: 15px 0;
            transition: all 0.3s ease;
          }
          
          .navbar-scrolled {
            padding: 8px 0;
            background: linear-gradient(135deg, #172042 0%, #2a3561 100%) !important;
          }
          
          .navbar .nav-link {
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
            margin: 0 5px;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .navbar .nav-link:hover {
            color: white;
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .navbar .nav-link.active {
            color: white;
            background-color: rgba(255, 255, 255, 0.15);
          }
          
          .navbar .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 3px;
            background-color: #ffffff;
            border-radius: 3px;
          }
          
          .brand-icon {
            width: 32px;
            height: 32px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .cube-wrapper {
            position: relative;
            width: 20px;
            height: 20px;
            perspective: 100px;
          }
          
          .cube {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transform: translateZ(-10px) rotateX(-15deg) rotateY(15deg);
            animation: rotate 10s infinite linear;
          }
          
          .cube-face {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(52, 152, 219, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .front {
            transform: rotateY(0deg) translateZ(10px);
            background: rgba(52, 152, 219, 0.8);
          }
          
          .back {
            transform: rotateY(180deg) translateZ(10px);
            background: rgba(41, 128, 185, 0.8);
          }
          
          .top {
            transform: rotateX(90deg) translateZ(10px);
            background: rgba(41, 128, 185, 0.8);
          }
          
          .bottom {
            transform: rotateX(-90deg) translateZ(10px);
            background: rgba(52, 152, 219, 0.8);
          }
          
          @keyframes rotate {
            0% {
              transform: translateZ(-10px) rotateX(-15deg) rotateY(0deg);
            }
            100% {
              transform: translateZ(-10px) rotateX(-15deg) rotateY(360deg);
            }
          }
          
          .nav-icon {
            margin-right: 6px;
            font-size: 1rem;
            vertical-align: -2px;
          }
          
          @media (max-width: 991px) {
            .navbar .nav-link {
              margin: 5px 0;
            }
            
            .navbar .nav-link.active::after {
              width: 40px;
            }
          }

          /* Add these styles for sticky behavior */
          .sticky-top {
            position: sticky;
            top: 0;
            z-index: 1030;
            transition: all 0.3s ease;
          }
          
          /* Optional: Add padding to body to prevent content jump when header becomes sticky */
          body {
            scroll-padding-top: 70px; /* Approximately the height of your header */
          }
        `}
      </style>
    </nav>
  );
};

export default Header;
