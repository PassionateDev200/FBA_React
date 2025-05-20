import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Badge } from "react-bootstrap";
import { getAllShipments, deleteShipment } from "../utils/storage0";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  BoxSeam,
  Grid3x3GapFill,
  TrashFill,
  ExclamationTriangle,
  Calendar3,
  ClockHistory,
  FileEarmarkArrowDownFill,
} from "react-bootstrap-icons";

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shipmentToRemove, setShipmentToRemove] = useState(null);
  const navigate = useNavigate();

  // Load all shipments on mount
  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    const all = await getAllShipments();
    setShipments(all || []);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate number of boxes and items for a shipment
  const getBoxAndItemCount = (shipment) => {
    let boxCount = 0;
    let itemCount = 0;
    if (!shipment || !shipment.mainJson) return { boxCount, itemCount };

    // Find the row with "Name of box"
    let box_location = 0;
    for (let i = 0; i < shipment.mainJson.length; i++) {
      if (shipment.mainJson[i][0] === "Name of box") {
        box_location = i;
        break;
      }
    }
    const boxArray = shipment.mainJson[box_location];
    for (let i = 0; i < boxArray.length; i++) {
      if (boxArray[i] !== "" && boxArray[i] !== "Name of box") {
        boxCount++;
      }
    }

    // Count items
    let lastItem = 0;
    for (let i = 5; i < shipment.mainJson.length; i++) {
      if (shipment.mainJson[i][0] === "") {
        lastItem = i;
        break;
      }
    }
    itemCount = lastItem > 5 ? lastItem - 5 : 0;
    return { boxCount, itemCount };
  };

  // Open delete confirmation modal
  const handleDeleteClick = (shipment) => {
    setShipmentToRemove(shipment);
    setShowDeleteModal(true);
  };

  // Remove shipment
  const handleDeleteConfirm = async () => {
    if (!shipmentToRemove) return;
    try {
      await deleteShipment(shipmentToRemove.shipmentID);
      toast.success(
        `Shipment ${shipmentToRemove.shipmentID} removed successfully!`
      );
      setShowDeleteModal(false);
      setShipmentToRemove(null);
      fetchShipments();
    } catch (error) {
      console.error("Error removing shipment:", error);
      toast.error("Failed to remove shipment. Please try again.");
    }
  };

  // Navigate to BoxSummary0 with selected shipment
  const navigateToBoxSummary = (shipmentID) => {
    navigate("/boxsummary0", { state: { shipmentID } });
  };

  // Navigate to ProductDetail0 with selected shipment
  const navigateToProducts = (shipmentID) => {
    navigate("/products0", { state: { shipmentID } });
  };

  // Navigate to ProductDetail0 with selected shipment
  const navigateToExport = (shipmentID) => {
    navigate("/export0", { state: { shipmentID } });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shipments</h2>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>Shipment ID</th>
            <th>Boxes</th>
            <th>Items</th>
            <th>Created</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-muted">
                No shipments found.
              </td>
            </tr>
          )}
          {shipments.map((shipment) => {
            const { boxCount, itemCount } = getBoxAndItemCount(shipment);
            return (
              <tr key={shipment.shipmentID}>
                <td className="fw-bold">{shipment.shipmentID}</td>
                <td>{boxCount}</td>
                <td>{itemCount}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Calendar3 className="text-muted me-2" />
                    {formatDate(shipment.createdDate)}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <ClockHistory className="text-muted me-2" />
                    {formatDate(shipment.lastModifiedDate)}
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigateToBoxSummary(shipment.shipmentID)}
                      className="d-flex align-items-center"
                    >
                      <BoxSeam className="me-1" /> View Boxes
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigateToProducts(shipment.shipmentID)}
                      className="d-flex align-items-center"
                    >
                      <Grid3x3GapFill className="me-1" /> View Products
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigateToExport(shipment.shipmentID)}
                      className="d-flex align-items-center"
                    >
                      <FileEarmarkArrowDownFill className="me-1" /> Export
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(shipment)}
                      className="d-flex align-items-center"
                    >
                      <TrashFill className="me-1" /> Remove
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className="border-0 pb-0"
          style={{
            backgroundImage: "linear-gradient(to right, #f8f9fa, #e9ecef)",
            height: "5rem",
          }}
        >
          <Modal.Title style={{ color: "#212529", fontWeight: "bold" }}>
            <ExclamationTriangle className="me-2 text-danger" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="text-center mb-4">
            <ExclamationTriangle size={50} className="text-danger mb-3" />
            <p>
              Are you sure you want to delete shipment{" "}
              <strong>{shipmentToRemove?.shipmentID}</strong>? This action
              cannot be undone.
            </p>
            {shipmentToRemove && (
              <div className="text-muted small mt-3">
                <div>Created: {formatDate(shipmentToRemove.createdDate)}</div>
                <div>
                  Last updated: {formatDate(shipmentToRemove.lastModifiedDate)}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShipmentsPage;
