import React from "react";
import { Outlet } from "react-router-dom";
// import backgroundImage from '../../assets/backgroundImage.png';

const Auth = () => {
  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          //   backgroundImage: `url('${backgroundImage}')`,
          backgroundColor: "#292929 ",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      ></div>

      <div
        className="flex items-center justify-center"
        style={{
          background: "#292929",
          padding: 30,
          borderRadius: 10,
          width: 1000,
          position: "relative",
          zIndex: 2,
        }}
        // className="shadow-xl"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
