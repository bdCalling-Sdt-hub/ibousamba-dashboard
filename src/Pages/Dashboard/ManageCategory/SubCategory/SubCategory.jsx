import React, { useEffect, useState } from "react";
import { ConfigProvider, Button, Select } from "antd";

import { FaPlus } from "react-icons/fa6";
import AddSubCategoryModal from "./AddSubCategoryModal";
import { MdOutlineArrowDropDown } from "react-icons/md";
import SubCategoryTable from "./SubCategoryTable";
import { useCategoryQuery } from "../../../../redux/apiSlices/categorySlice";

const { Option } = Select;

const SubCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const { data: categoryList } = useCategoryQuery();

  // Set first category as default selected
  useEffect(() => {
    const firstCategory = categoryList?.data?.result?.[0];
    if (firstCategory) {
      setSelectedCategory(firstCategory._id);
      setCategoryID(firstCategory._id);
    }
  }, [categoryList]);

  const showModal = (record = null) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryID(value);
  };

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
        {/* Select Category Dropdown */}
        <div className="mb-4 flex items-start justify-between">
          <div className="w-1/2 flex gap-4 items-center">
            <p className="text-[24px]">Select Category</p>
            <Select
              className="flex items-center gap-2 w-40 border rounded-md"
              suffixIcon={
                <MdOutlineArrowDropDown size={25} className="text-white" />
              }
              placeholder="Select a Category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categoryList?.data?.result?.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </div>
          <Button
            className="h-10 rounded-lg font-semibold mb-4"
            onClick={() => showModal()}
          >
            <FaPlus /> Add Sub Category
          </Button>
        </div>

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
          <SubCategoryTable categoryID={categoryID} />
        </ConfigProvider>

        {/* Modal Component */}
        <AddSubCategoryModal
          isModalOpen={isModalOpen}
          handleClose={handleClose}
          record={selectedRecord}
        />
      </div>
    </ConfigProvider>
  );
};

export default SubCategory;
