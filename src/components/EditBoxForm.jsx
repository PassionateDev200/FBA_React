// EditBoxForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const EditBoxForm = ({ box, onSubmit, onCancel }) => {
  const [boxData, setBoxData] = useState({
    name: '',
    weight: '',
    width: '',
    length: '',
    height: ''
  });

  useEffect(() => {
    // Parse the box string to get individual properties
    if (box) {
      const nameMatch = box.match(/^(.*?):/);
      const weightMatch = box.match(/(\d+)\(lb\)/);
      const dimensionsMatch = box.match(/(\d+) x (\d+) x (\d+)\(inch\)/);
      
      if (nameMatch && weightMatch && dimensionsMatch) {
        setBoxData({
          name: nameMatch[1].trim(),
          weight: weightMatch[1],
          width: dimensionsMatch[1],
          length: dimensionsMatch[2],
          height: dimensionsMatch[3]
        });
      }
    }
  }, [box]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoxData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(boxData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Box Name</Form.Label>
        <Form.Control 
          type="text" 
          name="name" 
          value={boxData.name} 
          onChange={handleChange}
          disabled
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
          Save Changes
        </Button>
      </div>
    </Form>
  );
};

export default EditBoxForm;
