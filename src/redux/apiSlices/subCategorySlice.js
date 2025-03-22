import { api } from "../api/baseApi";

const subCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/sub-category",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/sub-category/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/sub-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),
    getSubCategories: builder.query({
      query: (categoryID) => ({
        url: `/sub-category/${categoryID}`,
        method: "GET",
      }),
      providesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategorySlice;
