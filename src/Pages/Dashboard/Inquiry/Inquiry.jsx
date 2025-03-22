import React, { useState, useEffect } from "react";
import { Table, ConfigProvider, Select, Spin, Alert } from "antd";
import { IoEye } from "react-icons/io5";
import InquiryDetailsModal from "./InquiryDetailsModal";
import {
  useInquiryQuery,
  useDeleteInquiryMutation,
} from "../../../redux/apiSlices/inquirySlice";
import { MdDeleteForever } from "react-icons/md";
import InquiryDeleteModal from "./InquiryDeleteModal";
import Loading from "../../../components/Loading";

function Inquiry() {
  const { data: inquiries, isLoading, isError } = useInquiryQuery(); // Fetch inquiries

  console.log("inquiries=", inquiries?.data?.result);
  const details = inquiries?.data?.result || []; // Ensure it's always an array

  if (isLoading) return <Loading />;
  if (isError)
    return <Alert message="Failed to load inquiries!" type="error" />;

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
        <div className="flex items-center gap-4">
          <p className="text-sm text-samba py-4">Latest Inquiry List:</p>
          <Select
            placeholder="Select Category"
            className="border rounded-lg"
            style={{ width: 180 }}
            onChange={(value) => console.log(`selected ${value}`)}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Sub-Category"
            className="border rounded-lg"
            style={{ width: 220 }}
            onChange={(value) => console.log(`selected ${value}`)}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
        </div>
        {/* Passing details as a prop */}
        <InquiryTable inquiries={details} />
      </div>
    </ConfigProvider>
  );
}

export default Inquiry;

const InquiryTable = ({ inquiries }) => {
  const [localInquiries, setLocalInquiries] = useState(inquiries);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteInquiry, { isLoading }] = useDeleteInquiryMutation();

  useEffect(() => {
    setLocalInquiries(inquiries);
  }, [inquiries]);

  const showDetailsModal = (record) => {
    console.log("Selected Inquiry:", record);
    setSelectedInquiry(record);
    setIsDetailsModalOpen(true);
  };

  const showDeleteModal = (record) => {
    setSelectedInquiry(record);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedInquiry?._id) {
      try {
        console.log("Deleting inquiry with ID:", selectedInquiry._id);
        await deleteInquiry(selectedInquiry._id);
        setLocalInquiries((prev) =>
          prev.filter((inq) => inq._id !== selectedInquiry._id)
        );
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Failed to delete inquiry:", error);
      }
    } else {
      console.error("No valid ID found for deletion!");
    }
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => `#${index + 1}`,
    },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "User Email", dataIndex: "email", key: "email" },
    {
      title: "Inquiry Topics",
      dataIndex: "options",
      key: "options",
      render: (_, record) => {
        return (
          <div className="flex flex-wrap gap-2">
            {record.options.map((option, index) => (
              <p
                key={index}
                className="border border-gray-300 rounded-lg px-1 py-.5  text-white"
              >
                {option}
              </p>
            ))}
          </div>
        );
      },
    },

    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    { title: "Your Inquiry", dataIndex: "description", key: "description" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hover:text-[#a11d26]"
            onClick={(e) => {
              e.preventDefault();
              showDetailsModal(record);
            }}
          >
            <IoEye size={24} />
          </a>
          <a
            href="#"
            className="hover:text-[#a11d26]"
            onClick={(e) => {
              e.preventDefault();
              showDeleteModal(record);
            }}
          >
            <MdDeleteForever size={24} />
          </a>
        </div>
      ),
    },
  ];

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
        <Table
          columns={columns}
          dataSource={localInquiries}
          rowKey="_id"
          pagination={{
            defaultPageSize: 5,
            position: ["bottomRight"],
            size: "default",
            total: localInquiries.length,
          }}
        />
      </ConfigProvider>

      {/* Inquiry Details Modal */}
      {/* Inquiry Details Modal */}
      <InquiryDetailsModal
        isModalOpen={isDetailsModalOpen}
        setIsModalOpen={setIsDetailsModalOpen}
        inquiryData={selectedInquiry}
      />

      {/* Inquiry Delete Modal */}
      <InquiryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
        record={selectedInquiry}
      />
    </div>
  );
};
