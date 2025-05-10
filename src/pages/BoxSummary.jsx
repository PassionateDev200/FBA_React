import React, { useState, useEffect, useCallback } from "react";
import BoxList from "../components/BoxList";
import BoxContent from "../components/BoxContent";
import { getImportData } from "../utils/storage";

const BoxSummary = () => {
  const [boxes, setBoxes] = useState([]);
  const [importData, setImportData] = useState({});
  const [selectId, setSelectId] = useState(0);
  const [boxDetail, setBoxDetail] = useState([]);

  useEffect(() => {
    getImportData().then((data) => {
      let name = [];
      let weight = [];
      let width = [];
      let length = [];
      let height = [];
      let boxArray = [];
      let boxNameId = 0;

      setImportData(data);
      for (let i = 0; i < data.mainJson.length; i++) {
        if (data.mainJson[i][0] === "Name of box") {
          boxNameId = i;
        }
      }
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
              "(lb) ,  " +
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
  }, []);

  // useEffect(() => {
  //   let detail = [];
  //   if (selectId > 11) {
  //     importData.mainJson.map(
  //       (data, index) =>
  //         index > 5 &&
  //         data[4] !== "" &&
  //         detail.push({ quantity: data[selectId], fnsku: data[4] })
  //     );
  //     setBoxDetail(detail);
  //   }
  // }, [selectId]);

  const onListClicked = useCallback((e) => {
    console.log("indexes of list", e);

    let detail = [];
    if (e > 11) {
      getImportData().then((data) => data.mainJson.map(
        (data, index) =>
          index > 5 &&
          data[4] !== "" &&
          detail.push({ quantity: data[e], fnsku: data[4] })
      ));
      setBoxDetail(detail);
    }
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Box Summary</h3>
      <div className="row">
        <div className="col-md-4">
          <BoxList boxes={boxes} onSelect={onListClicked}  />
        </div>
        <div className="col-md-8">
          <BoxContent box={boxDetail} boxName={boxes[selectId]} />
        </div>
      </div>
    </div>
  );
};

export default BoxSummary;
