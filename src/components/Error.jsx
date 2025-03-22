import React from "react";
import warning from "../assets/samba/warning.png";

function Error({ msg }) {
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <p className="bg-red-400 text-white px-4 py-2 rounded-md">{msg}</p>
      <div className="flex justify-center items-center py-10">
        <div className="relative flex justify-center items-center">
          <div className="animate-ping absolute rounded-full h-12 w-12 bg-red-400 opacity-75"></div>
          <img src={warning} width={50} className="relative z-10" />
        </div>
      </div>
    </div>
  );
}

export default Error;
