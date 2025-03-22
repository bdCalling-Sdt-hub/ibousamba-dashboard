import { Button, Checkbox, Form, Input, ConfigProvider } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";
// import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      console.log("Login Success:", response);
      localStorage.setItem("token", JSON.stringify(response.data.accessToken));
      navigate("/");
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };

  return (
    <div className="w-[55%]">
      <div className="text-center mb-8">
        <h1 className="text-[25px] text-white font-semibold mb-1">
          Login to Account
        </h1>
        <p className="text-[#A3A3A3]">
          Please enter your email and password to continue
        </p>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              colorBgBase: "white",
              colorBgContainer: "#1f1f1f",
              // colorBorder: "transparent",
              hoverBorderColor: "white",
              activeBorderColor: "wgite",
              boxShadow: "none",
            },
          },
          token: {
            colorText: "white",
          },
        }}
      >
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label={
              <p className="text-white font-normal text-base">
                Enter Your Email
              </p>
            }
            rules={[
              {
                required: true,
                message: `Please Enter your email`,
              },
            ]}
          >
            <Input
              placeholder={`Enter Your email`}
              className="h-10 border rounded-lg outline-none text-white bg-sambaS"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<p className="text-white font-normal text-base">Password</p>}
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter your password"
              className="h-10 border rounded-lg outline-none text-white bg-sambaS"
            />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item
              style={{ marginBottom: 0 }}
              name="remember"
              valuePropName="checked"
            >
              <Checkbox className="text-[#A3A3A3]">Remember me</Checkbox>
            </Form.Item>

            <a
              className="login-form-forgot text-white hover:text-[#A3A3A3] font-semibold"
              href="/auth/forgot-password"
            >
              Forgot password
            </a>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <button
              htmlType="submit"
              type="submit"
              style={{
                width: "100%",
                height: 47,
                color: "white",
                fontWeight: "400px",
                fontSize: "18px",

                marginTop: 20,
              }}
              className="flex items-center justify-center bg-samba hover:bg-samba/90 rounded-lg text-base"
            >
              {/* {isLoading? < Spinner/> : "Sign in"} */} Sign in
            </button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Login;
