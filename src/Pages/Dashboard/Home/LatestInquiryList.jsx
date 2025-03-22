// import React from "react";
// import { Table, Avatar, ConfigProvider } from "antd";
// import { IoEye } from "react-icons/io5";
// import { useInquiryQuery } from "../../../redux/apiSlices/inquirySlice";
// import LatestInquiryDetailsModal from "./LatestInquiryDetailsModal";
// // import "" from "../../../assets/quiloco/"".png";

// // Add "#" to serial numbers using map

// const columns = [
//   {
//     title: "Serial",
//     dataIndex: "id",
//     key: "id",
//     render: (_, __, index) => `#${index + 1}`,
//   },
//   { title: "Full Name", dataIndex: "fullName", key: "fullName" },
//   { title: "User Email", dataIndex: "email", key: "email" },
//   {
//     title: "Inquiry Topics",
//     dataIndex: "description",
//     key: "description",
//   },
//   { title: "Phone Number", dataIndex: "phone", key: "phone" },
//   { title: "Date", dataIndex: "createdAt", key: "createdAt" },
//   {
//     title: "Action",
//     key: "action",
//     render: (_, record) => (
//       <div className="flex items-center gap-3">
//         <a
//           href="#"
//           className="hover:text-[#a11d26]"
//           onClick={(e) => {
//             e.preventDefault();
//             // showDetailsModal(record);
//           }}
//         >
//           <IoEye size={24} onClick={show modal}/>
//         </a>
//       </div>
//     ),
//   },
// ];

// function LatestInquiryList() {
//   const { data: latestInquiry } = useInquiryQuery();

//   console.log("88", latestInquiry?.data?.result);
//   const dataSorce = latestInquiry?.data?.result;

//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Table: {
//             headerBg: "#575858",
//             headerSplitColor: "none",
//             headerColor: "white",
//             borderColor: "#A3A3A3",
//             colorBgContainer: "#3a3a3a",
//             rowHoverBg: "#4a4a4a",
//             colorText: "white",
//           },
//         },
//       }}
//     >
//       <Table
//         size="middle"
//         dataSource={dataSorce}
//         columns={columns}
//         pagination={true}
//       />

//       <LatestInquiryDetailsModal />
//     </ConfigProvider>
//   );
// }

// export default LatestInquiryList;

import React, { useState } from "react";
import { Table, ConfigProvider } from "antd";
import { IoEye } from "react-icons/io5";
import { useInquiryQuery } from "../../../redux/apiSlices/inquirySlice";
import LatestInquiryDetailsModal from "./LatestInquiryDetailsModal";

function LatestInquiryList() {
  const { data: latestInquiry } = useInquiryQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const showDetailsModal = (record) => {
    setSelectedInquiry(record);
    setIsModalOpen(true);
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
    { title: "Inquiry Topics", dataIndex: "description", key: "description" },
    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(), // Formatting date
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <IoEye
            size={24}
            className="hover:text-[#a11d26] cursor-pointer"
            onClick={() => showDetailsModal(record)} // Show modal on click
          />
        </div>
      ),
    },
  ];

  return (
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
        size="middle"
        dataSource={latestInquiry?.data?.result || []}
        columns={columns}
        pagination={true}
        rowKey="_id"
      />

      {/* Inquiry Details Modal */}
      <LatestInquiryDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        inquiryData={selectedInquiry} // Passing selected inquiry
      />
    </ConfigProvider>
  );
}

export default LatestInquiryList;
