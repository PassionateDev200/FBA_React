import React, { useEffect, useState } from "react";
import { getImportData } from "../utils/storage";
import { exportAmazonFormat, exportBoxSummary } from "../utils/fileUtils";
import { Card, Row, Col, Alert } from "react-bootstrap";
import {
  CloudDownloadFill,
  FileEarmarkText,
  BoxSeamFill,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

const ExportPage = () => {
  const [importData, setImportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getImportData().then(setImportData);
  }, []);

  // Added validation to prevent exporting without data
  const handleExportAmazon = () => {
    if (!importData) {
      toast.error(
        "No data available to export. Please upload or add data first."
      );
      return;
    }
    setIsLoading(true);
    try {
      exportAmazonFormat(importData);
      toast.success("Amazon format file exported successfully!");
    } catch (error) {
      toast.error("Failed to export Amazon format file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Added validation to prevent exporting without data
  const handleExportSummary = () => {
    if (!importData) {
      toast.error(
        "No data available to export. Please upload or add data first."
      );
      return;
    }
    setIsLoading(true);
    try {
      exportBoxSummary(importData);
      toast.success("Box summary exported successfully!");
    } catch (error) {
      toast.error("Failed to export box summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <Card className="border-0 shadow-sm mb-4">
        <div className="position-relative">
          <div
            className="bg-gradient position-absolute w-100 h-100"
            style={{
              background: "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)",
              borderRadius: "0.375rem",
            }}
          ></div>
          <Card.Body className="position-relative p-4">
            <div className="d-flex align-items-center mb-4">
              <CloudDownloadFill size={32} className="text-primary me-3" />
              <div>
                <h2 className="mb-0">Export Box Content</h2>
                <p className="text-muted mb-0 mt-1">
                  Download your box content data in your preferred format
                </p>
              </div>
            </div>

            {!importData && (
              <Alert variant="warning" className="d-flex align-items-center">
                <BoxSeamFill className="me-2" />
                No box content data available. Please add products and assign
                them to boxes first.
              </Alert>
            )}

            <Row className="mt-4 g-4">
              <Col md={6}>
                <Card
                  className={`h-100 border-0 shadow-sm ${
                    !importData ? "opacity-50" : ""
                  }`}
                  style={{ cursor: importData ? "pointer" : "not-allowed" }}
                  onClick={handleExportAmazon}
                >
                  <Card.Body className="p-4 text-center">
                    <div
                      className="export-icon-circle bg-primary text-white mx-auto mb-3"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileEarmarkText size={32} />
                    </div>
                    <h4>Amazon Format</h4>
                    <p className="text-muted mb-4">
                      Export your data in the standard Amazon format for FBA
                      shipments
                    </p>
                    <button
                      className="btn btn-primary btn-lg px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportAmazon();
                      }}
                      disabled={!importData || isLoading}
                    >
                      <CloudDownloadFill className="me-2" /> Export Amazon File
                    </button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card
                  className={`h-100 border-0 shadow-sm ${
                    !importData ? "opacity-50" : ""
                  }`}
                  style={{ cursor: importData ? "pointer" : "not-allowed" }}
                  onClick={handleExportSummary}
                >
                  <Card.Body className="p-4 text-center">
                    <div
                      className="export-icon-circle bg-secondary text-white mx-auto mb-3"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BoxSeamFill size={32} />
                    </div>
                    <h4>Box Summary</h4>
                    <p className="text-muted mb-4">
                      Export a comprehensive summary of all your boxes and their
                      contents
                    </p>
                    <button
                      className="btn btn-secondary btn-lg px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSummary();
                      }}
                      disabled={!importData || isLoading}
                    >
                      <CloudDownloadFill className="me-2" /> Export Box Summary
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </div>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h5 className="mb-3">Export Instructions</h5>
          <ul className="mb-0">
            <li className="mb-2">
              <strong>Amazon Format:</strong> Use this file for uploading to
              Amazon's Seller Central platform.
            </li>
            <li className="mb-2">
              <strong>Box Summary:</strong> Useful for your internal records and
              inventory management.
            </li>
            <li className="mb-2">
              All exports will download automatically to your device.
            </li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExportPage;
