import React from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "./../../components/shared/Spinner";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0">
          <div className="col-lg-8 col-md-12 form-banner">
            <img
              src="./assets/images/banner1.jpeg"
              alt="loginImage"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/images/defaultBanner.jpg";
              }}
              className="img-fluid"
            />
          </div>
          <div className="col-lg-4 col-md-12 form-container">
            <Form
              formTitle={"Login Page"}
              submitBtn={"Login"}
              formType={"login"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
