import React, { useState } from "react";
import Notification from "./Notification";

const Block = ({ heading, content }) => {
  const [copy, setCopy] = useState(false);

  const handleClick = (text) => {
    const textToCopy = `${text}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopy(true);
        setTimeout(() => {
          setCopy(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div>
      <h2>{heading}</h2>
      <h3 onClick={() => handleClick(content)}>
        {content}
        <span style={{fontSize: "13px", marginLeft: "15px"}}>{copy ? "copied!" : "click to copy"}</span>
      </h3>
      {copy && <Notification message="Copied!" />}
    </div>
  );
};

export default Block;
