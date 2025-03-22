import React, { useEffect, useState } from "react";
import {
  Modal,
  ConfigProvider,
  Form,
  Input,
  Button,
  Upload,
  Image,
  message,
  Spin,
} from "antd";
import { LiaCloudUploadAltSolid } from "react-icons/lia";

const AddBrandModal = ({
  isModalOpen,
  handleClose,
  handleSave,
  initialBrand,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (initialBrand) {
      form.setFieldsValue({
        brandUrl: initialBrand.brandUrl || "",
      });

      // Set preview image if available
      if (initialBrand.image) {
        setPreviewImage(initialBrand.image);
      } else {
        setPreviewImage("");
      }
    } else {
      form.resetFields();
      setPreviewImage("");
      setFileList([]);
    }
  }, [initialBrand, form]);

  // Handle Image Upload Change
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      setPreviewImage(URL.createObjectURL(newFileList[0].originFileObj));
    } else {
      setPreviewImage("");
    }
  };

  // Validate file type
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }

    // Return false to prevent auto upload
    return false;
  };

  // Handle Form Submit
  const onFinish = (values) => {
    try {
      // Get the image file if selected
      const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

      // Validate image requirement
      if (!imageFile && !initialBrand?.image) {
        message.error("Please upload an image");
        return;
      }

      // Prepare data for parent component
      const brandData = {
        brandUrl: values.brandUrl,
        imageFile: imageFile, // Send the file object to parent
        existingImage: initialBrand?.image || null, // Send existing image if available
      };

      console.log("Form data on save:", brandData);
      handleSave(brandData);
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save brand information");
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: { contentBg: "#f4e1b9", headerBg: "#f4e1b9" },
          Button: {
            defaultBg: "#d99e1e",
            defaultColor: "white",
            defaultHoverBg: "#d99e1e",
            defaultHoverColor: "white",
            defaultActiveBg: "#d99e1e",
            defaultActiveColor: "white",
          },
        },
      }}
    >
      <Modal
        title={initialBrand ? "Edit Brand" : "Add New Brand"}
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        closable={!isLoading}
        maskClosable={!isLoading}
      >
        <Spin spinning={isLoading} tip="Processing...">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            {/* Upload Component */}
            <Form.Item label="Brand Image" required>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                showUploadList={false}
                disabled={isLoading}
                accept="image/*"
              >
                {fileList.length >= 1 ? null : (
                  <div className="flex flex-col items-center">
                    <LiaCloudUploadAltSolid size={25} className="text-black" />
                    <p className="text-black">Click or drag file to upload</p>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* Image Preview */}
            {previewImage && (
              <Form.Item label="Preview">
                <div className="flex justify-center">
                  <Image src={previewImage} width={100} />
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      setFileList([]);
                      setPreviewImage("");
                    }}
                    className="ml-2"
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
              </Form.Item>
            )}

            {/* Brand URL field */}
            <Form.Item
              label="Brand URL"
              name="brandUrl"
              rules={[
                { required: true, message: "Please enter a brand URL" },
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input placeholder="https://example.com" disabled={isLoading} />
            </Form.Item>

            <Form.Item>
              <Button block htmlType="submit" disabled={isLoading}>
                {initialBrand ? "Update" : "Save"}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </ConfigProvider>
  );
};

export default AddBrandModal;
