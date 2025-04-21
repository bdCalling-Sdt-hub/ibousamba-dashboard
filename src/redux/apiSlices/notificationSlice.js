import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        return {
          url: `/notification?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["Notification"],
    }),
    read: builder.mutation({
      query: (id) => {
        return {
          url: `/api/v1/notification/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Notification"],
    }),
    readAll: builder.mutation({
      query: () => {
        return {
          url: `/api/v1/notification/read/all`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useNotificationQuery, useReadAllMutation, useReadMutation } =
  notificationSlice;
