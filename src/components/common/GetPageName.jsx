// function GetPageName() {
//   const location = useLocation();
//   const pageName = location.pathname.split("/").pop(); // Get last part of URL

//   // Capitalize first letter and keep the rest lowercase
//   const formattedPageName = pageName
//     ? pageName.charAt(0).toUpperCase() + pageName.slice(1)
//     : "";

//   console.log(formattedPageName);
//   return formattedPageName;
// }

// export default GetPageName;

import React from "react";
import { useLocation } from "react-router-dom";
const getPageName = () => {
  const location = useLocation();
  const path = location.pathname;
  if (path === "/") return "Dashboard";

  const pageName = path.substring(1).split("/").pop();
  return pageName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default getPageName;
