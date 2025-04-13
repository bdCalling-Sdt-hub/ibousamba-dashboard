import React, { useState } from "react";
import { Table, ConfigProvider } from "antd";
import { IoEye } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

import ContactDetailsModal from "./ContactDetailsModal";
import { useContactQuery } from "../../../redux/apiSlices/contactSlice";

const Contact = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [page, setPage] = useState(1);

  const { data: contactData, isLoading, isError } = useContactQuery(page);
  console.log(contactData);
  // Extract inquiries from API response
  const inquiries = contactData?.data?.result || [];

  const showDetailsModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailsModalOpen(true);
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "_id",
      key: "_id",
      render: (_, __, index) => `#${index + 1}`,
    },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    { title: "Description", dataIndex: "description", key: "description" },
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
              showDetailsModal(record); // Pass inquiry data to modal
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
        <div className="px-3">
          <div>
            <p className="text-samba text-base font-semibold mb-2">
              Get In Touch List:
            </p>
          </div>
          <div className="custom-table">
            <Table
              columns={columns}
              dataSource={inquiries}
              rowKey="_id"
              pagination={{
                onChange: (page) => setPage(page),
                showSizeChanger: false,
                pageSize: contactData?.meta?.page,
                total: contactData?.meta?.total,
                showTotal: (total, range) => (
                  <span className="text-white">{`Total ${total} items`}</span>
                ),
              }}
            />
          </div>
        </div>
      </ConfigProvider>

      {/* Inquiry Details Modal */}
      <ContactDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        inquiryData={selectedInquiry}
      />
    </div>
  );
};

export default Contact;
