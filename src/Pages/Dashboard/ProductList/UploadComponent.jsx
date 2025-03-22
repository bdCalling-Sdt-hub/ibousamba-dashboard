import React, { useState, useEffect } from "react";
import { Upload, Image, Button, message } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { RiUploadCloud2Line } from "react-icons/ri";

const UploadComponent = ({ onFileUpload, existingFiles }) => {
  const [fileList, setFileList] = useState([]);

  // Handle existing files for edit mode
  useEffect(() => {
    if (existingFiles && existingFiles.length > 0) {
      const formattedFiles = existingFiles.map((file, index) => ({
        uid: `-existing-${index}`,
        name: `existing-image-${index}.jpg`,
        status: "done",
        url: typeof file === "string" ? file : file.url || "",
        originFileObj: file,
      }));

      setFileList(formattedFiles);
    }
  }, [existingFiles]);

  // Custom request to simulate successful uploads
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const url = URL.createObjectURL(file); // Create a temporary URL for preview
      const uploadedFile = { url, name: file.name, uid: file.uid };

      onSuccess(uploadedFile, file);
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`${file.name} upload failed.`);
      onError(error);
    }
  };

  // Handle file change and ensure correct URLs
  const handleChange = ({ fileList }) => {
    const updatedFiles = fileList.map((file) => ({
      ...file,
      url:
        file.url ||
        (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
    }));

    setFileList(updatedFiles);

    // Send the successfully uploaded files to the parent
    onFileUpload(
      updatedFiles.filter((file) => file.status === "done" || file.url)
    );
  };

  // Handle file deletion
  const handleDelete = (file) => {
    const updatedList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedList);
    onFileUpload(updatedList); // Update parent state

    if (file.url && file.url.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }
  };

  // Validate file type and size
  const beforeUpload = (file) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    if (!isImage) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const uploadButton = (
    <div className="text-[#575858] flex flex-col items-center justify-center">
      <RiUploadCloud2Line size={30} />
      <div className="mt-3 leading-4">
        Drop your image here, or browse
        <br /> Jpeg, PNG are allowed
      </div>
    </div>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        multiple={true}
        accept="image/jpeg,image/png"
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {/* Display Uploaded Images Below */}
      <div className="mt-3 flex flex-col gap-2">
        {fileList.map((file) => (
          <div
            key={file.uid}
            className="w-full flex justify-between items-center border rounded-md p-1.5"
          >
            {file.url ? (
              <Image
                src={file.url}
                width={60}
                height={60}
                style={{ borderRadius: "5px", objectFit: "cover" }}
                fallback="https://placehold.co/60x60?text=No+Image"
                preview={true}
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded bg-[#1f1f1f] flex items-center justify-center text-[#575858]">
                No Image
              </div>
            )}

            <div className="flex-1 px-3 truncate">
              <p className="truncate m-0">{file.name}</p>
            </div>

            <Button
              onClick={() => handleDelete(file)}
              icon={<AiOutlineDelete size={20} />}
              className="bg-transparent border-none text-gray-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
