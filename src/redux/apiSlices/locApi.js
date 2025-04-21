import { api } from "../api/baseApi";

const geoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLoc: builder.query({
      query: ({ long, lat }) => {
        return {
          url: `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${long}`,
          method: "GET",
        };
      },
      invalidatesTags: ["Loc"],
    }),
  }),
});

export const { useGetLocQuery } = geoApi;
