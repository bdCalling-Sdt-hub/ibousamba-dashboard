import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Upload, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { imageUrl } from "../../../../redux/api/baseApi";

const EditSubCategoryModal = ({ visible, onCancel, onOk, record }) => {
  const [categoryName, setCategoryName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Reset modal content whenever the `record` changes (to avoid stale state)
  useEffect(() => {
    if (record) {
      setCategoryName(record?.category || "");
      setPreviewImage(record?.categoryImg || ""); // Default to placeholder if no image
      setFileList([]); // Clear the file list initially
    }
  }, [record]);

  const handleClose = () => {
    setCategoryName(""); // Clear fields when closing the modal
    setFileList([]);
    setPreviewImage("");
    setIsEditingImage(false);
    onCancel();
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", categoryName);
    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj); // Add the file to the form data
    }

    // Log the updated category name and image
    console.log("Updated Category Name:", categoryName);
    if (fileList.length > 0) {
      console.log("Updated Image:", fileList[0].originFileObj);
    }

    onOk(formData);
    handleClose();
  };

  const handlePreview = async (file) => {
    setPreviewImage(URL.createObjectURL(file.originFileObj));
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      handlePreview(newFileList[0]);
      console.log("Image Changed:", newFileList[0].originFileObj); // Log the updated image
    }
  };

  return (
    <Modal
      title="Edit Sub-Category"
      open={visible}
      onCancel={handleClose}
      onOk={handleSave}
      closable={false}
      footer={null}
    >
      {/* Display Image preview or Upload option */}
      {!isEditingImage ? (
        <div className="flex justify-center relative">
          <Image
            preview={false}
            src={`${imageUrl}${previewImage}`}
            style={{ width: "100%", maxWidth: 200 }}
          />
          <Button
            onClick={() => setIsEditingImage(true)}
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
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : <div>Upload</div>}
        </Upload>
      )}

      {/* Input for category name */}
      <Input
        value={categoryName}
        onChange={(e) => {
          setCategoryName(e.target.value);
          console.log("Category Name Changed:", e.target.value); // Log the updated name
        }}
        className="h-9 mt-3"
      />

      {/* Save button */}
      <Button block className="h-9 mt-4" onClick={handleSave}>
        Save
      </Button>
    </Modal>
  );
};

export default EditSubCategoryModal;
