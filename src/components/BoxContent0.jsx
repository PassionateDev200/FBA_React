import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Badge,
  Tabs,
  Tab,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  BoxArrowInDown,
  Upc,
  InfoCircleFill,
  Check2,
  Calculator,
  PlusLg,
  TrashFill,
} from "react-bootstrap-icons";

const BoxContent = ({
  box,
  boxName,
  addItem,
  availablefnskus,
  error,
  importData,
  selectId,
}) => {
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("single");

  // Single Add state
  const [singleForm, setSingleForm] = useState({ fnsku: "", quantity: 1 });

  // Multi Add state
  const [multiRows, setMultiRows] = useState([{ fnsku: "" }]);
  const [multiQty, setMultiQty] = useState(1);

  // Open/close modal
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSingleForm({ fnsku: "", quantity: 1 });
    setMultiRows([{ fnsku: "" }]);
    setMultiQty(1);
    setActiveTab("single");
  };

  // Add new row for Multi Add
  const handleAddRow = () => setMultiRows([...multiRows, { fnsku: "" }]);
  // Remove a row for Multi Add
  const handleRemoveRow = (idx) =>
    setMultiRows(multiRows.filter((_, i) => i !== idx));
  // Update FNSKU in Multi Add
  const handleMultiFnskuChange = (idx, value) =>
    setMultiRows(
      multiRows.map((row, i) => (i === idx ? { ...row, fnsku: value } : row))
    );

  // Handle submit for Single Add
  const handleSingleSubmit = () => {
    let fnskuIndex = null;
    for (const fnsku of availablefnskus) {
      const fnskuRow = fnsku[0];
      const matchingFnskuValue = importData.mainJson[fnskuRow][4];
      if (matchingFnskuValue === singleForm.fnsku) {
        fnskuIndex = fnskuRow;
        break;
      }
    }
    if (fnskuIndex !== null) {
      const status = addItem(fnskuIndex, parseInt(singleForm.quantity));
      if (status) handleCloseAddModal();
    }
  };

  // Handle submit for Multi Add
  const handleMultiSubmit = () => {
    multiRows.forEach((row) => {
      let fnskuIndex = null;
      for (const fnsku of availablefnskus) {
        const fnskuRow = fnsku[0];
        const matchingFnskuValue = importData.mainJson[fnskuRow][4];
        if (matchingFnskuValue === row.fnsku) {
          fnskuIndex = fnskuRow;
          break;
        }
      }
      if (fnskuIndex !== null && row.fnsku) {
        addItem(fnskuIndex, parseInt(multiQty));
      }
    });
    handleCloseAddModal();
  };

  // Render Ext/Av for a given FNSKU (row)
  const getExtAv = (fnskuValue) => {
    for (const fnsku of availablefnskus) {
      const fnskuRow = fnsku[0];
      const matchingFnskuValue = importData.mainJson[fnskuRow][4];
      if (matchingFnskuValue === fnskuValue) {
        const row = importData.mainJson[fnskuRow];
        return { ext: row[9], av: row[1] };
      }
    }
    return { ext: "", av: "" };
  };

  return (
    <>
      {/* Main Box Content */}
      <Card className="mb-3">
        <Card.Header>
          <strong>{boxName || "No Box Selected"}</strong>
          {selectId > 0 && (
            <Button
              variant="primary"
              className="float-end"
              onClick={handleShowAddModal}
            >
              <BoxArrowInDown className="me-2" />
              Add Item
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {selectId <= 0 ? (
            <div>Select a box from the list to view its contents</div>
          ) : box.length === 0 ||
            !box.some((detail) => detail.quantity !== "") ? (
            <div>
              This box is empty
              <br />
              Click "Add Item" to add contents to this box
            </div>
          ) : (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Title</th>
                  <th>ASIN</th>
                  <th>FNSKU</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {box.map(
                  (detail, index) =>
                    detail.quantity !== "" && (
                      <tr key={index}>
                        <td>{detail.sku}</td>
                        <td>{detail.title}</td>
                        <td>{detail.asin}</td>
                        <td>{detail.fnsku}</td>
                        <td>{detail.quantity}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          )}
        </Card.Body>
      </Card>

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
          <Tabs
            id="add-item-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            {/* Single Add Tab */}
            <Tab eventKey="single" title="Single Add">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <Upc className="me-2" /> Enter FNSKU
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter FNSKU (e.g., X004B0UKXN)"
                    value={singleForm.fnsku}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, fnsku: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <Calculator className="me-2" /> Quantity
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={singleForm.quantity}
                    onChange={(e) =>
                      setSingleForm({
                        ...singleForm,
                        quantity: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                {error && <div className="alert alert-danger">{error}</div>}
              </Form>
            </Tab>

            {/* Multi Add Tab */}
            <Tab eventKey="multi" title="Multi Add">
              <Form>
                <Row className="align-items-center mb-2">
                  <Col xs={5}>
                    <strong>FNSKU / ASIN / SKU</strong>
                  </Col>
                  <Col xs={3}>
                    <strong>Ext</strong>
                  </Col>
                  <Col xs={3}>
                    <strong>Av</strong>
                  </Col>
                  <Col xs={1}></Col>
                </Row>
                {multiRows.map((row, idx) => {
                  const { ext, av } = getExtAv(row.fnsku);
                  return (
                    <Row className="align-items-center mb-2" key={idx}>
                      <Col xs={5}>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="FNSKU"
                            value={row.fnsku}
                            onChange={(e) =>
                              handleMultiFnskuChange(idx, e.target.value)
                            }
                          />
                          {multiRows.length > 1 && (
                            <Button
                              variant="outline-danger"
                              onClick={() => handleRemoveRow(idx)}
                              size="sm"
                              tabIndex={-1}
                            >
                              <TrashFill />
                            </Button>
                          )}
                        </InputGroup>
                      </Col>
                      <Col xs={3}>{ext}</Col>
                      <Col xs={3}>{av}</Col>
                      <Col xs={1}>
                        {idx === multiRows.length - 1 && (
                          <Button
                            variant="outline-primary"
                            onClick={handleAddRow}
                            size="sm"
                            tabIndex={-1}
                          >
                            <PlusLg />
                          </Button>
                        )}
                      </Col>
                    </Row>
                  );
                })}
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <Calculator className="me-2" /> Quantity for All
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={multiQty}
                    onChange={(e) => setMultiQty(e.target.value)}
                  />
                </Form.Group>
                {error && <div className="alert alert-danger">{error}</div>}
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          {activeTab === "single" ? (
            <Button
              variant="success"
              className="d-flex align-items-center"
              onClick={handleSingleSubmit}
              disabled={!singleForm.fnsku || singleForm.quantity < 1}
            >
              <Check2 className="me-2" /> Add Item
            </Button>
          ) : (
            <Button
              variant="success"
              className="d-flex align-items-center"
              onClick={handleMultiSubmit}
              disabled={
                multiRows.length === 0 ||
                multiRows.some((row) => !row.fnsku) ||
                multiQty < 1
              }
            >
              <Check2 className="me-2" /> Add All Items
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BoxContent;
