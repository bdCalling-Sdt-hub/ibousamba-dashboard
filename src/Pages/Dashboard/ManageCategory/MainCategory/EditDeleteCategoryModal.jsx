import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Upload,
  message,
  ConfigProvider,
  Image,
  Button,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
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
      setUploadedFile(null);
      setPreviewImage(record.image ? `${imageUrl}${record.image}` : "");
      setIsEditingImage(false);
    } else {
      setCategoryName("");
      setFileList([]);
      setUploadedFile(null);
      setPreviewImage("");
    }
  }, [visible, record]);

  const handleNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
        setUploadedFile(file);
      }
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5MB = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt5MB) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    return true; // Allow upload
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
          mode === "edit" ? (
            [
              <Button key="cancel" onClick={onCancel}>
                Cancel
              </Button>,
              <Button key="save" type="primary" onClick={handleSave}>
                Save
              </Button>,
            ]
          ) : (
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
            </div>
          )
        }
      >
        {mode === "edit" ? (
          <div>
            <div className="flex flex-col gap-1">
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
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                >
                  {fileList.length < 1 && (
                    <div className="w-full flex text-black items-center justify-center">
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              )}

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
