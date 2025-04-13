import { Button, Form, Input, ConfigProvider, message } from "antd"; // ⬅️ import message
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResetPasswordImg from "../../assets/samba/ResetPasswordImg.png";
import { useResetPasswordMutation } from "../../redux/apiSlices/authSlice";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get("email");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    if (!email) {
      console.error("Email is missing in URL");
      message.error("Email is missing. Please try resetting again."); // ⬅️ Show error
      return;
    }

    try {
      const response = await resetPassword({
        email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();

      console.log("Password Reset Success:", response);
      message.success("Password updated successfully! Please login."); // ⬅️ Show success
      navigate(`/auth/login`);
    } catch (err) {
      console.error("Reset Password Failed:", err);
      message.error(
        err?.data?.message || "Password reset failed. Please try again."
      ); // ⬅️ Show error from server or fallback
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border-r-2 border-sambaSD w-full h-[500px] flex items-center justify-center mr-4">
        <img src={ResetPasswordImg} width={400} alt="Reset Password" />
      </div>

      <div className="flex flex-col items-center justify-center w-full ml-4">
        <div className="text-center mb-4 w-full">
          <h1 className="text-[25px] text-white font-semibold mb-2">
            Set a new password
          </h1>
          <p className="text-[#C0C7CA]">
            Create a new password. Ensure it differs from previous ones for
            security.
          </p>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelColor: "white",
              },
              Input: {
                colorBgBase: "white",
                colorBgContainer: "#1f1f1f",
                hoverBorderColor: "white",
                activeBorderColor: "white",
                boxShadow: "none",
              },
            },
          }}
        >
          <Form layout="vertical" onFinish={onFinish} className="w-full">
            <Form.Item
              name="newPassword"
              label={
                <p className="text-base font-normal text-white">New Password</p>
              }
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                className="h-10 border rounded-lg outline-none text-white bg-sambaS mb-6"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <p className="text-base text-white font-normal">
                  Confirm Password
                </p>
              }
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The new passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Enter confirm password"
                className="h-10 border rounded-lg outline-none text-white bg-sambaS mb-6"
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                style={{
                  width: "100%",
                  height: 45,
                  color: "white",
                  fontWeight: 400,
                  fontSize: 18,
                  border: "1px solid #d99e1e",
                  background: "#d99e1e",
                  marginTop: 20,
                }}
                disabled={isLoading}
                className="flex items-center justify-center rounded-lg hover:bg-samba/90"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ResetPassword;
