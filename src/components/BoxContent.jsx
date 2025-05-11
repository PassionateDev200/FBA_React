import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";

const BoxContent = ({
  box,
  boxName,
  addItem,
  availablefnskus,
  error,
  selectId,
  removeFNSKU,
}) => {
  const [showModal, setShowModal] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    fnsku: "",
    quantity: 1,
  });

  // Handle opening the modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form data when closing
    setFormData({
      fnsku: "",
      quantity: 1,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Call the parent component's add item function
    let status = addItem(formData.fnsku, parseInt(formData.quantity));
    if (status) {
      handleCloseModal();
    }
    // Close the modal
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{boxName}</h5>
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          {selectId > 0 && (
            <button className="btn btn-success" onClick={handleShowModal}>
              Add
            </button>
          )}
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>FNSKU</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {box.map(
              (detail, index) =>
                detail.quantity !== "" && (
                  <tr key={index}>
                    <td>{detail.fnsku}</td>
                    <td>{detail.quantity}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          removeFNSKU(detail.fnsku, detail.quantity)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item to {boxName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>FNSKU</Form.Label>
              <Form.Select
                name="fnsku"
                value={formData.fnsku}
                onChange={handleInputChange}
              >
                <option value="">Select FNSKU</option>
                {box.map((detail, index) => (
                  <option key={index} value={index + 5}>
                    {detail.fnsku}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Remain quantity :{" "}
                {formData.fnsku !== "" &&
                  availablefnskus[formData.fnsku - 5][1]}
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
              />
            </Form.Group>
            <p>{error}</p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.fnsku || formData.quantity < 1}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BoxContent;
