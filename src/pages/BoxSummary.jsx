import React, { useState, useEffect, useCallback } from "react";
import BoxList from "../components/BoxList";
import BoxContent from "../components/BoxContent";
import { getImportData, saveImportData } from "../utils/storage";
import { Button, Modal } from "react-bootstrap";
import ConfirmModal from "../components/ConfirmModal";
import AddBoxForm from "../components/AddBoxForm";

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
        if (name[i] !== "") {
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
        } else if (i < 12) {
          boxArray.push("");
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
            detail.push({ quantity: data[index], fnsku: data[4] })
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
    setConfirmMessage(`Are you sure you want to add box "${boxData.name}"?`);
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
      console.log("addboxdata", data, boxData);

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
      data.mainJson[boxNameId].push(`P1 - B${current_length}`);

      data.mainJson[boxNameId + 1].push(boxData.weight);
      data.mainJson[boxNameId + 2].push(boxData.width);
      data.mainJson[boxNameId + 3].push(boxData.length);
      data.mainJson[boxNameId + 4].push(boxData.height);

      // Save updated data
      saveImportData(data).then(() => {
        // Reload boxes to show the updated list
        loadBoxes();
      });
    });
  };

  // Handle remove box confirmation
  const handleRemoveBox = (index) => {
    if (index === 0) return; // Don't allow removing the header

    const boxName = boxes[index].split(":")[0];
    setConfirmMessage(`Are you sure you want to remove box "${boxName}"?`);
    setConfirmAction(() => () => {
      removeBoxFromData(index);
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  // Remove the box data from storage
  const removeBoxFromData = (boxIndex) => {
    getImportData().then((data) => {
      if (!data) return;

      let boxNameId = 0;
      for (let i = 0; i < data.mainJson.length; i++) {
        if (data.mainJson[i][0] === "Name of box") {
          boxNameId = i;
          break;
        }
      }

      // Clear the box data (don't remove the column to avoid shifting issues)
      data.mainJson[boxNameId][boxIndex] = "";
      data.mainJson[boxNameId + 1][boxIndex] = "";
      data.mainJson[boxNameId + 2][boxIndex] = "";
      data.mainJson[boxNameId + 3][boxIndex] = "";
      data.mainJson[boxNameId + 4][boxIndex] = "";

      // Clear any quantities associated with this box
      for (let i = boxNameId + 5; i < data.mainJson.length; i++) {
        if (data.mainJson[i].length > boxIndex) {
          data.mainJson[i][boxIndex] = "";
        }
      }

      // Save updated data
      saveImportData(data).then(() => {
        // Reload boxes to show the updated list
        loadBoxes();

        // If the removed box was selected, reset selection
        if (selectId === boxIndex) {
          setSelectId(0);
          setBoxDetail([]);
        }
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
      const currentQuantity =
        parseInt(importData.mainJson[fnskuRow][selectId]) || 0;
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
      });
    }
  };

  const addItem = (fnsku, quantity) => {
    console.log(typeof quantity); // entered books
    console.log(importData.mainJson[fnsku][10]); // boxed quantity
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
    } else {
      setError("Exceed the maximum quantity");
      status = false;
    }
    return status;
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Box Summary</h1>
      <div className="row mb-4">
        <div className="col">
          <Button variant="primary" onClick={handleAddBox} className="mb-3">
            Add New Box
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <BoxList boxes={boxes} onSelect={onListClicked} />
        </div>
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

      {/* Add Box Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Box</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBoxForm
            onSubmit={handleAddBoxSubmit}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showConfirmModal}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
        error={error}
      />
    </div>
  );
};

export default BoxSummary;
