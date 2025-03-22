export const getImageUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.0.70.36:8011/";
    return `${baseUrl}/${path}`;
  }
};
