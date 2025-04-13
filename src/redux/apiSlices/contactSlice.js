import { api } from "../api/baseApi";

const contactSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteContact: builder.mutation({
      query: (id) => {
        return {
          url: `/faq/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Contact"],
    }),
    contact: builder.query({
      query: (page, limit) => ({
        url: `/contact?page=${page}&limit=${limit}`, //?page=${page}&limit=${limit}
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
  }),
});

export const { useContactQuery, useDeleteContactMutation } = contactSlice;
