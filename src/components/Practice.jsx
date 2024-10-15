import React from "react";
import Block from "./Block"; // Make sure the path is correct

const headingData = [
  {
    heading: "Run JSON Server",
    content: "npx json-server -w src/api/db.json --port 8080",
  },
  {
    heading: "Run Code",
    content: "npm run dev",
  },
];

const Practice = () => {
  return (
    <div>
      <h1>REACT QUERY</h1>
      {headingData.map((item, index) => (
        <Block key={index} heading={item.heading} content={item.content} />
      ))}
    </div>
  );
};

export default Practice;
