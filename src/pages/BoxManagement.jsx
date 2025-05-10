import React, { useEffect, useState } from "react";
import { getImportData, saveBoxAssignments } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import ValidationAlerts from "../components/ValidationAlerts";

function BoxContentEntry() {
  const [importData, setImportData] = useState(null);
  const [validation, setValidation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getImportData().then((data) => {
      if (!data) navigate("/");
      else {
        setImportData(data);
      }
    });
  }, [navigate]);

  const handleSave = async () => {
    await saveBoxAssignments(importData);
    navigate("/export");
  };

  if (!importData) return null;

  return (
    <div className="container py-4">
      <h3>Box Content Entry</h3>
      <div className="mb-3 text-muted">
        Assign quantities of each SKU to boxes. (Barcode/manual entry UI goes
        here)
      </div>
      {/* Example: List of SKUs and boxes */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered">
          <tbody>
            {importData.mainJson.map(
              (sku, index) =>
                sku[5] !== "" && (
                  <tr key={index}>
                    <td>{sku[0]}</td>
                    <td>{sku[1]}</td>
                    <td>{sku[2]}</td>
                    <td>{sku[3]}</td>
                    <td>{sku[4]}</td>
                    <td>
                      {index === 4 ? (
                        sku[9]
                      ) : (
                        <input
                          type="number"
                          min={0}
                          className="form-control"
                          value={importData["mainJson"][index][9]}
                          style={{ width: 100 }}
                          onChange={(e) => {
                            let data = importData;
                            data["mainJson"][index][9] = e.target.value;
                            setImportData({
                              ...importData,
                              mainJson: data["mainJson"],
                            });
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {index === 4 ? (
                        sku[10]
                      ) : (
                        <input
                          type="number"
                          min={0}
                          className="form-control"
                          value={importData["mainJson"][index][10]}
                          style={{ width: 100 }}
                          onChange={(e) => {
                            let data = importData;
                            data["mainJson"][index][10] = e.target.value;
                            setImportData({
                              ...importData,
                              mainJson: data["mainJson"],
                            });
                          }}
                        />
                      )}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      <ValidationAlerts validation={validation} />
      <button className="btn btn-primary" onClick={handleSave}>
        Save & Continue
      </button>
    </div>
  );
}

export default BoxContentEntry;
