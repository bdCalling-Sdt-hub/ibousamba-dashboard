import React from "react";
import { useLocation } from "react-router-dom";

function GetPageName() {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop(); // Get last part of URL

  // Capitalize first letter and keep the rest lowercase
  const formattedPageName = pageName
    ? pageName.charAt(0).toUpperCase() + pageName.slice(1)
    : "";

  console.log(formattedPageName);
  return formattedPageName;
}

export default GetPageName;
