import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Loader from "./loader";

function Login() {
  const history = useNavigate();
  const [state, setState] = useState({
    formData: {
      email: "",
      password: "",
    },
    remember: false,
  });
  const [loader, setLoader] = useState({
    loader: false,
    notification: false,
    message: "success",
    validationMessage: "Success",
  });
  const emailFormat = /^[^\s@]+@[^\s@]+[^\s@]+$/;

  const handleChange = (event) => {
    const { formData } = state;
    formData[event.target.name] = event.target.value;
    setState({ ...state, formData });
  };
  const handleSubmit = async () => {
    console.log("hello");
    setTimeout(() => {
      setLoader({
        ...loader,
        loader: false,
        notification: true,
        message: "success",
        validationMessage: "Success",
      });
    }, 1000);
  };

  const loaderAction = async () => {
    setLoader({ ...loader, notification: false });
  };

  return (
    <ValidatorForm onSubmit={handleSubmit}>
      <Loader
        loader={loader.loader}
        notification={loader.notification}
        message={loader.message}
        action={loaderAction}
        validationMessage={loader.validationMessage}
      />
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <TextValidator
          variant="outlined"
          margin="normal"
          size="small"
          id="email"
          name="email"
          autoComplete="email"
          onChange={handleChange}
          validators={["required", "isEmail"]}
          errorMessages={["Required Field", "Email is not valid"]}
          placeholder="Enter email"
          className="form-control"
          value={state.formData.email}
          error={!emailFormat.test(state.formData.email.toLocaleLowerCase())}
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <TextValidator
          variant="outlined"
          margin="normal"
          size="small"
          id="password"
          name="password"
          autoComplete="current-password"
          className="form-control"
          placeholder="Enter password"
          onChange={handleChange}
          value={state.formData.password}
          error={!(state.formData.password.length > 0)}
          validators={['required']}
          errorMessages={['Required Field']}
        />
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        New user <a href="/sign-up">sign up</a> | Forgot{" "}
        <a href="/sign-in">password?</a>
      </p>
    </ValidatorForm>
  );
}

export default Login;
