import React, { useState } from "react";
import { Card, Button, Modal, Form, Badge, ButtonGroup } from "react-bootstrap";
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
  PencilFill,
} from "react-bootstrap-icons";

const BoxContent0 = ({
  box,
  boxName,
  addItem,
  reduceItem,
  availablefnskus,
  error,
  selectId,
  removeFNSKU,
  importData,
}) => {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fnsku: "",
    quantity: 1,
  });

  // Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [editError, setEditError] = useState("");

  // Handle opening the add modal
  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  // Handle closing the add modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      fnsku: "",
      quantity: 1,
    });
  };

  // Open the edit modal for a specific item
  const handleShowEditModal = (item) => {
    // Find availability information
    const fnskuInfo = availablefnskus.find((fnsku) => {
      const fnskuRow = fnsku[0];
      return importData.mainJson[fnskuRow][4] === item.fnsku;
    });

    if (fnskuInfo) {
      const fnskuRow = fnskuInfo[0];
      const row = importData.mainJson[fnskuRow];
      const expectedQty = parseInt(row[9] || "0");
      const boxedQty = parseInt(row[10] || "0");
      const currentQty = parseInt(item.quantity || "0");

      // Set the item with additional availability info
      // setEditingItem({
      //   ...item,
      //   expectedQty,
      //   boxedQty,
      //   availableQty: fnskuInfo[1] + currentQty, // Available + current (which will be freed up)
      //   fnskuRow,
      // });

      setEditingItem({
        ...item,
        expectedQty,
        boxedQty,
        availableQty: fnskuInfo[1], // Available + current (which will be freed up)
        fnskuRow,
      });

      setNewQuantity(currentQty.toString());
      setShowEditModal(true);
    }
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setNewQuantity("");
    setEditError("");
  };

  // Handle form input changes for add modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle quantity change in edit modal
  const handleQuantityChange = (e) => {
    setNewQuantity(e.target.value);
    setEditError(""); // Clear error on input change
  };

  // Handle save for edit modal
  const handleSaveEdit = () => {
    if (!editingItem) return;

    const newQty = parseInt(newQuantity);
    const currentQty = parseInt(editingItem.quantity);

    // Validation
    if (isNaN(newQty) || newQty < 0) {
      setEditError("Please enter a valid quantity");
      return;
    }

    // Calculate available unboxed quantity
    const unboxedQty = editingItem.expectedQty - editingItem.boxedQty;

    // Calculate max allowed quantity (current in this box + available unboxed)
    const maxAllowed = currentQty + unboxedQty;

    // Check if quantity is within available limits
    if (newQty > maxAllowed) {
      setEditError(
        `Maximum allowed quantity is ${maxAllowed} (${currentQty} current + ${unboxedQty} available)`
      );
      return;
    }

    // If quantity is 0, just remove the item
    if (newQty === 0) {
      removeFNSKU(editingItem.fnsku, editingItem.quantity);
      handleCloseEditModal();
      return;
    }

    // If no change, just close
    if (newQty === currentQty) {
      handleCloseEditModal();
      return;
    }

    // Handle quantity changes
    if (newQty < currentQty) {
      // Reducing quantity: remove all, then add the new amount
      if (newQty > 0) {
        const difference = currentQty - newQty;
        const success = reduceItem(editingItem.fnskuRow, difference);
        if (success) {
          handleCloseEditModal();
        }
      } else {
        handleCloseEditModal();
      }
    } else if (newQty > currentQty) {
      // Increasing quantity: just add the difference
      const difference = newQty - currentQty;
      const success = addItem(editingItem.fnskuRow, difference);
      if (success) {
        handleCloseEditModal();
      }
    }
  };

  // Handle form submission for add modal
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
        handleCloseAddModal();
      }
    } else {
      // Handle the case where no matching FNSKU was found
      console.error("No matching FNSKU found");
      // You could also set an error state here
    }
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Header
        className="bg-gradient-dark d-flex justify-content-between align-items-center py-3"
        style={{
          background: "linear-gradient(to right, #343a40, #495057)",
        }}
      >
        <h5 className="mb-0 text-white d-flex align-items-center">
          <BoxSeam className="me-2" />
          {boxName || "No Box Selected"}
        </h5>
        {box && box.length > 0 && selectId > 0 && (
          <div className="text-light small mt-1">
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
        {selectId > 0 && (
          <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center"
            onClick={handleShowAddModal}
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
                <th className="text-center">Actions</th>
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
                        <ButtonGroup size="sm">
                          <Button
                            variant="light"
                            className="d-inline-flex align-items-center justify-content-center"
                            onClick={() => handleShowEditModal(detail)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50% 0 0 50%",
                            }}
                          >
                            <PencilFill className="text-primary" />
                          </Button>
                          <Button
                            variant="light"
                            className="d-inline-flex align-items-center justify-content-center"
                            onClick={() =>
                              removeFNSKU(detail.fnsku, detail.quantity)
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "0 50% 50% 0",
                            }}
                          >
                            <TrashFill className="text-danger" />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </Card.Body>

      {/* Add Item Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        centered
        size="lg"
      >
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
                            <Badge bg="success">
                              Available: {availableQty}
                            </Badge>
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
                              <strong>Boxed:</strong> {boxedQty}
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
          <Button variant="outline-secondary" onClick={handleCloseAddModal}>
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

      {/* Edit Quantity Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <PencilFill className="me-2" /> Edit Item Quantity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Form>
              <div className="alert alert-info mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>FNSKU: {editingItem.fnsku}</strong>
                  <Badge bg="success">
                    Available: {editingItem.availableQty}
                  </Badge>
                </div>
                <div>
                  <strong>Title:</strong> {editingItem.title}
                </div>
                <div>
                  <strong>SKU:</strong> {editingItem.sku}
                </div>
                <div>
                  <strong>ASIN:</strong> {editingItem.asin}
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>
                    <strong>Expected:</strong> {editingItem.expectedQty}
                  </div>
                  <div>
                    <strong>Boxed:</strong> {editingItem.boxedQty}
                  </div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>
                  Current Quantity: <strong>{editingItem.quantity}</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={newQuantity}
                  onChange={handleQuantityChange}
                  min="0"
                  // max={editingItem.availableQty}
                  isInvalid={!!editError}
                />
                <Form.Text muted>
                  Enter 0 to remove the item from this box
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {editError}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="d-flex align-items-center"
            onClick={handleSaveEdit}
          >
            <Check2 className="me-2" /> Update Quantity
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BoxContent0;
