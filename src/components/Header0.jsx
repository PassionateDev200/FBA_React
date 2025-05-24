import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Add this import
import {
  CloudUploadFill,
  BoxSeamFill,
  FileEarmarkArrowDownFill,
  GearFill,
  BoxSeam,
  Grid3x3GapFill,
  Wifi,
  ArrowRepeat,
  Amazon,
  PersonFill,
  BoxArrowRight,
} from "react-bootstrap-icons";

const Header0 = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Get auth state

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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
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
                <CloudUploadFill className="nav-icon" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/shipments") ? "active" : ""}`}
                to="/shipments"
              >
                <Grid3x3GapFill className="nav-icon" /> Shipments
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/multiAdd") ? "active" : ""}`}
                to="/multiAdd"
              >
                <BoxSeam className="nav-icon" />
                Multi Add
              </Link>
            </li>
          </ul>

          {/* Login/Logout Button */}
          <div className="auth-section ms-3">
            {currentUser ? (
              <div className="d-flex align-items-center">
                <span className="user-info me-3">
                  <PersonFill className="me-1" />
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  className="auth-button logout-button"
                  onClick={handleLogout}
                >
                  <BoxArrowRight className="me-1" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="auth-button login-button"
                onClick={() => navigate("/login")}
              >
                <PersonFill className="me-1" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Updated CSS styles */}
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

          .navbar .nav-links {
            display: flex;
            align-items: center;
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
          
          /* Auth Button Styles */
          .auth-section {
            display: flex;
            align-items: center;
          }
          
          .auth-button {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            align-items: center;
            text-decoration: none;
          }
          
          .auth-button:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
            border-color: rgba(255, 255, 255, 0.3);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .login-button {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            border-color: #3498db;
          }
          
          .login-button:hover {
            background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
            border-color: #5dade2;
          }
          
          .logout-button:hover {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.8) 0%, rgba(192, 57, 43, 0.8) 100%);
            border-color: rgba(231, 76, 60, 0.8);
          }
          
          .user-info {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.85rem;
            font-weight: 500;
            display: flex;
            align-items: center;
          }
          
          .connection-status {
            font-size: 0.9rem;
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
            
            .auth-section {
              margin-top: 10px;
              width: 100%;
            }
            
            .auth-button {
              width: 100%;
              justify-content: center;
            }
            
            .user-info {
              margin-bottom: 10px;
              justify-content: center;
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

export default Header0;
