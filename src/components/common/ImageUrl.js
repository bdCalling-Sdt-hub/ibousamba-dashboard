import { getBaseUrl } from "../../utils/baseUrl";
export const getImageUrl = (path) => {
  if (!path) return ""; // handle undefined/null paths safely
  const strPath = String(path); // make sure it's a string

  if (strPath.startsWith("http://") || strPath.startsWith("https://")) {
    return strPath;
  } else {
    // const baseUrl = "https://sohag500.binarybards.online/";
    const baseUrl = "http://10.0.60.36:5000/";
    // const baseUrl = "https://api.atlanticmachineryequip.com/";
    // const baseUrl = getBaseUrl();
    return `${baseUrl}${strPath.startsWith("/") ? strPath.slice(1) : strPath}`;
  }
};
