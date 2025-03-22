import React, { useState } from "react";
import { Table, ConfigProvider, Button } from "antd";
import { IoEye } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import AddCategoryModal from "./AddCategoryModal";
import MainCategoryTable from "./MainCategoryTable";

const MainCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const showModal = (record = null) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    { title: "Serial", dataIndex: "serial", key: "serial" },
    {
      title: "Image",
      dataIndex: "categoryImg",
      key: "categoryImg",
      render: (img) => <img src={img} alt="Category" style={{ width: 50 }} />,
    },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a
          href="#"
          className="hover:text-[#a11d26]"
          onClick={(e) => {
            e.preventDefault();
            showModal(record);
          }}
        >
          <IoEye size={24} />
        </a>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: "#d99e1e",
            defaultColor: "black",
            defaultBorderColor: "#d99e1e",
            defaultHoverBg: "#d99e1e",
            defaultHoverColor: "black",
            defaultHoverBorderColor: "#d99e1e",
            defaultActiveBg: "#d99e1e",
            defaultActiveColor: "black",
            defaultActiveBorderColor: "#d99e1e",
          },
        },
      }}
    >
      <div className="px-3">
        {/* Add Category Button */}
        <Button
          block
          className="h-10 rounded-lg font-semibold mb-4"
          onClick={() => showModal()}
        >
          <FaPlus /> Add Category
        </Button>

        {/* Table */}
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
          <MainCategoryTable />
        </ConfigProvider>

        {/* Modal Component */}
        <AddCategoryModal
          isModalOpen={isModalOpen}
          handleClose={handleClose}
          record={selectedRecord}
        />
      </div>
    </ConfigProvider>
  );
};

export default MainCategory;
