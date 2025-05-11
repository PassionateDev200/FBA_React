import React, { useEffect, useState } from "react";
import { getBoxAssignments, getImportData } from "../utils/storage";
import { exportAmazonFormat, exportBoxSummary } from "../utils/fileUtils";

const ExportPage = () => {
  const [importData, setImportData] = useState(null);

  useEffect(() => {
    getImportData().then(setImportData);
  }, []);

  const handleExportAmazon = () => {
    exportAmazonFormat(importData);
  };

  const handleExportSummary = () => {
    exportBoxSummary(importData);
  };

  return (
    <div className="container my-5">
      <h3>Export Box Content</h3>
      <p>Download your data in Amazon format or as a box-wise summary:</p>

      <button className="btn btn-primary me-3" onClick={handleExportAmazon}>
        Export Amazon File
      </button>

      <button
        className="btn btn-outline-secondary"
        onClick={handleExportSummary}
      >
        Export Box Summary
      </button>
    </div>
  );
};

export default ExportPage;
