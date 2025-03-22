import React, { useState, useEffect } from "react";
import { Table, ConfigProvider, Select, Spin, Alert } from "antd";
import { IoEye } from "react-icons/io5";

import { MdDeleteForever } from "react-icons/md";

import ContactDetailsModal from "./ContactDetailsModal";
import ContactDeleteModal from "./ContactDeleteModal";

const Contact = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      dataIndex: "inquiryTopics",
      key: "inquiryTopics",
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
        <div className="px-3">
          <Table
            columns={columns}
            dataSource={rawdata} // Use local state here
            rowKey="id"
            // pagination={{
            //   defaultPageSize: 5,
            //   position: ["bottomRight"],
            //   size: "default",
            //   // total: localInquiries.length,
            // }}
          />
        </div>
      </ConfigProvider>
      {/* Inquiry Details Modal */}
      <ContactDetailsModal />
      {/* Inquiry Delete Modal */}
      <ContactDeleteModal />
    </div>
  );
};

export default Contact;

const rawdata = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    inquiryTopics: ["Inquiry 1", "Inquiry 2"],
    phone: "1234567890",
    description: "This is a sample inquiry.",
  },
];
