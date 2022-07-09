import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Loader from "./loader";
import CryptoJS from 'crypto-js';
import { postFetch } from "../http";
import Cookies from 'js-cookie';
import Config from './../config';

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
   
    let key1 = CryptoJS.enc.Utf8.parse('49346A3CD8BFD3F9100B4CE9DAED72B1');
    let iv = CryptoJS.enc.Utf8.parse('9836565498764147');
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(state.formData.password), key1, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
   
    const request = {
      "username" : state.formData.email,
      "password" : encrypted.toString()
    }

    await postFetch("/authenticate", request).then((data) =>{
      if(data.token){
        console.log("hello there");
        Cookies.set("state", CryptoJS.AES.encrypt(JSON.stringify(data), Config.secretPhrase));
        history('/appManager',data)
        //history.push("/appManager", data);
      }else{
        setTimeout(() => {
          setLoader({...loader, loader:false, notification:true,message:"error",validationMessage:data.message});
        },1000);
      }

    }).catch((e)=>{
      setTimeout(() => {
        setLoader({...loader, loader:false, notification:true,message:"error",validationMessage:"System Error: Please contact help."});
      },1000);
    });

    try{
      await localStorage.setItem('user-name', state.formData.email);
    } catch(error){
      setTimeout(() => {
        setLoader({
          ...loader,
          loader: false,
          notification: true,
          message: "error",
          validationMessage: "unable to set local storage",
        });
      }, 1000);
    };
    //setTimeout(() => {
      //setLoader({
       // ...loader,
       // loader: false,
       // notification: true,
      //  message: "success",
      //  validationMessage: "Success",
     // });
    //}, 1000);
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
          type="password"
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
