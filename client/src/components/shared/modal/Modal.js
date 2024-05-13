import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputType from "./../Form/InputType";
import API from "./../../../services/API";

const Modal = () => {
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [heartRate, setHeartRate] = useState(null);

  // Function to handle modal submit
  const handleModalSubmit = async () => {
    try {
      if (!bloodGroup || !quantity) {
        return alert("Please Provide All Fields");
      }
      const { data } = await API.post("/inventory/create-inventory", {
        email,
        organisation: user?._id,
        inventoryType,
        bloodGroup,
        quantity,
        heartRate
      });
      if (data?.success) {
        alert("New Record Created");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
      window.location.reload();
    }
  };

  // Function to generate random heart rate
  const generateHeartRate = () => {
    const minHeartRate = 60;
    const maxHeartRate = 100;
    const randomHeartRate = Math.floor(
      Math.random() * (maxHeartRate - minHeartRate + 1) + minHeartRate
    );
    setHeartRate(randomHeartRate);
  };

  // Function to simulate progress bar filling up over 3 seconds
  const simulateProgressBar = () => {
    setShowProgressBar(true);
    let progress = 0;
    const increment = 1; // Increase in progress per millisecond
    const interval = 30; // Update interval in milliseconds
    const totalProgress = 100;
    const duration = 10000; // Animation duration in milliseconds
    const incrementAmount = (increment * interval * totalProgress) / duration;

    const progressBarInterval = setInterval(() => {
      progress += incrementAmount;
      if (progress >= totalProgress) {
        clearInterval(progressBarInterval);
        generateHeartRate();
        setShowProgressBar(false); // Hide progress bar after completion
      }
      document.getElementById("progress-bar").style.width = `${progress}%`;
    }, interval);
  };
  
  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Manage Blood Record
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="d-flex mb-3">
                Blood Type: &nbsp;
                <div className="form-check ms-3">
                  <input
                    type="radio"
                    name="inRadio"
                    defaultChecked
                    value={"in"}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor="in" className="form-check-label">
                    IN
                  </label>
                </div>
                <div className="form-check ms-3">
                  <input
                    type="radio"
                    name="inRadio"
                    value={"out"}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor="out" className="form-check-label">
                    OUT
                  </label>
                </div>
              </div>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option defaultValue={"Open this select menu"}>
                  Open this select menu
                </option>
                <option value={"O+"}>O+</option>
                <option value={"O-"}>O-</option>
                <option value={"AB+"}>AB+</option>
                <option value={"AB-"}>AB-</option>
                <option value={"A+"}>A+</option>
                <option value={"A-"}>A-</option>
                <option value={"B+"}>B+</option>
                <option value={"B-"}>B-</option>
              </select>
              <InputType
                labelText={"Donar Email"}
                labelFor={"donarEmail"}
                inputType={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputType
                labelText={"Quanitity (ML)"}
                labelFor={"quantity"}
                inputType={"Number"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
             {/* Button to generate heart rate */}
              <button
                type="button"
                className="btn btn-primary mt-3"
                style={{width: "40%", margin: "auto"}}
                onClick={simulateProgressBar}
                disabled={showProgressBar}

              >
                Measure Heart Rate
              </button>

              {showProgressBar && (
              <div className="progress mt-3" style={{
                width: "90%",
                margin: "auto"
              }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "0%" }}
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  id="progress-bar"
                ></div>
              </div>
            )}
            {!showProgressBar && (
              <div className="mt-3" style={{
                width: "90%",
                margin: "auto"
              }}>
                <p>Measured Heart Rate: {heartRate}</p>
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
