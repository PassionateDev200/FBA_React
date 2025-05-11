import React, { useEffect, useState } from "react";
import { getImportData, saveImportData } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import ValidationAlerts from "../components/ValidationAlerts";
import { Modal, Button } from "react-bootstrap";

function BoxManagement() {
  const [importData, setImportData] = useState(null);
  const [validation, setValidation] = useState([]);
  const navigate = useNavigate();
  
  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  // Form data for adding/editing product
  const [formData, setFormData] = useState({
    sku: '',
    product_title: '',
    Id: '',
    ASIN: '',
    FNSKU: '',
    condition: '',
    prep_type: '',
    preps_units: '',
    labels_units: '',
    expected_quantity: '0'
  });

  useEffect(() => {
    getImportData().then((data) => {
      if (!data) navigate("/");
      else {
        setImportData(data);
      }
    });
  }, [navigate]);

  const handleSave = async () => {
    await saveImportData(importData);
    navigate("/export");
  };

  // Open add modal with reset form
  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      sku: '',
      product_title: '',
      Id: '',
      ASIN: '',
      FNSKU: '',
      condition: '',
      prep_type: '',
      preps_units: '',
      labels_units: '',
      expected_quantity: '0'
    });
    setShowAddEditModal(true);
  };

  // Open edit modal with prefilled data
  const handleEditClick = (index) => {
    const sku = importData.mainJson[index];
    setIsEditing(true);
    setCurrentIndex(index);
    
    setFormData({
      sku: sku[0] || '',
      product_title: sku[1] || '',
      Id: sku[2] || '',
      ASIN: sku[3] || '',
      FNSKU: sku[4] || '',
      condition: sku[5] || '',
      prep_type: sku[6] || '',
      preps_units: sku[7] || '',
      labels_units: sku[8] || '',
      expected_quantity: sku[9] || '0'
    });
    
    setShowAddEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Save product (add or update)
  const handleFormSubmit = async () => {
    const newData = { ...importData };
    
    if (isEditing) {
      // Update existing product
      newData.mainJson[currentIndex][0] = formData.sku;
      newData.mainJson[currentIndex][1] = formData.product_title;
      newData.mainJson[currentIndex][2] = formData.Id;
      newData.mainJson[currentIndex][3] = formData.ASIN;
      newData.mainJson[currentIndex][4] = formData.FNSKU;
      newData.mainJson[currentIndex][5] = formData.condition;
      newData.mainJson[currentIndex][6] = formData.prep_type;
      newData.mainJson[currentIndex][7] = formData.preps_units;
      newData.mainJson[currentIndex][8] = formData.labels_units;
      newData.mainJson[currentIndex][9] = formData.expected_quantity;
    } else {
      // Add new product
      const newRow = [
        formData.sku,
        formData.product_title,
        formData.Id,
        formData.ASIN,
        formData.FNSKU,
        formData.condition,
        formData.prep_type,
        formData.preps_units,
        formData.labels_units,
        formData.expected_quantity,
        '0' // Initialize boxed quantity as column 10
      ];
      
      newData.mainJson.push(newRow);
    }
    
    setImportData(newData);
    await saveImportData(newData); // Save to localStorage
    setShowAddEditModal(false);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (index) => {
    setCurrentIndex(index);
    setShowDeleteModal(true);
  };

  // Delete product after confirmation
  const handleDeleteConfirm = async () => {
    const newData = { ...importData };
    newData.mainJson.splice(currentIndex, 1);
    
    setImportData(newData);
    await saveImportData(newData); // Save to localStorage
    setShowDeleteModal(false);
  };

  // Handle quantity change in the table
  const handleQuantityChange = (index, value) => {
    const newData = { ...importData };
    newData.mainJson[index][9] = value;
    setImportData(newData);
  };

  if (!importData) return null;

  return (
    <div className="container py-4">
      <h3>Box Content Entry</h3>
      <div className="mb-3 text-muted d-flex justify-content-between align-items-center">
        <span>Assign quantities of each SKU to boxes.</span>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Product
        </button>
      </div>
      
      {/* Products Table */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Title</th>
              <th>ID</th>
              <th>ASIN</th>
              <th>FNSKU</th>
              <th>Expected Quantity</th>
              <th>Boxed</th>
              <th>Actions</th>
            </tr>
          </thead>
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
                          value={importData.mainJson[index][9] || '0'}
                          style={{ width: 100 }}
                          onChange={(e) => {
                            handleQuantityChange(index, e.target.value);
                          }}
                          onBlur={() => saveImportData(importData)} // Save when focus leaves
                        />
                      )}
                    </td>
                    <td>
                      {index === 4
                        ? sku[10]
                        : importData.mainJson[index][10] || '0'}
                    </td>
                    <td>
                      {index === 4 ? (
                        <p>Action</p>
                      ) : (
                        <div>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEditClick(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClick(index)}
                          >
                            Delete
                          </button>
                        </div>
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
      
      {/* Add/Edit Product Modal */}
      <Modal show={showAddEditModal} onHide={() => setShowAddEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-control"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Product Title</label>
              <input
                type="text"
                className="form-control"
                name="product_title"
                value={formData.product_title}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">ID</label>
              <input
                type="text"
                className="form-control"
                name="Id"
                value={formData.Id}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">ASIN</label>
              <input
                type="text"
                className="form-control"
                name="ASIN"
                value={formData.ASIN}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">FNSKU</label>
              <input
                type="text"
                className="form-control"
                name="FNSKU"
                value={formData.FNSKU}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Condition</label>
              <input
                type="text"
                className="form-control"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Prep Type</label>
              <input
                type="text"
                className="form-control"
                name="prep_type"
                value={formData.prep_type}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Preps Units</label>
              <input
                type="text"
                className="form-control"
                name="preps_units"
                value={formData.preps_units}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Labels Units</label>
              <input
                type="text"
                className="form-control"
                name="labels_units"
                value={formData.labels_units}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Expected Quantity</label>
              <input
                type="number"
                min={0}
                className="form-control"
                name="expected_quantity"
                value={formData.expected_quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowAddEditModal(false)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleFormSubmit}
            disabled={!formData.FNSKU}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
          <p>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BoxManagement;
