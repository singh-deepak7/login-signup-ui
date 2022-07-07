import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbßar";
import MuiAlert from "@material-ui/lab/Alert";
import "./../App.css";

export default class Loader extends Component {
  render() {
    return this.props.loader ? (
      <div className="loader">
        <div style={{ height: "45vh" }}></div>
        <CircularProgress />
      </div>
    ) : (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={this.props.notification}
        autoHideDuration={5000}
        onClose={this.props.action}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={this.props.action}
          severity={this.props.message}
        >
          {this.props.validationMessage}
        </MuiAlert>
      </Snackbar>
    );
  }
}
