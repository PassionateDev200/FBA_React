import React, { useEffect, useState } from "react";

const BoxList = ({ boxes, onAdd, onSelect }) => {
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
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default BoxList;
