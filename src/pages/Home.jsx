import React from "react";
import FileUpload from "../components/FileUpload";
import { BoxSeam, Amazon, BoxSeamFill } from "react-bootstrap-icons";
const Home = () => {
  return (
    <div className="home-container">
      <div className="container position-relative py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Branded Header */}
            <div className="mb-4">
              <h1 className="display-5 fw-bold text-primary mb-2 d-flex align-items-center justify-content-center">
                <BoxSeam className="me-3" size={45} />
                Amazon FBA Box Content Tool
              </h1>
              <p className="lead text-secondary">
                Streamline your Amazon FBA shipping process with our powerful
                box content management tool
              </p>
            </div>

            {/* Feature List */}
            <div className="row mb-5 gx-5">
              <div className="col-md-4">
                <div className="feature-item">
                  <div className="feature-icon bg-primary text-white">
                    <BoxSeamFill size={24} />
                  </div>
                  <h5>Simplify Box Content</h5>
                  <p className="text-muted small">
                    Easily manage and organize all your FBA shipment box
                    contents
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item">
                  <div className="feature-icon bg-primary text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
                    </svg>
                  </div>
                  <h5>Import & Export</h5>
                  <p className="text-muted small">
                    Easily import Amazon files and export data in compatible
                    formats
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item">
                  <div className="feature-icon bg-primary text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .488.359l.458 1.784v5.253a2.007 2.007 0 0 0-.615-.568V2.618l-.349-1.35h-3.964l-.349 1.35v4.612a2.007 2.007 0 0 0-.615.568V2.143L5.52.359zM5.5 2.5a.5.5 0 0 0-.5.5v4.438a2.007 2.007 0 0 0-.416 0V3a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0 0 1h.416v7.585l-1.903.649a.5.5 0 0 0-.174.13l-.159.154a.5.5 0 0 0 .31.747l7.022 1.194a.5.5 0 0 0 .686-.363l.159-1.088a.5.5 0 0 0-.103-.343l-.127-.149a.5.5 0 0 0-.211-.105l-2.072-.575V4.438a2.007 2.007 0 0 0-.416 0V3a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0 0 1h.416v.81L5.5 2.5zm1.834 8.378-.5 3a.5.5 0 0 0 .497.542h2a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.497.542zm1.987-9.432L7.5 1h1l.474.546-.185 1.086-.5-.6-.5.6-.185-1.086zM4.697 3H7.5v.5H4.697v-.5z" />
                    </svg>
                  </div>
                  <h5>Compliance</h5>
                  <p className="text-muted small">
                    Stay compliant with Amazon's FBA box content requirements
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Card with Shadow */}
            <div className="upload-section p-4 bg-white rounded-4 shadow-lg">
              <h3 className="mb-4 d-flex align-items-center justify-content-center">
                <Amazon className="me-2" size={30} />
                <span>Upload Box Content File</span>
              </h3>
              <FileUpload />
            </div>

            {/* Footer Info */}
            <div className="mt-5 pt-3 text-muted small">
              <p>
                For best results, upload your Amazon-generated box content
                template file.
              </p>
              <p>Need help? Contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for styling */}
      <style>{`
        .home-container {
          position: relative;
          min-height: 100vh;
          padding: 20px 0;
        }
        
        .background-image {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://blog.bookbaby.com/wp-content/uploads/2016/06/Categories-Banner.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0.08;
          z-index: -1;
        }
        
        .upload-section {
          border: 1px solid #e9ecef;
        }
        
        .feature-item {
          padding: 20px 10px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }
      `}</style>
    </div>
  );
};

export default Home;
