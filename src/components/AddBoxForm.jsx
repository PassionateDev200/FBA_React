// AddBoxForm.jsx
import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Badge } from "react-bootstrap";
import { getImportData } from "../utils/storage0";
import { Check2Circle } from "react-bootstrap-icons";

const AddBoxForm = ({ onSubmit, onCancel, shipmentID }) => {
  const [boxData, setBoxData] = useState({
    boxName: "",
    weight: "",
    width: "",
    length: "",
    height: "",
  });

  const [multiBoxData, setMultiBoxData] = useState({
    isMultiBox: false,
    boxCount: 1,
  });

  const [nextBoxNumber, setNextBoxNumber] = useState(1);
  const [previewBoxes, setPreviewBoxes] = useState([]);

  const newBoxData = () => {
    getImportData(shipmentID).then((data) => {
      if (!data || !data.mainJson) {
        // Default to B1 if no data
        setBoxData((prev) => ({
          ...prev,
          boxName: "P1 - B1",
        }));
        setNextBoxNumber(1);
        return;
      }

      // Find the box name row
      let boxNameId = 0;
      for (let i = 0; i < data.mainJson.length; i++) {
        if (data.mainJson[i][0] === "Name of box") {
          boxNameId = i;
          break;
        }
      }

      // If no box name row found, default to B1
      if (boxNameId === 0) {
        setBoxData((prev) => ({
          ...prev,
          boxName: "P1 - B1",
        }));
        setNextBoxNumber(1);
        return;
      }

      // Extract all box numbers from existing box names
      const boxNumbers = [];
      for (let i = 1; i < data.mainJson[boxNameId].length; i++) {
        const boxName = data.mainJson[boxNameId][i];
        if (boxName && boxName !== "") {
          // Extract the numeric part after "B" (e.g., from "P1 - B4" extract 4)
          const match = boxName.match(/B(\d+)$/);
          if (match && match[1]) {
            boxNumbers.push(parseInt(match[1], 10));
          }
        }
      }

      // Find the highest box number
      const highestBoxNumber =
        boxNumbers.length > 0 ? Math.max(...boxNumbers) : 0;

      // Increment by 1 for the new box name
      const nextNumber = highestBoxNumber + 1;
      setNextBoxNumber(nextNumber);

      // Set the new box name
      setBoxData((prev) => ({
        ...prev,
        boxName: `P1 - B${nextNumber}`,
      }));
    });
  };

  useEffect(() => {
    newBoxData();
  }, [shipmentID]);

  // Update preview boxes when multiBoxData changes
  useEffect(() => {
    if (multiBoxData.isMultiBox && multiBoxData.boxCount > 0) {
      const boxes = [];
      for (let i = 0; i < multiBoxData.boxCount; i++) {
        boxes.push(`P1 - B${nextBoxNumber + i}`);
      }
      setPreviewBoxes(boxes);
    } else {
      setPreviewBoxes([]);
    }
  }, [multiBoxData, nextBoxNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoxData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiBoxChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMultiBoxData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseInt(value) || 1,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (multiBoxData.isMultiBox) {
      // Create multiple boxes
      const boxesToCreate = [];
      for (let i = 0; i < multiBoxData.boxCount; i++) {
        boxesToCreate.push({
          boxName: `P1 - B${nextBoxNumber + i}`,
          weight: boxData.weight,
          width: boxData.width,
          length: boxData.length,
          height: boxData.height,
        });
      }
      onSubmit({ multipleBoxes: boxesToCreate });
    } else {
      // Create single box
      onSubmit(boxData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Multi-Box Checkbox */}
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="add-multiple-boxes"
          name="isMultiBox"
          label="Add Multiple Boxes"
          checked={multiBoxData.isMultiBox}
          onChange={handleMultiBoxChange}
        />
      </Form.Group>

      {/* Number of Boxes Input (shown when multi-box is enabled) */}
      {multiBoxData.isMultiBox && (
        <Form.Group className="mb-3">
          <Form.Label>Number of Boxes</Form.Label>
          <Form.Control
            type="number"
            name="boxCount"
            value={multiBoxData.boxCount}
            onChange={handleMultiBoxChange}
            min="1"
            max="50"
          />
          <Form.Text className="text-muted">
            Enter the number of boxes you want to add (1-50)
          </Form.Text>
        </Form.Group>
      )}

      {/* Preview of boxes to be created */}
      {previewBoxes.length > 0 && (
        <Alert variant="info" className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <Check2Circle className="me-2" />
            <strong>Will create {previewBoxes.length} boxes:</strong>
          </div>
          <div className="d-flex flex-wrap gap-1">
            {previewBoxes.map((boxName, index) => (
              <Badge bg="secondary" key={index} className="me-1 mb-1">
                {boxName}
              </Badge>
            ))}
          </div>
        </Alert>
      )}

      {/* Box Name (disabled when multi-box is enabled) */}
      <Form.Group className="mb-3">
        <Form.Label>Box Name</Form.Label>
        <Form.Control
          type="text"
          name="boxName"
          value={
            multiBoxData.isMultiBox ? `P1 - B${nextBoxNumber}` : boxData.boxName
          }
          onChange={handleChange}
          disabled={multiBoxData.isMultiBox}
        />
        {multiBoxData.isMultiBox && (
          <Form.Text className="text-muted">
            Starting box name (others will be numbered sequentially)
          </Form.Text>
        )}
      </Form.Group>

      {multiBoxData.isMultiBox && (
        <Form.Text className="text-muted mb-3 d-block">
          All boxes will have the same dimensions and weight
        </Form.Text>
      )}

      {/* Buttons */}
      <div className="d-flex justify-content-end">
        <Button variant="outline-secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {multiBoxData.isMultiBox
            ? `Create ${multiBoxData.boxCount} Boxes`
            : "Create Box"}
        </Button>
      </div>
    </Form>
  );
};

export default AddBoxForm;
