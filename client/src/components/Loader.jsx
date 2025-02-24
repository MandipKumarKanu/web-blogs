import React from "react";
import "./Loader.css";
const Loader = () => {
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-background">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
