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
  importData,
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
    // Find the correct index for the entered FNSKU
    let fnskuIndex = null;

    // Search through availablefnskus to find the matching row index
    for (const fnsku of availablefnskus) {
      const fnskuRow = fnsku[0];
      const matchingFnskuValue = importData.mainJson[fnskuRow][4];

      // If we find a match, use that row's index
      if (matchingFnskuValue === formData.fnsku) {
        fnskuIndex = fnskuRow;
        break;
      }
    }

    // Only proceed if we found a valid index
    if (fnskuIndex !== null) {
      // Call the parent component's add item function with the correct index
      let status = addItem(fnskuIndex, parseInt(formData.quantity));
      if (status) {
        handleCloseModal();
      }
    } else {
      // Handle the case where no matching FNSKU was found
      console.error("No matching FNSKU found");
      // You could also set an error state here
    }
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
                <Upc className="me-2" /> Enter FNSKU
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter FNSKU (e.g., X004B0UKXN)"
                value={formData.fnsku}
                onChange={(e) => {
                  const enteredFnsku = e.target.value;
                  setFormData({
                    ...formData,
                    fnsku: enteredFnsku,
                  });
                }}
              />
            </Form.Group>

            {formData.fnsku && (
              <>
                {availablefnskus.some((fnsku) => {
                  const fnskuRow = fnsku[0];
                  const availableQty = fnsku[1];
                  const matchingFnskuValue = importData.mainJson[fnskuRow][4];

                  if (matchingFnskuValue === formData.fnsku) {
                    return true;
                  }
                  return false;
                }) ? (
                  availablefnskus.map((fnsku, index) => {
                    const fnskuRow = fnsku[0];
                    const availableQty = fnsku[1];
                    const matchingFnskuValue = importData.mainJson[fnskuRow][4];

                    if (matchingFnskuValue === formData.fnsku) {
                      const row = importData.mainJson[fnskuRow];
                      const expectedQty = parseInt(row[9] || "0");
                      const boxedQty = parseInt(row[10] || "0");

                      return (
                        <div key={index} className="alert alert-info mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>FNSKU: {matchingFnskuValue}</strong>
                            <strong>Available: {availableQty}</strong>
                          </div>
                          <div>
                            <strong>Title:</strong> {row[1]}
                          </div>
                          <div>
                            <strong>SKU:</strong> {row[0]}
                          </div>
                          <div>
                            <strong>ASIN:</strong> {row[3]}
                          </div>
                          <div className="d-flex justify-content-between mt-2">
                            <div>
                              <strong>Expected:</strong> {expectedQty}
                            </div>
                            <div>
                              <strong>Scanned:</strong> {boxedQty}
                            </div>
                          </div>
                          <input
                            type="hidden"
                            name="fnsku"
                            value={fnskuRow}
                            onChange={handleInputChange}
                          />
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <div className="alert alert-warning">
                    <InfoCircleFill className="me-2" />
                    No matching FNSKU found. Please enter a valid FNSKU.
                  </div>
                )}
              </>
            )}

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
