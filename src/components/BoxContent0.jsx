import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Badge,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap";
import {
  BoxSeam,
  PlusLg,
  TrashFill,
  BoxArrowInLeft,
  Inbox,
  BoxArrowInDown,
  Upc,
  InfoCircleFill,
  Check2,
  Calculator,
} from "react-bootstrap-icons";

const BoxContent0 = ({
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
    title: "",
    asin: "",
    sku: "",
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
      title: "",
      asin: "",
      sku: "",
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
    <Card className="shadow-sm mb-4 h-100">
      <Card.Header
        className="bg-gradient-dark d-flex justify-content-between align-items-center py-3"
        style={{
          background: "linear-gradient(to right, #343a40, #495057)",
        }}
      >
        <div className="d-flex flex-column">
          <h5 className="mb-0 text-white d-flex align-items-center">
            <BoxSeam className="me-2" />
            {boxName || "No Box Selected"}
          </h5>
          {box && box.length > 0 && selectId > 0 && (
            <div className="text-light  mt-1">
              <Badge bg="light" text="dark" className="me-2">
                {
                  box.filter((item) => item.quantity && item.quantity !== "")
                    .length
                }{" "}
                Items
              </Badge>
              <Badge bg="info" className="me-2">
                {box.reduce((total, item) => {
                  const qty = parseInt(item.quantity) || 0;
                  return total + qty;
                }, 0)}{" "}
                Total Quantity
              </Badge>
            </div>
          )}
        </div>
        {selectId > 0 && (
          <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center"
            onClick={handleShowModal}
          >
            <PlusLg className="me-1" /> Add Item
          </Button>
        )}
      </Card.Header>

      <Card.Body>
        {selectId <= 0 ? (
          <div className="text-center py-5">
            <BoxArrowInLeft size={48} className="text-muted mb-3" />
            <h5 className="text-muted">
              Select a box from the list to view its contents
            </h5>
          </div>
        ) : box.length === 0 ||
          !box.some((detail) => detail.quantity !== "") ? (
          <div className="text-center py-5">
            <Inbox size={48} className="text-muted mb-3" />
            <h5 className="text-muted">This box is empty</h5>
            <p className="text-muted">
              Click "Add Item" to add contents to this box
            </p>
          </div>
        ) : (
          <table className="table table-hover">
            <thead className="table-light text-center">
              <tr>
                <th>SKU</th>
                <th>Title</th>
                <th>ASIN</th>
                <th>FNSKU</th>
                <th>Quantity</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {box.map(
                (detail, index) =>
                  detail.quantity !== "" && (
                    <tr key={index} className="align-middle">
                      <td>
                        <span className="fw-semibold">{detail.sku}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{detail.title}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{detail.asin}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{detail.fnsku}</span>
                      </td>
                      <td className="text-center">
                        <Badge bg="dark" pill className="px-3 py-2">
                          {detail.quantity}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="light"
                          size="sm"
                          className="d-inline-flex align-items-center justify-content-center"
                          onClick={() =>
                            removeFNSKU(detail.fnsku, detail.quantity)
                          }
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                          }}
                        >
                          <TrashFill className="text-danger" />
                        </Button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </Card.Body>

      {/* Enhanced Add Item Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <BoxArrowInDown className="me-2" /> Add Item to {boxName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <Upc className="me-2" /> Choose FNSKU
              </Form.Label>
              <Form.Select
                name="fnsku"
                value={formData.fnsku}
                onChange={handleInputChange}
                className="text-black"
              >
                <option value="">Select FNSKU</option>
                {box.map((detail, index) => (
                  <option key={index} value={index + 5} className="text-black">
                    {detail.fnsku}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Calculator className="me-2" /> Quantity
              </Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
              />
            </Form.Group>

            {formData.fnsku !== "" && (
              <div className="alert alert-info">
                <InfoCircleFill className="me-2" /> Available:{" "}
                {availablefnskus[formData.fnsku - 5][1]} units
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="success"
            className="d-flex align-items-center"
            onClick={handleSubmit}
            disabled={!formData.fnsku || formData.quantity < 1}
          >
            <Check2 className="me-2" /> Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BoxContent0;
