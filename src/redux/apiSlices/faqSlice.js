import { api } from "../api/baseApi";

const faqSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFaq: builder.mutation({
      query: (faq) => ({
        url: "/faq",
        method: "POST",
        body: faq,
      }),
      invalidatesTags: ["FAQ"],
    }),
    updateFaq: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/faq/${id}`,
          method: "PATCH",
          body: data,
        };
      },
    }),
    deleteFaq: builder.mutation({
      query: (id) => {
        return {
          url: `/faq/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["FAQ"],
    }),
    faq: builder.query({
      query: () => ({
        url: `/faq`,
        method: "GET",
        // };
      }),
      providesTags: ["FAQ"],
    }),
  }),
});

export const {
  useFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqSlice;
