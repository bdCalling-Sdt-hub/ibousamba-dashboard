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
  Select,
  Tooltip,
} from "antd";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { useCategoryQuery } from "../../../redux/apiSlices/categorySlice";

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
  const { data: getCategory, isError } = useCategoryQuery();
  console.log(getCategory?.data?.result);

  // Populate form when editing
  useEffect(() => {
    if (initialBrand) {
      form.setFieldsValue({
        name: initialBrand.name || "",
        brandUrl: initialBrand.brandUrl || "",
        category: initialBrand.category || [],
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

  // Validate file type and size
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5MB = file.size / 1024 / 1024 < 5;
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    if (!isLt5MB) {
      message.error("Image must be smaller than 5MB!");
    }
    return isImage && isLt5MB ? false : Upload.LIST_IGNORE;
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

      // Validate category
      if (!values.category || values.category.length === 0) {
        message.error("Please select at least one category");
        return;
      }

      // Prepare data for parent component
      const brandData = {
        name: values.name,
        brandUrl: values.brandUrl,
        category: values.category,
        imageFile: imageFile, // Send the file object to parent
        existingImage: initialBrand?.image || null, // Send existing image if available
      };

      handleSave(brandData);
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save brand information");
    }
  };

  const options = getCategory?.data?.result?.map((cat) => ({
    value: cat?._id,
    label: cat?.name,
  }));
  const handleChangeCategory = (value) => {
    console.log(`selected ${value}`);
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
          // Select: {
          //   multipleItemBg: "#d99e1e",
          //   multipleItemBorderColor: "transparent",
          //   multipleItemColor: "white",
          //   optionSelectedBg: "#f4e1b9",
          //   optionSelectedColor: "black",
          //   colorBgContainer: "#f4e1b9",
          //   colorBorder: "#d9d9d9",
          //   colorPrimaryHover: "#d99e1e",
          // },

          Select: {
            multipleItemBg: "black",
            multipleItemBorderColor: "gray",
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

            {/* Name field */}
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter a brand Name" }]}
            >
              <Input placeholder="Enter your Name" disabled={isLoading} />
            </Form.Item>

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

            <Form.Item
              label="Add Category"
              name="category"
              rules={[
                { required: true, message: "Please select a Category" },
                // Remove the second rule since it's redundant and not specifying a type
              ]}
            >
              {/* <Select
                mode="multiple"
                allowClear
                placeholder="Please select"
                defaultValue={[]}
                onChange={handleChangeCategory}
                options={options}
                className="overflow-auto"
                // Add these style props
                tagRender={(props) => (
                  <span
                    style={{
                      backgroundColor: "#d99e1e",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: 4,
                      marginRight: 4,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {props.label}
                    <span
                      style={{ marginLeft: 4, cursor: "pointer" }}
                      onClick={props.onClose}
                    >
                      ×
                    </span>
                  </span>
                )}
                style={{
                  width: "100%",
                }}
                dropdownStyle={{
                  backgroundColor: "#f4e1b9",
                }}
                tokenSeparators={[","]}
                maxTagCount="responsive"
              /> */}
              <Select
                mode="multiple"
                allowClear
                placeholder="Please select"
                defaultValue={[]}
                onChange={handleChangeCategory}
                options={options}
                className="bg-white rounded-md"
                tagRender={(props) => (
                  <span className="bg-[#d99e1e] text-white text-[14px] px-2 py-.5 rounded-full inline-flex items-center leading-5">
                    {props.label}
                    <span
                      className="ml-1.5 cursor-pointer text-xs"
                      onClick={props.onClose}
                    >
                      ×
                    </span>
                  </span>
                )}
                maxTagCount="responsive"
                maxTagPlaceholder={(omittedValues) => {
                  return (
                    <Tooltip
                      title={
                        <div className="space-y-1 ">
                          {omittedValues.map((value) => {
                            const option = options.find(
                              (opt) => opt.value === value.key
                            );
                            return (
                              <div
                                key={value.key}
                                className="bg-samba w-fit rounded-full px-2 py-.5 text-[14px] text-white leading-5"
                              >
                                {option?.label || value.key}
                              </div>
                            );
                          })}
                        </div>
                      }
                      overlayClassName="max-w-xs"
                      overlayInnerStyle={{
                        backgroundColor: "#f4e1b9",
                        color: "#000",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                      }}
                      color="#f4e1b9"
                    >
                      <span className="text-white cursor-pointer ml-1">
                        +{omittedValues.length} more...
                      </span>
                    </Tooltip>
                  );
                }}
                dropdownStyle={{
                  backgroundColor: "#f4e1b9",
                }}
                popupClassName="[&_.ant-select-item-option-selected]:bg-[#f4e1b9] [&_.ant-select-item-option-selected]:text-black"
              />
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
