// AddBoxForm.jsx
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { getImportData } from "../utils/storage0";

const AddBoxForm = ({ onSubmit, onCancel, shipmentID }) => {
  const [boxData, setBoxData] = useState({
    boxName: "",
    weight: "",
    width: "",
    length: "",
    height: "",
  });

  // const newBoxData = () => {
  //   getImportData(shipmentID).then((data) => {
  //     // if (!data) return;

  //     let boxNameId = 0;
  //     for (let i = 0; i < data.mainJson.length; i++) {
  //       if (data.mainJson[i][0] === "Name of box") {
  //         boxNameId = i;
  //         break;
  //       }
  //     }

  //     let current_length = data.mainJson[4].length - 11;

  //     setBoxData((prev) => ({
  //       ...prev,
  //       boxName: `P1 - B${current_length}`,
  //     }));
  //   });
  // };
  const newBoxData = () => {
    getImportData(shipmentID).then((data) => {
      if (!data || !data.mainJson) {
        // Default to B1 if no data
        setBoxData((prev) => ({
          ...prev,
          boxName: "P1 - B1",
        }));
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
      const nextBoxNumber = highestBoxNumber + 1;

      // Set the new box name
      setBoxData((prev) => ({
        ...prev,
        boxName: `P1 - B${nextBoxNumber}`,
      }));
    });
  };

  useEffect(() => {
    newBoxData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoxData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(boxData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="string"
          name="boxname"
          value={boxData.boxName}
          onChange={handleChange}
          required
        />
      </Form.Group>
      {/*
      <Form.Group className="mb-3">
        <Form.Label>Weight (lb)</Form.Label>
        <Form.Control
          type="number"
          name="weight"
          value={boxData.weight}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Width (inch)</Form.Label>
        <Form.Control
          type="number"
          name="width"
          value={boxData.width}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Length (inch)</Form.Label>
        <Form.Control
          type="number"
          name="length"
          value={boxData.length}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Height (inch)</Form.Label>
        <Form.Control
          type="number"
          name="height"
          value={boxData.height}
          onChange={handleChange}
          required
        />
      </Form.Group>
      */}

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Add Box
        </Button>
      </div>
    </Form>
  );
};

export default AddBoxForm;
