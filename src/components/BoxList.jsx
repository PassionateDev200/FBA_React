import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const BoxList = ({ boxes, onEdit, onSelect }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Boxes : Weight, W X L X H (in)</h5>
      </div>
      <ul className="list-group">
        {boxes.map(
          (box, index) =>
            index > 11 && (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => onSelect(index)}
                style={{ cursor: "pointer" }}
              >
                {box}
                <Button variant="white-bule" onClick={() => onEdit(index, box)}>
                  Edit
                </Button>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default BoxList;
