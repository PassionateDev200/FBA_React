import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BoxContent = ({ box, boxName, addItem }) => {

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Contents of Box {boxName}</h5>
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <button className="btn btn-success">
            Add
          </button>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>FNSKU</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {box.map((detail, index) =>
              detail.quantity!== '' && (
                <tr key={index}>
                  <td>{detail.fnsku}</td>
                  <td>{detail.quantity}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" disabled>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoxContent;
