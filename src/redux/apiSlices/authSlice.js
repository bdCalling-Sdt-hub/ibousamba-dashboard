import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        const forgetToken = localStorage.getItem("forgetToken");
        return {
          method: "PATCH",
          url: "/auth/otp-verify",
          body: data,
          headers: {
            token: forgetToken,
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forgot-password-otp",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation({
      query: (value) => {
        const forgetOtpMatchToken = localStorage.getItem("forgetOtpMatchToken");
        return {
          method: "PATCH",
          url: "/auth/forgot-password-reset",
          body: value,
          headers: {
            token: forgetOtpMatchToken,
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/auth/change-password",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
          // headers: {
          //   token: forgetOtpMatchToken,
          // },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/update-profile",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/auth/get-profile",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      providesTags: ["Auth"],
      transformResponse: ({ user }) => {
        return user;
      },
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
