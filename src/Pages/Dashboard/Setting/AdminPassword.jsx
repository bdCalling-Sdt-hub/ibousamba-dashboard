import React from "react";
import { Form, Input, Card, ConfigProvider, message, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useChangePasswordMutation } from "../../../redux/apiSlices/authSlice";
import { useNavigate } from "react-router-dom";
function AdminPassword() {
  const [form] = Form.useForm(); // Form instance
  const navigate = useNavigate();
  // Handle cancel: Reset form fields
  const handleCancel = () => {
    form.resetFields();
    message.info("Password change cancelled.");
  };

  const [changePassword] = useChangePasswordMutation();
  // Form submission (onFinish handler)
  const onFinish = async (values) => {
    try {
      // Trim the values
      const trimmedValues = {
        currentPassword: values.currentPassword.trim(),
        newPassword: values.newPassword.trim(),
        confirmPassword: values.confirmPassword.trim(),
      };

      const response = await changePassword({
        oldPassword: trimmedValues.currentPassword,
        newPassword: trimmedValues.newPassword,
      });

      if (response.data.success) {
        navigate(`/auth/login`);
      } else {
        message.error("Failed to update password.");
      }

      // Replace this with an API call to update the password
      // Example: const response = await someApiCall(trimmedValues);

      message.success("Password updated successfully!");

      form.resetFields(); // Clear form after successful update
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Failed to update password.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: "#d99e1e",
            headerHeight: "30px",
            headerPadding: "5px",
          },
          Form: {
            labelFontSize: 16,
          },
          Input: {
            colorBgBase: "#1f1f1f",
            colorBgContainer: "#1f1f1f",
            colorBorder: "transparent",
            boxShadow: "none",
          },
          token: {
            colorBgContainer: "black",
          },
        },
      }}
    >
      <Card
        title="Change Password"
        bordered={false}
        style={{ width: 850, height: 460 }}
        className="w-full h-full flex flex-col text-white shadow-[0px_10px_100px_3px_rgba(0,_0,_0,_0.1)]"
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="h-auto flex flex-col items-center justify-evenly"
        >
          {/* Current Password */}
          <Form.Item
            label={<p className="text-white">Current Password</p>}
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please enter your current password!",
              },
            ]}
            className="w-[80%]"
          >
            <Input.Password
              placeholder="Enter current password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
            />
          </Form.Item>

          {/* New Password */}
          <Form.Item
            label={<p className="text-white">New Password</p>}
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
            className="w-[80%]"
          >
            <Input.Password
              placeholder="Enter new password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
            />
          </Form.Item>

          {/* Confirm New Password */}
          <Form.Item
            label={<p className="text-white">Confirm New Password</p>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
            className="w-[80%]"
          >
            <Input.Password
              placeholder="Confirm new password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
            />
          </Form.Item>

          {/* Buttons: Cancel & Save */}
          <Form.Item className="w-full">
            <div className="w-[90%] flex items-center justify-end gap-4">
              <Button className="bg-samba border-none" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-samba border-none" htmlType="submit">
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
  );
}

export default AdminPassword;
