import React, { useState, useEffect, useCallback } from "react";
import BoxList from "../components/BoxList";
import BoxContent from "../components/BoxContent";
import { getImportData, saveImportData } from "../utils/storage";
import { Button, Modal, Card } from "react-bootstrap";
import AddBoxForm from "../components/AddBoxForm";
import EditBoxForm from "../components/EditBoxForm";
import {
  PlusLg,
  BoxSeam,
  PencilSquare,
  ExclamationCircle,
  ExclamationTriangle,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

const BoxSummary = () => {
  const [boxes, setBoxes] = useState([]);
  const [importData, setImportData] = useState({});
  const [selectId, setSelectId] = useState(0);
  const [boxDetail, setBoxDetail] = useState([]);
  const [avalible_fnsku, setAvalible_fnsku] = useState([]);
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [error, setError] = useState("");
  // Add these state variables to your existing state
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditBox, setCurrentEditBox] = useState({ index: 0, data: "" });

  // Add this function to handle opening the edit modal
  const handleEditBox = (index, boxData) => {
    setCurrentEditBox({ index, data: boxData });
    setShowEditModal(true);
  };

  // Add this function to handle the edit form submission
  const handleEditBoxSubmit = (boxData) => {
    setConfirmMessage(
      `Are you sure you want to update box "${boxData.boxName}"?`
    );
    setConfirmAction(() => () => {
      updateBoxInData(currentEditBox.index, boxData);
      setShowConfirmModal(false);
      setShowEditModal(false);
    });
    setShowConfirmModal(true);
  };

  // Add this function to update the box data in storage
  const updateBoxInData = (boxIndex, boxData) => {
    getImportData().then((data) => {
      if (!data) return;

      let boxNameId = 0;
      for (let i = 0; i < data.mainJson.length; i++) {
        if (data.mainJson[i][0] === "Name of box") {
          boxNameId = i;
          break;
        }
      }

      // Update the box properties
      // Note: We're not updating the name as it's disabled in the form
      data.mainJson[boxNameId + 1][boxIndex] = boxData.weight;
      data.mainJson[boxNameId + 2][boxIndex] = boxData.width;
      data.mainJson[boxNameId + 3][boxIndex] = boxData.length;
      data.mainJson[boxNameId + 4][boxIndex] = boxData.height;

      // Save updated data
      saveImportData(data).then(() => {
        // Reload boxes to show the updated list
        loadBoxes();
        toast.success(`Box updated successfully!`);
      });
    });
  };

  useEffect(() => {
    loadBoxes();
  }, [selectId]);

  const loadBoxes = () => {
    getImportData().then((data) => {
      if (!data) return;

      let name = [];
      let weight = [];
      let width = [];
      let length = [];
      let height = [];
      let boxArray = [];
      let boxNameId = 0;

      setImportData(data);
      let fnsku = [];
      for (let i = 0; i < data.mainJson.length; i++) {
        if (data.mainJson[i][0] === "Name of box") {
          boxNameId = i;
          break;
        }
        if (i > 4) {
          fnsku.push([
            i,
            parseInt(data.mainJson[i][9]) - parseInt(data.mainJson[i][10]),
          ]);
        }
      }
      setAvalible_fnsku(fnsku);

      name = data.mainJson[boxNameId];
      weight = data.mainJson[boxNameId + 1];
      width = data.mainJson[boxNameId + 2];
      length = data.mainJson[boxNameId + 3];
      height = data.mainJson[boxNameId + 4];

      boxArray.push(name[0]);
      for (let i = 1; i < name.length; i++) {
        if (i < 12) {
          boxArray.push("");
        } else if (name[i] !== "") {
          if (weight[i] !== "") {
            boxArray.push(
              name[i] +
                ": " +
                weight[i] +
                "(lb) , " +
                width[i] +
                " x " +
                length[i] +
                " x " +
                height[i] +
                "(inch)"
            );
          } else {
            boxArray.push(name[i] + ":" + "W x L x H (inch)");
          }
        }
      }

      setBoxes(boxArray);
    });
  };

  const onListClicked = useCallback((index) => {
    setSelectId(index);
    calculateBox(index);
  }, []);

  const calculateBox = (index) => {
    let detail = [];
    if (index > 10) {
      getImportData().then((data) =>
        data.mainJson.map(
          (data, idx) =>
            idx > 4 &&
            data[4] !== "" &&
            detail.push({
              quantity: data[index],
              fnsku: data[4],
              title: data[1],
              asin: data[3],
              sku: data[0],
            })
        )
      );
      setBoxDetail(detail);
    }
  };

  // Handle opening the add box modal
  const handleAddBox = () => {
    setShowAddModal(true);
  };

  // Handle the add box form submission
  const handleAddBoxSubmit = (boxData) => {
    setConfirmMessage(`Are you sure you want to add box "${boxData.boxName}"?`);
    setConfirmAction(() => () => {
      addBoxToData(boxData);
      setShowConfirmModal(false);
      setShowAddModal(false);
    });
    setShowConfirmModal(true);
  };

  // Add the box data to storage
  const addBoxToData = (boxData) => {
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
      data.mainJson[4].push(`Box ${current_length} quantity`);
      for (let i = 5; i < boxNameId - 1; i++) {
        data.mainJson[i].push("");
      }
      data.mainJson[boxNameId].push(boxData.boxName);
      data.mainJson[boxNameId + 1].push(boxData.weight);
      data.mainJson[boxNameId + 2].push(boxData.width);
      data.mainJson[boxNameId + 3].push(boxData.length);
      data.mainJson[boxNameId + 4].push(boxData.height);

      // Save updated data
      saveImportData(data).then(() => {
        // Reload boxes to show the updated list
        loadBoxes();
        toast.success(`Box "${boxData.boxName}" added successfully!`);
      });
    });
  };

  const removeFNSKU = (fnsku, quantity) => {
    // Show confirmation modal
    setConfirmMessage(
      `Are you sure you want to remove ${quantity} units of FNSKU ${fnsku} from this box?`
    );
    setConfirmAction(() => () => {
      // This will be executed when user confirms
      removeFNSKUFromBox(fnsku, quantity);
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const removeFNSKUFromBox = (fnsku, quantity) => {
    // Find the index of the FNSKU in the mainJson array
    let fnskuRow = -1;
    for (let i = 5; i < importData.mainJson.length; i++) {
      if (importData.mainJson[i][4] === fnsku) {
        fnskuRow = i;
        break;
      }
    }

    if (fnskuRow !== -1) {
      // Get the current quantity
      const removeQuantity = parseInt(quantity) || 0;

      // Remove the quantity from the box
      importData.mainJson[fnskuRow][selectId] = "";

      // Update the boxed quantity (column 10)
      const boxedQuantity = parseInt(importData.mainJson[fnskuRow][10]) || 0;
      importData.mainJson[fnskuRow][10] = boxedQuantity - removeQuantity + "";

      // Increase the available quantity
      for (let i = 0; i < avalible_fnsku.length; i++) {
        if (avalible_fnsku[i][0] === fnskuRow) {
          avalible_fnsku[i][1] += removeQuantity;
          break;
        }
      }

      // Save data to localStorage
      saveImportData(importData).then(() => {
        // Refresh the UI
        calculateBox(selectId);
        loadBoxes();
        setError("");
        toast.info(`Removed ${quantity} units of ${fnsku} from box`);
      });
    }
  };

  const addItem = (fnsku, quantity) => {
    // entered books : (typeof quantity)
    // boxed quantity : (importData.mainJson[fnsku][10])
    let status;
    if (avalible_fnsku[fnsku - 5][1] >= quantity) {
      avalible_fnsku[fnsku - 5][1] -= quantity;
      importData.mainJson[fnsku][10] =
        parseInt(importData.mainJson[fnsku][10]) + quantity + ""; //mounted books
      if (importData.mainJson[fnsku][selectId] === "") {
        importData.mainJson[fnsku][selectId] = quantity + "";
      } else {
        importData.mainJson[fnsku][selectId] =
          parseInt(importData.mainJson[fnsku][selectId]) + quantity + "";
      }
      saveImportData(importData);
      calculateBox(selectId);
      loadBoxes();
      setError("");
      status = true;
      toast.success(`Added ${quantity} units to box successfully!`);
    } else {
      setError("Exceed the maximum quantity");
      toast.error("Cannot add items: Exceeds available quantity");
      status = false;
    }
    return status;
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm mb-4 bg-light">
        <div
          className="position-relative align-content-end"
          style={{ minHeight: "20rem", overflow: "hidden" }}
        >
          <div
            style={{
              backgroundImage: "url('/images/BoxSummary.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          ></div>
          <div className="position-relative p-3 d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-0 d-flex align-items-center text-black">
                <BoxSeam size={28} style={{ marginRight: "12px" }} /> Box
                Summary
              </h1>
              <h6 className="text-white mb-0 mt-2">
                Manage your boxes and their contents efficiently
              </h6>
            </div>
            <Button
              variant="dark"
              onClick={handleAddBox}
              className="d-flex align-items-center"
              size="lg"
            >
              <PlusLg className="me-2" /> Add New Box
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="row">
        {/* Enhanced Box List */}
        <div className="col-md-4">
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-3">
              <BoxList
                boxes={boxes}
                onSelect={onListClicked}
                onEdit={handleEditBox}
              />
            </Card.Body>
          </Card>
        </div>

        {/* Box Content Area */}
        <div className="col-md-8">
          <BoxContent
            addItem={addItem}
            box={boxDetail}
            boxName={boxes[selectId]}
            availablefnskus={avalible_fnsku}
            error={error}
            selectId={selectId}
            removeFNSKU={removeFNSKU}
          />
        </div>
      </div>

      {/* Enhanced Add Box Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header
          closeButton
          className="border-0 pb-0"
          style={{
            backgroundImage: "linear-gradient(to right, #f8f9fa, #e9ecef)",
            height: "5rem",
          }}
        >
          <Modal.Title style={{ color: "#212529", fontWeight: "bold" }}>
            <BoxSeam className="me-2" />
            Add New Box
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <AddBoxForm
            onSubmit={handleAddBoxSubmit}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Enhanced Edit Box Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
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
            <PencilSquare className="me-2" />
            Edit Box Properties
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <EditBoxForm
            box={currentEditBox.data}
            onSubmit={handleEditBoxSubmit}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Enhanced Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
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
            <ExclamationTriangle className="me-2 text-warning" />
            Confirm Action
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="text-center mb-4">
            <ExclamationCircle size={50} className="text-warning mb-3" />
            <p>{confirmMessage}</p>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="warning" onClick={confirmAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BoxSummary;
