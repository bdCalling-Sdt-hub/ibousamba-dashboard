import React, { useState, useEffect } from "react";
import { Button, ConfigProvider, Form, Input, Upload, message } from "antd";
import { HiMiniPencil } from "react-icons/hi2";
import { imageUrl } from "../../../redux/api/baseApi";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/profileSlice";
import { MdPhotoCamera } from "react-icons/md";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { data: user } = useProfileQuery();
  console.log("dd", user?.data);

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultActiveColor: "#ffffff",
            defaultActiveBorderColor: "#a11d26",
            defaultActiveBg: "#a11d26",
            defaultHoverBg: "#d99e1e",
            defaultHoverColor: "#ffffff",
          },
        },
      }}
    >
      <div className="bg-quilocoP w-[50%] min-h-72 flex flex-col justify-start items-center px-4 rounded-lg">
        <div className="relative mt-6 flex flex-col items-center justify-center">
          <img
            src={
              uploadedImage
                ? URL.createObjectURL(uploadedImage)
                : `${imageUrl}${user?.data?.image}`
            }
            className="w-24 h-24 border border-slate-500 rounded-full object-cover"
          />
          {isEditing && (
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return Upload.LIST_IGNORE;
                }
                setUploadedImage(file); // Store the file directly
                return false; // Don't upload automatically
              }}
            >
              <button>
                <MdPhotoCamera
                  size={30}
                  className="text-samba absolute top-[4.5rem] left-[4.5rem] rounded-full bg-black p-1"
                />
              </button>
            </Upload>
          )}
          <h3 className="text-slate-50 text-xl mt-3">{user?.firstName}</h3>
        </div>
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                setUploadedImage(null); // Clear uploaded image if canceling
              }
            }}
            icon={
              !isEditing && <HiMiniPencil size={20} className="text-white" />
            }
            className="bg-samba/80 border-none text-white min-w-20 min-h-8 text-xs rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        <ProfileDetails
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          user={user}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      </div>
    </ConfigProvider>
  );
}

export default Profile;

const ProfileDetails = ({
  isEditing,
  setIsEditing,
  user,
  uploadedImage,
  setUploadedImage,
}) => {
  const [form] = Form.useForm();

  const [updateProfile, { isLoading, isError }] = useUpdateProfileMutation();

  // Reset form when user data changes or editing mode changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.data?.fullName,
        email: user?.data?.email,
        phone: user?.data?.phone,
        role: user?.data?.role,
      });
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    try {
      // Create a FormData object
      const formData = new FormData();

      // Add form values to FormData
      formData.append("fullName", values.name);
      formData.append("phone", values.phone);

      // Add image if it exists
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      // Log FormData for debugging
      // console.log("FORM DATA CONTENTS:");
      // for (const pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      // Important: Match the API structure - pass { data: formData }
      const response = await updateProfile({ data: formData }).unwrap();

      // console.log("Profile update response:", response);

      if (response.success) {
        message.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        message.error("Failed to updated");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultActiveColor: "#ffffff",
            defaultActiveBorderColor: "#a11d26",
            defaultActiveBg: "#a11d26",
            defaultHoverBg: "#d99e1e",
            defaultHoverColor: "#ffffff",
          },
          Form: {
            labelColor: "#efefef",
          },
          Input: {
            colorBgBase: "#1f1f1f",
            colorBgContainer: "#1f1f1f",
            colorBorder: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full"
      >
        <div className="flex justify-between gap-2 w-full">
          <Form.Item
            name="name"
            label={<p className="ml-1.5">Name</p>}
            className="w-full"
          >
            <Input
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
              readOnly={!isEditing}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={<p className="ml-1.5">Email</p>}
            className="w-full"
            rules={[
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
              readOnly
            />
          </Form.Item>
        </div>

        <div className="flex justify-between gap-2 w-full">
          <Form.Item
            name="phone"
            label={<p className="ml-1.5">Phone</p>}
            className="w-full"
          >
            <Input
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
              readOnly={!isEditing}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label={<p className="ml-1.5">Role</p>}
            className="w-full"
          >
            <Input
              className="bg-[1f1f1f] border-none h-12 text-slate-300"
              readOnly
            />
          </Form.Item>
        </div>

        {isEditing && (
          <Form.Item>
            <Button
              block
              htmlType="submit"
              loading={isLoading}
              className="bg-samba/80 border-none text-white min-w-20 min-h-10 text-xs rounded-lg"
            >
              Save Changes
            </Button>
          </Form.Item>
        )}
      </Form>
    </ConfigProvider>
  );
};
