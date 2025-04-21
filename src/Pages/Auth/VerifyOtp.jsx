import { Button, Form, Typography, message } from "antd"; // <-- ADD message import
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate, useLocation } from "react-router-dom";
import VerifyOTP from "../../assets/samba/VerifyOTP.png";
import {
  useOtpVerifyMutation,
  useForgotPasswordMutation,
} from "../../redux/apiSlices/authSlice";

const { Text } = Typography;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const [otp, setOtp] = useState("");
  const [otpVerify, { isLoading, error }] = useOtpVerifyMutation();
  const [forgotPassword, { isLoading: resendLoading }] =
    useForgotPasswordMutation();

  const handleOtpChange = (value) => {
    // console.log("Current OTP input:", value);
    setOtp(value);
  };

  const onFinish = async () => {
    // console.log("Raw OTP string:", otp);

    if (otp.length !== 6) {
      // console.error("OTP must be 6 digits");
      message.error("OTP must be exactly 6 digits"); // <-- ADD error message
      return;
    }

    try {
      const response = await otpVerify({ otp }).unwrap();
      // console.log("OTP Verification Success:", response);

      localStorage.setItem(
        "forgetOtpMatchToken",
        response.data.forgetOtpMatchToken
      );

      if (response.success) {
        message.success("OTP Verified Successfully!"); // <-- ADD success message
        navigate(`/auth/reset-password?email=${email}`);
      }
    } catch (err) {
      console.error("OTP Verification Failed:", err);
      message.error(err?.data?.message || "OTP Verification Failed"); // <-- ADD error message
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      // console.error("Email is missing. Cannot resend OTP.");
      message.error("Email not found. Please try again."); // <-- ADD error message
      return;
    }

    try {
      const resendOTP = await forgotPassword({ email }).unwrap();
      // console.log("OTP Resent Successfully");
      // console.log("Resend OTP Response:", resendOTP);
      message.info("OTP Resent to your email."); // <-- ADD info message
    } catch (err) {
      // console.error("OTP Resend Failed:", err);
      message.error(err?.data?.message || "Failed to resend OTP"); // <-- ADD error message
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border-r-2 border-sambaSD w-full h-[500px] flex items-center justify-center mr-4">
        <img src={VerifyOTP} width={400} alt="Verify OTP" />
      </div>
      <div className="flex flex-col items-center justify-center w-full ml-4">
        <div className="text-center mb-6">
          <h1 className="text-[25px] text-white font-semibold mb-2">
            Verify OTP
          </h1>
          <p className="w-[80%] mx-auto text-[#A3A3A3]">
            We've sent a verification code to your email. Check your inbox and
            enter the code below.
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <div className="flex items-center justify-center mb-6">
            <OTPInput
              value={otp}
              name="otp"
              onChange={handleOtpChange}
              numInputs={6}
              inputStyle={{
                height: 50,
                width: 50,
                background: "transparent",
                borderRadius: "8px",
                margin: "10px",
                fontSize: "20px",
                border: "1px solid #d99e1e",
                color: "white",
                outline: "none",
                marginBottom: 10,
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>

          {error && (
            <Text className="text-red-500">
              {error?.data?.message || "Invalid OTP"}
            </Text>
          )}

          <div className="flex items-center justify-between mb-6">
            <Text className="text-[#A3A3A3]">Didn't receive the code?</Text>
            <p
              onClick={handleResendEmail}
              className="font-medium cursor-pointer text-[#d99e1e]"
            >
              {resendLoading ? "Resending..." : "Resend"}
            </p>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              htmlType="submit"
              style={{
                width: "100%",
                height: 45,
                border: "1px solid #d99e1e",
                background: "#d99e1e",
                color: "white",
              }}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtp;
