import { api } from "../api/baseApi";

const profileSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/users/update-my-profile`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    profile: builder.query({
      query: () => ({
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
});

export const { useProfileQuery, useUpdateProfileMutation } = profileSlice;
