import { api } from "../api/baseApi";

const policySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePolicy: builder.mutation({
      query: ({ data, policy }) => {
        return {
          url: `/setting?title=${policy}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Policy"],
    }),

    policy: builder.query({
      query: (policy) => ({
        url: `/setting?title=${policy}`,
        method: "GET",
        // };
      }),
      providesTags: ["Policy"],
    }),
  }),
});

export const { usePolicyQuery, useUpdatePolicyMutation } = policySlice;
