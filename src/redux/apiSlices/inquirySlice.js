import { api } from "../api/baseApi";

const inquirySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createInquiry: builder.mutation({
      query: (categoryData) => ({
        url: "/inquiry",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Inquiry"],
    }),
    updateInquiry: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/inquiry/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Inquiry"],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => {
        return {
          url: `/inquiry/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Inquiry"],
    }),

    inquiryCount: builder.query({
      query: () => ({
        url: `/inquiry/count`,
        method: "GET",
      }),
      providesTags: ["Inquiry"],
    }),
    inquiryChartData: builder.query({
      query: (year) => ({
        url: `/inquiry/year?year=${year}`,
        method: "GET",
      }),
      providesTags: ["Inquiry"],
    }),

    inquiry: builder.query({
      query: () => ({
        url: `/inquiry`,
        method: "GET",
      }),
      providesTags: ["Inquiry"],
    }),
  }),
});

export const {
  useInquiryQuery,
  useInquiryCountQuery,
  useInquiryChartDataQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = inquirySlice;
