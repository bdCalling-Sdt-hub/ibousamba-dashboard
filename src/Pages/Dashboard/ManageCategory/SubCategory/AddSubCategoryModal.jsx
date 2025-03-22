import React, { useState } from "react";
import {
  Modal,
  ConfigProvider,
  Form,
  Input,
  Button,
  Image,
  Upload,
  Select,
  message,
} from "antd";
import { BiCloudUpload } from "react-icons/bi";
import { useCategoryQuery } from "../../../../redux/apiSlices/categorySlice";
import { useCreateSubCategoryMutation } from "../../../../redux/apiSlices/subCategorySlice";

const AddSubCategoryModal = ({ isModalOpen, handleClose }) => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data } = useCategoryQuery();
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [form] = Form.useForm(); // Ant Design Form instance

  const onFinish = (values) => {
    // Create FormData object
    const formData = new FormData();
    formData.append("categoryId", values.categoryId); // Selected category ID
    formData.append("name", values.subCategoryName); // Subcategory name

    // Add the image file if present
    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj); // Subcategory image
    }

    // Log FormData contents
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Send the FormData to the API
    createSubCategory(formData)
      .then((response) => {
        console.log("API Response:", response);
        message.success("Subcategory created successfully!");
        form.resetFields(); // Reset form on success
        setFileList([]); // Clear uploaded images
        handleClose(); // Close the modal
      })
      .catch((error) => {
        console.error("Error creating subcategory:", error);
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

  // Convert File to Base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
          Select: {
            selectorBg: "white",
            optionSelectedColor: "red",
          },
        },
      }}
    >
      <Modal
        title="Sub Category Details"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        closable
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="flex flex-col"
        >
          {/* Category Selection */}
          <Form.Item
            name="categoryId"
            rules={[{ required: true, message: "Select a Category" }]}
          >
            <div className="flex gap-2 mt-2">
              <p className="text-sm text-black">Select Category</p>
              <Select
                style={{ width: 120 }}
                placeholder="Select Category"
                onChange={(value) => form.setFieldsValue({ categoryId: value })}
              >
                {data?.data?.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Form.Item>

          {/* Image Upload */}
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

          {/* Image Preview */}
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

          {/* Subcategory Name */}
          <Form.Item
            label="Sub-Category Name"
            name="subCategoryName"
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

export default AddSubCategoryModal;
