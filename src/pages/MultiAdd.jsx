import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import { BoxSeamFill, Plus, Check2Circle } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { getImportData, saveImportData } from "../utils/storage0";
import { useNavigate, useLocation } from "react-router-dom";

const MultiAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shipmentID = location.state?.shipmentID;

  // Form data
  const [formData, setFormData] = useState({
    sku: "",
    quantity: 1,
    boxNumbers: "",
    addToMultiple: true,
  });

  // Validation and state
  const [errors, setErrors] = useState({});
  const [parsedBoxes, setParsedBoxes] = useState([]);
  const [availableSKUs, setAvailableSKUs] = useState([]);
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importData, setImportData] = useState(null);

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getImportData(shipmentID);
        if (!data) {
          toast.error("No shipment data found");
          navigate("/shipments");
          return;
        }

        setImportData(data);
        setAvailableSKUs(getAvailableSKUs(data));

        // Store full box details and numbers
        const boxData = getAvailableBoxes(data);
        setAvailableBoxes(boxData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load shipment data");
        navigate("/shipments");
      }
    };

    fetchData();
  }, [shipmentID, navigate]);

  // Get available SKUs
  const getAvailableSKUs = (data) => {
    if (!data || !data.mainJson) return [];

    const skus = [];

    // Find FNSKU rows in the data (starting after header rows)
    for (let i = 5; i < data.mainJson.length; i++) {
      const row = data.mainJson[i];

      // Skip empty rows or rows without FNSKU
      if (!row || !row[4]) continue;

      // Calculate remaining quantity (expected - boxed)
      const expectedQty = parseInt(row[9] || "0");
      const boxedQty = parseInt(row[10] || "0");
      const availableQty = Math.max(0, expectedQty - boxedQty);

      // Only include SKUs that have available quantity
      if (availableQty > 0) {
        skus.push({
          id: i, // Row index (for referencing)
          sku: row[0] || "", // SKU
          title: row[1] || "", // Title
          asin: row[3] || "", // ASIN
          fnsku: row[4] || "", // FNSKU
          availableQty: availableQty, // Amount available to add to boxes
        });
      }
    }

    return skus;
  };

  // Get available box numbers
  const getAvailableBoxes = (data) => {
    if (!data || !data.mainJson) return { boxes: [], boxNumbers: [] };

    const boxDetails = [];
    const boxNumbers = [];
    let boxNameId = 0;

    // Find box name row index
    for (let i = 0; i < data.mainJson.length; i++) {
      if (data.mainJson[i][0] === "Name of box") {
        boxNameId = i;
        break;
      }
    }

    // If no boxes found, return empty array
    if (boxNameId === 0) return { boxes: [], boxNumbers: [] };

    // Start from index 1 to skip header
    for (let i = 1; i < data.mainJson[boxNameId].length; i++) {
      const boxName = data.mainJson[boxNameId][i];
      if (boxName && boxName !== "") {
        // Extract the box number from the end of the name (e.g., "P1 - B4" → 4)
        const boxNumberMatch = boxName.match(/B(\d+)$/);
        let boxNumber = null;

        if (boxNumberMatch && boxNumberMatch[1]) {
          boxNumber = parseInt(boxNumberMatch[1], 10);
          boxNumbers.push(boxNumber);
        }

        boxDetails.push({
          index: i, // Original index in the array
          name: boxName, // Full box name e.g. "P1 - B4"
          boxNumber: boxNumber, // Extracted number e.g. 4
        });
      }
    }

    console.log("getAvailableBoxes ==>", { boxDetails, boxNumbers });
    return { boxDetails, boxNumbers };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Parse box numbers from input
  useEffect(() => {
    if (!formData.boxNumbers.trim() || !formData.addToMultiple) {
      setParsedBoxes([]);
      return;
    }

    try {
      const boxes = [];
      // Split by comma
      const parts = formData.boxNumbers.split(",").map((part) => part.trim());

      parts.forEach((part) => {
        if (part.includes("-")) {
          // Handle range (e.g., "5-10")
          const [start, end] = part
            .split("-")
            .map((num) => parseInt(num.trim(), 10));
          if (isNaN(start) || isNaN(end)) {
            throw new Error("Invalid range format");
          }

          // Add all numbers in the range
          for (let i = start; i <= end; i++) {
            if (!boxes.includes(i)) boxes.push(i);
          }
        } else {
          // Handle single number
          const num = parseInt(part, 10);
          if (isNaN(num)) {
            throw new Error("Invalid number");
          }
          if (!boxes.includes(num)) boxes.push(num);
        }
      });

      // Sort boxes numerically
      boxes.sort((a, b) => a - b);
      setParsedBoxes(boxes);

      // Validate that box numbers exist in available boxes
      // Now comparing against the extracted box numbers
      const invalidBoxes = boxes.filter(
        (box) =>
          !availableBoxes.boxNumbers || !availableBoxes.boxNumbers.includes(box)
      );

      if (invalidBoxes.length > 0) {
        setErrors((prev) => ({
          ...prev,
          boxNumbers: `Box numbers not found: ${invalidBoxes.join(", ")}`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          boxNumbers: null,
        }));
      }
    } catch (error) {
      setParsedBoxes([]);
      setErrors((prev) => ({
        ...prev,
        boxNumbers:
          'Invalid format. Use numbers separated by commas or ranges (e.g., "5-10, 12, 15-17")',
      }));
    }
  }, [formData.boxNumbers, formData.addToMultiple, availableBoxes]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.sku) {
      newErrors.sku = "Please select a SKU";
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (
      formData.addToMultiple &&
      (!formData.boxNumbers || parsedBoxes.length === 0)
    ) {
      newErrors.boxNumbers = "Please enter valid box numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const skuId = parseInt(formData.sku);
      const quantity = parseInt(formData.quantity);

      // Create a deep copy of the import data
      const updatedData = JSON.parse(JSON.stringify(importData));

      // Get the row that contains the selected SKU
      const skuRow = skuId;

      // Calculate total quantity needed
      const totalQtyNeeded = parsedBoxes.length * quantity;

      // Check if enough quantity is available
      const expectedQty = parseInt(updatedData.mainJson[skuRow][9] || "0");
      const boxedQty = parseInt(updatedData.mainJson[skuRow][10] || "0");
      const availableQty = Math.max(0, expectedQty - boxedQty);

      if (availableQty < totalQtyNeeded) {
        toast.error(
          `Not enough quantity available. Only ${availableQty} units available.`
        );
        setIsLoading(false);
        return;
      }

      // Add the quantity to each specified box
      let boxesUpdated = 0;

      // Process each box number (e.g., 4 for "P1 - B4")
      for (const boxNum of parsedBoxes) {
        // Find matching box detail with this number
        const boxDetail = availableBoxes.boxDetails.find(
          (detail) => detail.boxNumber === boxNum
        );

        if (!boxDetail) continue; // Skip if not found

        const boxIndex = boxDetail.index; // Get the actual array index

        // If the cell is empty, set it to the quantity, otherwise add to it
        if (
          !updatedData.mainJson[skuRow][boxIndex] ||
          updatedData.mainJson[skuRow][boxIndex] === ""
        ) {
          updatedData.mainJson[skuRow][boxIndex] = quantity.toString();
        } else {
          const currentQty = parseInt(updatedData.mainJson[skuRow][boxIndex]);
          updatedData.mainJson[skuRow][boxIndex] = (
            currentQty + quantity
          ).toString();
        }
        boxesUpdated++;
      }

      // Update the boxed quantity
      updatedData.mainJson[skuRow][10] = (
        boxedQty +
        boxesUpdated * quantity
      ).toString();

      // Save the updated data
      await saveImportData(updatedData, shipmentID);

      toast.success(
        `Added ${quantity} units of ${
          updatedData.mainJson[skuRow][0] || "SKU"
        } to ${boxesUpdated} boxes`
      );

      // Redirect to box summary
      navigate("/boxsummary0", { state: { shipmentID } });
    } catch (error) {
      console.error("Error adding to multiple boxes:", error);
      toast.error("Failed to add items to boxes: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // UI rendering
  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white">
          <h4 className="mb-0 d-flex align-items-center">
            <BoxSeamFill className="me-2" />
            Add to Multiple Boxes
          </h4>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading data...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* SKU Selection */}
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Select
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  isInvalid={!!errors.sku}
                  className="text-black"
                >
                  <option value="">Select SKU</option>
                  {availableSKUs.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="text-black"
                    >
                      {item.sku} :: {item.title} (Available: {item.availableQty}
                      )
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.sku}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Quantity Input */}
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  isInvalid={!!errors.quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Add to Multiple Boxes Checkbox */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="add-to-multiple"
                  name="addToMultiple"
                  label="Add to Multiple Boxes"
                  checked={formData.addToMultiple}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Box Numbers Input */}
              {formData.addToMultiple && (
                <Form.Group className="mb-3">
                  <Form.Label>Box Numbers</Form.Label>
                  <Form.Control
                    type="text"
                    name="boxNumbers"
                    value={formData.boxNumbers}
                    onChange={handleInputChange}
                    placeholder="Enter box numbers (e.g., 10-14, 4, 6, 7, 9)"
                    isInvalid={!!errors.boxNumbers}
                  />
                  <Form.Text className="text-muted">
                    You can specify a range (e.g., "5-10") or individual box
                    numbers separated by commas.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.boxNumbers}
                  </Form.Control.Feedback>
                </Form.Group>
              )}

              {/* Preview of parsed boxes */}
              {parsedBoxes.length > 0 && (
                <Alert variant="info" className="mt-3">
                  <div className="d-flex align-items-center mb-2">
                    <Check2Circle className="me-2" />
                    <strong>Will add to {parsedBoxes.length} boxes:</strong>
                  </div>
                  <div className="parsed-boxes-preview">
                    {parsedBoxes.map((boxNum) => {
                      const boxDetail = availableBoxes.boxDetails?.find(
                        (detail) => detail.boxNumber === boxNum
                      );
                      return (
                        <Badge
                          bg="secondary"
                          key={boxNum}
                          className="me-1 mb-1"
                        >
                          {boxDetail?.name || `Box ${boxNum}`}
                        </Badge>
                      );
                    })}
                  </div>
                </Alert>
              )}

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() =>
                    navigate("/boxsummary", { state: { shipmentID } })
                  }
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    isLoading || Object.keys(errors).some((key) => errors[key])
                  }
                >
                  {isLoading ? "Processing..." : "Add Item"}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MultiAdd;
