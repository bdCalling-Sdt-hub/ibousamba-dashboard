import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Upload,
  message,
  ConfigProvider,
  Image,
  Button,
  Form,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { imageUrl } from "../../../../redux/api/baseApi";

const EditDeleteCategoryModal = ({
  visible,
  onCancel,
  onDelete,
  mode,
  record,
  onCategoryChange,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Reset state when modal opens or record changes
  useEffect(() => {
    if (visible && record) {
      setCategoryName(record.name || "");
      setFileList(
        record.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: `${imageUrl}${record.image}`,
              },
            ]
          : []
      );
      setUploadedFile(null); // Reset uploaded file
      setPreviewImage(record.image ? `${imageUrl}${record.image}` : "");
      setIsEditingImage(false);
    } else {
      // Clear state when modal closes
      setCategoryName("");
      setFileList([]);
      setUploadedFile(null);
      setPreviewImage("");
    }
  }, [visible, record]);

  const handleNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleUploadChange = ({ fileList: newFileList, file }) => {
    setFileList(newFileList);
    if (file.status !== "uploading") {
      setUploadedFile(file.originFileObj || file);

      // Create preview image
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => setPreviewImage(reader.result);
        reader.onerror = (error) => console.error("Error reading file:", error);
      }
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    setUploadedFile(file);
    return false; // Prevent auto upload
  };

  const handleSave = () => {
    if (!record) {
      message.error("No category selected");
      return;
    }

    onCategoryChange(uploadedFile, categoryName, record);
  };

  const handleEditClick = () => {
    setIsEditingImage(true);
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
        title={mode === "edit" ? "Edit Category" : "Delete Category"}
        open={visible}
        onCancel={onCancel}
        closable={true}
        footer={
          mode === "edit"
            ? [
                <Button key="cancel" onClick={onCancel}>
                  Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                  Save
                </Button>,
              ]
            : [
                <div
                  key="footer"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Button key="cancel" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button key="delete" type="primary" danger onClick={onDelete}>
                    Delete
                  </Button>
                </div>,
              ]
        }
      >
        {mode === "edit" ? (
          <div>
            <div className="flex flex-col gap-1">
              {/* Image Display/Upload */}
              {!isEditingImage ? (
                <div className="flex justify-center relative">
                  <Image
                    preview={false}
                    src={previewImage}
                    style={{ width: "100%", maxWidth: 200 }}
                    alt="Category"
                  />
                  <Button
                    onClick={handleEditClick}
                    className="absolute top-0 right-0"
                    icon={<EditOutlined />}
                    shape="circle"
                    size="large"
                  />
                </div>
              ) : (
                <div>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                  >
                    {fileList.length < 1 && (
                      <div className="w-full flex items-center justify-center">
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </div>
              )}

              {/* Category Name Input */}
              <div className="mb-4">
                <label className="block mb-2">Category Name</label>
                <Input
                  value={categoryName}
                  onChange={handleNameChange}
                  placeholder="Enter category name"
                  className="h-9"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-black my-2">
              Are you sure you want to delete the category{" "}
              <strong>{record?.name}</strong>?
            </p>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default EditDeleteCategoryModal;
