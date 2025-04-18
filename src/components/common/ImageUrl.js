export const getImageUrl = (path) => {
  if (!path) return ""; // handle undefined/null paths safely
  const strPath = String(path); // make sure it's a string

  if (strPath.startsWith("http://") || strPath.startsWith("https://")) {
    return strPath;
  } else {
    const baseUrl = "http://10.0.60.36:8011/";
    return `${baseUrl}${strPath.startsWith("/") ? strPath.slice(1) : strPath}`;
  }
};
