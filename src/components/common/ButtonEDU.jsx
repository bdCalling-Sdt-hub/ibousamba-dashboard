import React from "react";

const ButtonEDU = ({ actionType, onClick }) => {
  const getButtonStyles = () => {
    switch (actionType) {
      case "cancel":
        return "bg-transparent text-[#d99e1e] w-28 h-8 rounded-md border border-[#d99e1e] transition-all duration-300 hover:bg-[#d99e1e] hover:text-white";
      case "delete":
        return "bg-[#d99e1e] text-white w-28 h-8 rounded-md border border-[#d99e1e] hover:border-red-500 hover:bg-red-500 transition-all duration-300";
      case "save":
        return "bg-[#d99e1e] text-white w-28 h-8 rounded-md border border-[#d99e1e] transition-all duration-300 hover:bg-transparent hover:text-[#d99e1e]";
      case "add new":
        return "bg-[#d99e1e] text-white w-28 h-8 rounded-md border border-[#d99e1e] transition-all duration-300 hover:bg-transparent hover:text-[#d99e1e]";
      case "update":
        return "bg-[#d99e1e] text-white w-28 h-8 rounded-md border border-[#FFC301] transition-all duration-300 hover:bg-transparent hover:text-[#FFC301]";
      default:
        return "bg-[a11d26] text-[#FFC301] w-28 h-8 rounded-md border border-[#FFC301] transition-all duration-300 hover:bg-[#FFC301] hover:text-white";
    }
  };

  return (
    <button className={getButtonStyles()} onClick={onClick}>
      {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
    </button>
  );
};

export default ButtonEDU;
