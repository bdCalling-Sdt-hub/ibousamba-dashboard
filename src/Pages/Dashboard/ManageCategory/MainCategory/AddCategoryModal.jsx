import React, { useState } from "react";
import {
  Modal,
  ConfigProvider,
  Form,
  Input,
  Button,
  Image,
  Upload,
  message,
} from "antd";
import { BiCloudUpload } from "react-icons/bi";
import { useCreateCategoryMutation } from "../../../../redux/apiSlices/categorySlice";

const AddCategoryModal = ({ isModalOpen, handleClose, record }) => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form] = Form.useForm(); // Get form instance
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  // Convert File to Base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Preview Image Handler
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Handle Image Upload Change
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle Form Submit
  const onFinish = async (values) => {
    const formData = new FormData();
    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }
    formData.append("name", values.categoryName);

    try {
      const response = await createCategory(formData).unwrap();
      message.success("Category created successfully!");
      console.log("Response:", response);
      form.resetFields();
      setFileList([]);
      handleClose(); // Close the modal after saving, but no need to update any list
    } catch (error) {
      console.error("Category Creation Failed:", error);
      message.error("Failed to create category.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: "#f4e1b9",
            headerBg: "#f4e1b9",
          },
          Input: {
            hoverBorderColor: "none",
            activeBorderColor: "none",
          },
        },
      }}
    >
      <Modal
        title="Category Details"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        closable
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          className="flex flex-col gap-1"
        >
          {/* Upload Component */}
          <Form.Item>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              {fileList.length >= 1 ? null : (
                <div className="w-full flex items-center justify-center">
                  <div className="text-black flex flex-col items-center">
                    <BiCloudUpload size={25} />
                    Upload
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Single Image Preview */}
          {previewImage && (
            <Form.Item>
              <div className="flex justify-center">
                <Image
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                  style={{ width: "100%", maxWidth: 300 }}
                />
              </div>
            </Form.Item>
          )}

          {/* Category Name Input */}
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: "Enter your Category Name" }]}
          >
            <Input className="h-9" />
          </Form.Item>

          {/* Save Button */}
          <Form.Item>
            <Button block className="h-9" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default AddCategoryModal;
