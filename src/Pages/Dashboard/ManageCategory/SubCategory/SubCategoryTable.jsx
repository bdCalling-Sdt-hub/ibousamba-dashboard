// import { useState } from "react";
// import { Table, ConfigProvider, Alert, message, Modal } from "antd";
// import { FiEdit } from "react-icons/fi";
// import { MdDeleteOutline } from "react-icons/md";

// import EditDeleteSubCategoryModal from "./EditDeleteSubCategoryModal";
// import {
//   useDeleteSubCategoryMutation,
//   useGetSubCategoriesQuery,
//   useUpdateSubCategoryMutation,
// } from "../../../../redux/apiSlices/subCategorySlice";
// import { imageUrl } from "../../../../redux/api/baseApi";

// const SubCategoryTable = ({ categoryID }) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalMode, setModalMode] = useState("edit"); // "edit" or "delete"
//   const [currentRecord, setCurrentRecord] = useState(null);
//   const [categoryName, setCategoryName] = useState("");

//   const [deleteSubCategory, { isLoading: isDeleting }] =
//     useDeleteSubCategoryMutation();
//   const [updateSubCategory, { isLoading: isUpdating }] =
//     useUpdateSubCategoryMutation();

//   // Fetch subcategories from API only if categoryID is valid
//   const { data, isLoading, error } = useGetSubCategoriesQuery(categoryID, {
//     skip: !categoryID, // Skip the query if categoryID is undefined
//   });

//   // Transform API data for table
//   const subCategoryData =
//     data?.data?.map((item, index) => ({
//       key: item._id,
//       serial: String(index + 1).padStart(3, "0"),
//       categoryImg: item.image || "https://via.placeholder.com/50", // Fallback Image
//       category: item.name,
//     })) || [];

//   // Delete subcategory
//   const handleDeleteSubCategory = async () => {
//     if (!currentRecord) return;

//     try {
//       await deleteSubCategory(currentRecord.key).unwrap();
//       message.success(`Successfully deleted`);
//       setIsModalVisible(false);
//     } catch (err) {
//       console.error("Category Deletion Error:", err);
//       message.error("Failed to delete category");
//     }
//   };

//   // Edit Sub Category
//   const handleEditSubCategory = async (formData) => {
//     if (!currentRecord) return;

//     // Log FormData contents
//     for (let pair of formData.entries()) {
//       console.log("sss", pair[0], pair[1]);
//     }

//     try {
//       const response = await updateSubCategory({
//         id: currentRecord.key,
//         updatedData: formData, // Send formData
//       }).unwrap();

//       console.log("Sub-Category Updated Response:", response);
//       setIsModalVisible(false);
//     } catch (err) {
//       console.error("Error updating subcategory:", err);
//       message.error("Failed to update sub-category");
//     }
//   };

//   const columns = [
//     {
//       title: "#Sl",
//       key: "serial",
//       dataIndex: "serial",
//       render: (item, record, index) => <>{`#${index + 1}`}</>,
//     },
//     {
//       title: "Image",
//       dataIndex: "categoryImg",
//       key: "categoryImg",
//       render: (_, record) => (
//         <img
//           src={`${imageUrl}${record?.categoryImg}`}
//           alt="Category"
//           style={{ width: 50 }}
//         />
//       ),
//     },
//     { title: "Sub-Category", dataIndex: "category", key: "category" },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <div className="flex items-center gap-3">
//           <button
//             className="btn btn-sm btn-outline-primary"
//             onClick={() => openEditModal(record)}
//           >
//             <FiEdit size={20} />
//           </button>
//           <button
//             className="btn btn-sm btn-outline-primary"
//             onClick={() => openDeleteModal(record)}
//           >
//             <MdDeleteOutline size={25} className="text-red-600" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const openEditModal = (record) => {
//     setModalMode("edit");
//     setCurrentRecord(record);
//     setCategoryName(record.category);
//     setIsModalVisible(true);
//   };

//   const openDeleteModal = (record) => {
//     setModalMode("delete");
//     setCurrentRecord(record);
//     setIsModalVisible(true);
//   };

//   return (
//     <div>
//       {error && (
//         <Alert
//           message="Error fetching subcategories"
//           description={error.message}
//           type="error"
//           showIcon
//           className="mb-4"
//         />
//       )}

//       <ConfigProvider
//         theme={{
//           components: {
//             Modal: {
//               contentBg: "#f4e1b9",
//               headerBg: "#f4e1b9",
//             },
//             Table: {
//               headerBg: "#575858",
//               headerSplitColor: "none",
//               headerColor: "white",
//               borderColor: "#A3A3A3",
//               colorBgContainer: "#3a3a3a",
//               rowHoverBg: "#4a4a4a",
//               colorText: "white",
//             },
//           },
//         }}
//       >
//         <div className="custom-table">
//           <Table
//             columns={columns}
//             dataSource={subCategoryData}
//             loading={isLoading}
//             pagination={{
//               defaultPageSize: 5,
//               position: ["bottomRight"],
//               size: "default",
//               total: subCategoryData.length,
//             }}
//           />
//         </div>

//         {/* Confirm Delete Modal */}
//         <Modal
//           title="Delete Sub-Category"
//           open={modalMode === "delete" && isModalVisible}
//           onOk={handleDeleteSubCategory}
//           onCancel={() => setIsModalVisible(false)}
//           confirmLoading={isDeleting}
//           okText="Delete"
//           okButtonProps={{ danger: true }}
//         >
//           <p className="text-black">
//             Are you sure you want to delete <b>{currentRecord?.category}</b>?
//           </p>
//         </Modal>

//         {/* Edit Modal */}
//         {modalMode === "edit" && (
//           <EditDeleteSubCategoryModal
//             visible={isModalVisible}
//             onCancel={() => setIsModalVisible(false)}
//             onOk={handleEditSubCategory} // Pass the edit function
//             mode="edit"
//             record={currentRecord}
//             categoryName={categoryName}
//             onCategoryChange={(name) => setCategoryName(name)}
//             confirmLoading={isUpdating}
//           />
//         )}
//       </ConfigProvider>
//     </div>
//   );
// };

// export default SubCategoryTable;

import { useState } from "react";
import { Table, ConfigProvider, Alert, message, Modal } from "antd";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import EditSubCategoryModal from "./EditDeleteSubCategoryModal"; // Make sure you import the modal here
import {
  useDeleteSubCategoryMutation,
  useGetSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from "../../../../redux/apiSlices/subCategorySlice";
import { imageUrl } from "../../../../redux/api/baseApi";

const SubCategoryTable = ({ categoryID }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("edit"); // "edit" or "delete"
  const [currentRecord, setCurrentRecord] = useState(null);

  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryMutation();

  // Fetch subcategories from API only if categoryID is valid
  const { data, isLoading, error } = useGetSubCategoriesQuery(categoryID, {
    skip: !categoryID, // Skip the query if categoryID is undefined
  });

  // Transform API data for table
  const subCategoryData =
    data?.data?.map((item, index) => ({
      key: item._id,
      serial: String(index + 1).padStart(3, "0"),
      categoryImg: item.image || "https://via.placeholder.com/50", // Fallback Image
      category: item.name,
    })) || [];

  // Delete subcategory
  const handleDeleteSubCategory = async () => {
    if (!currentRecord) return;

    try {
      await deleteSubCategory(currentRecord.key).unwrap();
      message.success(`Successfully deleted`);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Category Deletion Error:", err);
      message.error("Failed to delete category");
    }
  };

  // Edit Sub Category
  const handleEditSubCategory = async (formData) => {
    if (!currentRecord) return;

    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log("sss", pair[0], pair[1]);
    }

    try {
      const response = await updateSubCategory({
        id: currentRecord.key,
        updatedData: formData, // Send formData
      }).unwrap();

      if (response.success) {
        message.success("Sub-Category updated successfully");
      }

      console.log("Sub-Category Updated Response:", response);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error updating subcategory:", err);
      message.error("Failed to update sub-category");
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
      dataIndex: "categoryImg",
      key: "categoryImg",
      render: (_, record) => (
        <img
          src={`${imageUrl}${record?.categoryImg}`}
          alt="Category"
          style={{ width: 50 }}
        />
      ),
    },
    { title: "Sub-Category", dataIndex: "category", key: "category" },
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
    console.log("Opening Edit Modal with record:", record); // Check if record has category and image
    setModalMode("edit");
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const openDeleteModal = (record) => {
    setModalMode("delete");
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  return (
    <div>
      {error && (
        <Alert
          message="Error fetching subcategories"
          description={error.message}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <ConfigProvider
        theme={{
          components: {
            Modal: {
              contentBg: "#f4e1b9",
              headerBg: "#f4e1b9",
            },
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
          <Table
            columns={columns}
            dataSource={subCategoryData}
            loading={isLoading}
            pagination={{
              defaultPageSize: 5,
              position: ["bottomRight"],
              size: "default",
              total: subCategoryData.length,
            }}
          />
        </div>

        {/* Confirm Delete Modal */}
        <Modal
          title="Delete Sub-Category"
          open={modalMode === "delete" && isModalVisible}
          onOk={handleDeleteSubCategory}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={isDeleting}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p className="text-black">
            Are you sure you want to delete <b>{currentRecord?.category}</b>?
          </p>
        </Modal>

        {/* Edit Modal */}
        {modalMode === "edit" && (
          <EditSubCategoryModal
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleEditSubCategory} // Pass the edit function
            record={currentRecord}
          />
        )}
      </ConfigProvider>
    </div>
  );
};

export default SubCategoryTable;
