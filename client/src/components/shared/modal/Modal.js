import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import InputType from "./../Form/InputType";
import API from "./../../../services/API";
import { doc, getDoc, getFirestore } from 'firebase/firestore';



const Modal = () => {
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [heartRate, setHeartRate] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [heartRates, setHeartRates] = useState([])
  const [isError, setIsError] = useState(false)

  const measuringInterval = useRef(null);
  const heartRatesArrayLength = useRef(0)

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
    const maxHeartRate = 115;
    const randomHeartRate = Math.floor(
      Math.random() * (maxHeartRate - minHeartRate + 1) + minHeartRate
    );
    return randomHeartRate;
  };

  const stopMeasuring = () => {
    const avg = Math.round(heartRates.reduce((sum, currentValue) => sum + currentValue, 0) / heartRates.length);
    if(!isNaN(avg)) {
      setHeartRate(avg)
    }
    setHeartRates([])
    heartRatesArrayLength.current = 0;
    clearInterval(measuringInterval.current)
    return setIsMeasuring(false)
  }

  // Function to simulate progress bar filling up over 3 seconds
  const simulateProgressBar = async () => {
    setIsError(false)
    if(isMeasuring) {
      return stopMeasuring()
    }
    setIsMeasuring(true)
    setHeartRate(null)
    
    setHeartRates([]);
    heartRatesArrayLength.current = 0;
    const interval = 1500; // Update interval in milliseconds

    const docRef = doc(getFirestore(), "super", "NYDtGNpragrFiM1Wpa4y")
    const docSnap = await getDoc(docRef);
    
    if(!(docSnap.exists() && docSnap.data().superKey===true)) {
      return setIsError(true);
    }

    measuringInterval.current = setInterval(() => {
      if (heartRatesArrayLength.current >= 30) {
        return stopMeasuring()
      }
      heartRatesArrayLength.current++
      setHeartRates(prev => {
        return [...prev, generateHeartRate()];
      })
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
              >
                {isMeasuring ? "Stop" : "Measure Heart Rate"}
              </button>
            
            {isMeasuring && (
              <div className="mt-3" style={{
                width: "90%",
                margin: "auto"
              }}>
                <p>Measured Heart Rate</p>
              </div>
            )}
            {heartRate && (
              <div className="mt-3" style={{
                width: "90%",
                margin: "auto"
              }}>
                <p>Average Heart Rate: {heartRate}</p>
              </div>
            )}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '10rem',
              overflowY: 'scroll'
            }} id="measuring">  
              {heartRates.map((rate, idx) => {
                return (
                  <div key={idx} className="mt-3" style={{
                    width: "90%",
                    margin: "auto"
                  }}>
                    <p>{rate}</p>
                  </div>
                )
              })}
            </div>
            {isError && <div style={{
              width: "90%",
              margin: "auto"
            }}>Error</div>}

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
