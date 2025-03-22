import { api } from "../api/baseApi";

const brancdSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/brand",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/brand/${id}`,
          method: "PATCH",
          body: data,
        };
      },
    }),
    deleteBrand: builder.mutation({
      query: (id) => {
        return {
          url: `/brand/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Brand"],
    }),
    brand: builder.query({
      query: () => ({
        url: "/brand",
        method: "GET",
        // };
      }),
      providesTags: ["Brand"],
    }),
  }),
});

export const {
  useBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brancdSlice;
