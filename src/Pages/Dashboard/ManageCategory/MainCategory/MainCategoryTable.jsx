import { useState } from "react";
import { Table, ConfigProvider, message, Spin } from "antd"; // Import the Spin component
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import EditDeleteCategoryModal from "./EditDeleteCategoryModal";
import {
  useCategoryQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../../redux/apiSlices/categorySlice";
import { imageUrl } from "../../../../redux/api/baseApi";
import Loading from "../../../../components/Loading";

const MainCategoryTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("edit"); // "edit" or "delete"
  const [currentRecord, setCurrentRecord] = useState(null);

  const { data, isLoading: isCategoryLoading } = useCategoryQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const handleClose = () => {
    setIsModalVisible(false);
    setCurrentRecord(null); // Clear the current record when closing
  };

  const handleDeleteCategory = async () => {
    if (!currentRecord || !currentRecord._id) {
      message.error("Invalid category selected");
      return;
    }

    try {
      const response = await deleteCategory(currentRecord._id);
      message.success(`Successfully deleted`);
      console.log("Category Deletion Response:", response);
      setIsModalVisible(false);
      setCurrentRecord(null); // Clear the current record after deletion
    } catch (err) {
      console.log("Category Deletion Error:", err);
      message.error("Failed to delete category");
    }
  };

  const handleEditCategory = async (file, updatedName, record) => {
    if (!record || !record._id) {
      message.error("Invalid category selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", updatedName);

      if (file) {
        formData.append("image", file);
      }

      const response = await updateCategory({
        id: record._id,
        data: formData,
      }).unwrap();

      message.success("Successfully updated category");
      console.log("Category Update Response:", response);
      setIsModalVisible(false);
      setCurrentRecord(null);
    } catch (err) {
      console.log("Category Update Error:", err);
      message.error(
        "Failed to update category: " + (err.message || "Unknown error")
      );
    }
  };

  const columns = [
    {
      title: "#Sl",
      key: "serial",
      dataIndex: "serial",
      render: (item, record, index) => <>{`#${index + 1}`}</>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <img
          src={`${imageUrl}${record?.image}`}
          alt="Category"
          style={{ width: 50 }}
        />
      ),
    },
    { title: "Category", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => openEditModal(record)}
          >
            <FiEdit size={20} />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => openDeleteModal(record)}
          >
            <MdDeleteOutline size={25} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const openEditModal = (record) => {
    setModalMode("edit");
    setCurrentRecord({ ...record });
    setIsModalVisible(true);
  };

  const openDeleteModal = (record) => {
    setModalMode("delete");
    setCurrentRecord({ ...record });
    setIsModalVisible(true);
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#575858",
              headerSplitColor: "none",
              headerColor: "white",
              borderColor: "#A3A3A3",
              colorBgContainer: "#3a3a3a",
              rowHoverBg: "#4a4a4a",
              colorText: "white",
            },
          },
        }}
      >
        <div className="custom-table">
          {/* Show the spinner while category data is loading */}
          {isCategoryLoading ? (
            <Loading />
          ) : (
            <Table
              columns={columns}
              dataSource={data?.data}
              rowKey="_id"
              pagination={{
                defaultPageSize: 5,
                position: ["bottomRight"],
                size: "default",
                total: data?.data?.length || 0,
              }}
            />
          )}
        </div>
      </ConfigProvider>

      {/* Modal for Edit and Delete */}
      <EditDeleteCategoryModal
        visible={isModalVisible}
        onCancel={handleClose}
        onDelete={handleDeleteCategory}
        mode={modalMode}
        record={currentRecord}
        onCategoryChange={handleEditCategory}
      />
    </div>
  );
};

export default MainCategoryTable;
