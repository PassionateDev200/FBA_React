// export default BoxList;
import React, { useState, useEffect, useRef } from "react";
import { Button, Badge } from "react-bootstrap";
import {
  BoxSeamFill,
  BoxFill,
  PencilFill,
  ChevronLeft,
  ChevronRight,
  InboxesFill,
  BoxArrowUpRight,
} from "react-bootstrap-icons";

const BoxList = ({ boxes, onEdit, onSelect }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedBoxId, setSelectedBoxId] = useState(null);

  // Use ref to track if the boxes array actually changed
  const prevBoxesLength = useRef(boxes.length);
  const isSelectionChange = useRef(false);

  // Filter boxes as in original code
  const filteredBoxes = boxes.filter((_, index) => index > 11);

  // Calculate indexes for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBoxes = filteredBoxes.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredBoxes.length / itemsPerPage);

  // Reset to page 1 ONLY if boxes array length changes (not on selection)
  useEffect(() => {
    if (
      prevBoxesLength.current !== boxes.length &&
      !isSelectionChange.current
    ) {
      setCurrentPage(1);
    }
    prevBoxesLength.current = boxes.length;
    isSelectionChange.current = false;
  }, [boxes]);

  // Function to get original index in the boxes array
  const getOriginalIndex = (pageIndex) => {
    let actualIndex = 0;
    let count = 0;

    for (let i = 0; i < boxes.length; i++) {
      if (i > 11) {
        if (count === pageIndex + indexOfFirstItem) {
          actualIndex = i;
          break;
        }
        count++;
      }
    }

    return actualIndex;
  };

  // Handle box selection - mark that this is a selection change
  const handleSelect = (originalIndex) => {
    isSelectionChange.current = true;
    setSelectedBoxId(originalIndex);
    onSelect(originalIndex);
  };

  // Find which page contains the selected box and navigate to it
  const goToPageContainingBox = (boxId) => {
    if (boxId === null) return;

    // Find the index in filteredBoxes
    const indexInFiltered = filteredBoxes.findIndex((_, i) => {
      const originalIndex = i + 12; // Since we filter boxes > 11
      return originalIndex === boxId;
    });

    if (indexInFiltered !== -1) {
      const targetPage = Math.floor(indexInFiltered / itemsPerPage) + 1;
      setCurrentPage(targetPage);
    }
  };

  return (
    <div className="box-list-component">
      <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <BoxSeamFill className="me-2" />
          Boxes
        </h5>
        <Badge bg="dark" pill>
          {filteredBoxes.length}
        </Badge>
      </div>

      {currentBoxes.length === 0 ? (
        <div className="text-center py-5">
          <InboxesFill size={40} className="text-muted mb-3" />
          <p className="text-muted">
            No boxes available. Click "Add New Box" to get started.
          </p>
        </div>
      ) : (
        <div className="box-list">
          {currentBoxes.map((box, index) => {
            const originalIndex = getOriginalIndex(index);

            return (
              <div
                key={originalIndex}
                className={`box-item d-flex justify-content-between align-items-center p-3 border-bottom ${
                  originalIndex === selectedBoxId ? "selected-box" : ""
                }`}
                onClick={() => handleSelect(originalIndex)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center">
                  <div className="box-icon me-3">
                    <BoxFill
                      size={20}
                      className={
                        originalIndex === selectedBoxId
                          ? "text-primary"
                          : "text-muted"
                      }
                    />
                  </div>
                  <div>
                    <div className="fw-medium">{box}</div>
                    <small className="text-muted">
                      ID: BOX-{originalIndex}
                    </small>
                  </div>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  className="d-flex align-items-center edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(originalIndex, box);
                  }}
                >
                  <PencilFill size={14} className="text-dark" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-container pt-3 pb-2 px-3 bg-light border-top">
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant={currentPage === 1 ? "light" : "outline-dark"}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
              className="d-flex align-items-center"
            >
              <ChevronLeft /> Prev
            </Button>

            {/* Add the Go to Selected Box button here */}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => goToPageContainingBox(selectedBoxId)}
              disabled={selectedBoxId === null}
              className="d-flex align-items-center"
            >
              <BoxArrowUpRight className="me-1" /> Go to Box
            </Button>
            <div className="d-flex align-items-center">
              <small className="text-muted">
                Page {currentPage} of {totalPages}
              </small>
            </div>

            <Button
              variant={currentPage === totalPages ? "light" : "outline-dark"}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              size="sm"
              className="d-flex align-items-center"
            >
              Next <ChevronRight />
            </Button>
          </div>

          {/* Page numbers */}
          <div className="d-flex justify-content-center mt-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;

              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "dark" : "light"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="mx-1 page-number-button"
                  size="sm"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxList;
