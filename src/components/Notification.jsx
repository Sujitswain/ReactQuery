import React from "react";
import ReactDOM from "react-dom";

const Notification = ({ message }) => {
  return ReactDOM.createPortal(
    <div className="notification">{message}</div>,
    document.getElementById("portal-root")
  );
};

export default Notification;
