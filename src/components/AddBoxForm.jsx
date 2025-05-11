// AddBoxForm.jsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddBoxForm = ({ onSubmit, onCancel }) => {
  const [boxData, setBoxData] = useState({
    weight: '',
    width: '',
    length: '',
    height: ''
  });

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
