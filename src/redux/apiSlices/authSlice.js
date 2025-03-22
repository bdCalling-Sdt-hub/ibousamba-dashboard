import { api } from "../api/baseApi";

const forgetToken = localStorage.getItem("forgetToken");
const forgetOtpMatchToken = localStorage.getItem("forgetOtpMatchToken");

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/auth/otp-verify",
          body: data,
          headers: {
            // Authorization: `Bearer ${forgetToken}`,
            token: forgetToken,
          },
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
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
    }),
    resetPassword: builder.mutation({
      query: (value) => {
        return {
          method: "PATCH",
          url: "/auth/forgot-password-reset",
          body: value,
          headers: {
            token: forgetOtpMatchToken,
          },
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/auth/change-password",
          body: data,
          // headers: {
          //   Authorization: `Bearer ${JSON.parse(
          //     localStorage.getItem("token")
          //   )}`,
          // },
          // headers: {
          //   token: forgetOtpMatchToken,
          // },
        };
      },
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
