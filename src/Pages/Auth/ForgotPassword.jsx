import { Button, Form, Input, ConfigProvider } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import Forgotpassword from "../../assets/samba/ForgotPassword.png";
import { useForgotPasswordMutation } from "../../redux/apiSlices/authSlice";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const onFinish = async (values) => {
    console.log("Submitting email:", values.email);
    try {
      const response = await forgotPassword({ email: values.email }).unwrap();
      console.log("Forgot Password Success:", response);
      localStorage.setItem("forgetToken", response.data.forgetToken);
      navigate(`/auth/verify-otp?email=${values.email}`);
    } catch (err) {
      console.error("Forgot Password Error:", err);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border-r-2 border-sambaSD w-full h-[500px] flex items-center justify-center mr-4">
        <img src={Forgotpassword} width={400} />
      </div>
      <div className="flex flex-col items-center justify-center w-full ml-4">
        <div className="mb-8 w-full">
          <h1 className="text-[25px] text-white font-semibold mb-2">
            Forgot Password
          </h1>
          <p className="w-full text-[#C0C7CA]">
            Enter your email below to reset your password
          </p>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBgBase: "white",
                colorBgContainer: "#1f1f1f",
                hoverBorderColor: "white",
                activeBorderColor: "white",
                boxShadow: "none",
              },
            },
            token: {
              colorText: "white",
            },
          }}
        >
          <Form layout="vertical" onFinish={onFinish} className="w-full">
            <Form.Item
              label={<p className="text-base text-white font-normal">Email</p>}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input
                placeholder="Enter your email address"
                className="h-10 border rounded-lg outline-none text-white bg-sambaS"
              />
            </Form.Item>

            {error && (
              <p className="text-red-500 text-sm mb-2">
                {error?.data?.message ||
                  "Something went wrong. Please try again."}
              </p>
            )}

            <Form.Item>
              <button
                htmlType="submit"
                type="submit"
                style={{
                  width: "100%",
                  height: 45,
                  color: "white",
                  fontWeight: "400", // fixed this
                  fontSize: "18px",
                  marginTop: 20,
                }}
                className="flex items-center justify-center bg-samba hover:bg-samba/90 rounded-lg"
              >
                {isLoading ? "Sending..." : "Send Code"}
              </button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ForgotPassword;
