// AddBoxForm.jsx
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { getImportData } from "../utils/storage";

const AddBoxForm = ({ onSubmit, onCancel }) => {
  const [boxData, setBoxData] = useState({
    boxName: "",
    weight: "",
    width: "",
    length: "",
    height: "",
  });

  const newBoxData = () => {
    getImportData().then((data) => {
      // if (!data) return;

      let boxNameId = 0;
      for (let i = 0; i < data.mainJson.length; i++) {
        if (data.mainJson[i][0] === "Name of box") {
          boxNameId = i;
          break;
        }
      }

      let current_length = data.mainJson[4].length - 11;
      setBoxData((prev) => ({
        ...prev,
        boxName: `P1 - B${current_length}`,
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
