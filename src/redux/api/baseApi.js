import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseUrl";

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
    return headers;
  },
});

// export const imageUrl = "http://10.0.60.36:8011/";
export const imageUrl = "https://api.atlanticmachineryequip.com/";

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Category",
    "SubCategory",
    "Brand",
    "Product",
    "FAQ",
    "Inquiry",
    "Profile",
    "Notification",
  ],
});
