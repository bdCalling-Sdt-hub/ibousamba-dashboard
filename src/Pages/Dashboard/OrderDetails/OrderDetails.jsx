// import React, { useState } from "react";
// import { Table, Avatar } from "antd";
// import { IoEye } from "react-icons/io5";
// import OrderDetailsModal from "./OrderDetailsModal";

// function OrderDetails() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true); // This will open the modal
//   };

//   const dataSource = rawData.map((item) => ({
//     ...item,
//     serial: `#${item.serial}`,
//   }));

//   const columns = [
//     {
//       title: "Serial",
//       dataIndex: "serial",
//       key: "serial",
//     },
//     {
//       title: "Product Name",
//       dataIndex: "productname",
//       key: "productname",
//       render: (_, record) => (
//         <div className="flex items-center gap-2">
//           <Avatar shape="square" size="default" src={record.pic} />
//           <span>{record.productname}</span>
//         </div>
//       ),
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "customername",
//       key: "customername",
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//     },
//     {
//       title: "Ammount",
//       dataIndex: "ammount",
//       key: "ammount",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: () => (
//         <a
//           href="#"
//           className="hover:text-[#a11d26]"
//           onClick={showModal} // This should now work
//         >
//           <IoEye size={24} />
//         </a>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div>
//         <Table dataSource={dataSource} columns={columns} pagination={false} />
//       </div>
//       <OrderDetailsModal
//         data={columns}
//         isModalOpen={isModalOpen}
//         setIsModalOpen={setIsModalOpen} // Pass the setter to close the modal
//       />
//     </>
//   );
// }

// export default OrderDetails;

// const rawData = [
//   {
//     key: "1",
//     serial: "001",
//     productname: "Wireless Mouse",
//     customername: "Michael Johnson",
//     date: "2024-02-20",
//     ammount: "$25.99",
//     status: "Delivered",
//     pic: "https://via.placeholder.com/50",
//   },
//   {
//     key: "2",
//     serial: "002",
//     productname: "Mechanical Keyboard",
//     customername: "John Smith",
//     date: "2024-02-18",
//     ammount: "$79.99",
//     status: "Pending",
//     pic: "https://via.placeholder.com/50",
//   },
//   {
//     key: "3",
//     serial: "003",
//     productname: "Gaming Headset",
//     customername: "Emily Brown",
//     date: "2024-02-15",
//     ammount: "$49.99",
//     status: "Shipped",
//     pic: "https://via.placeholder.com/50",
//   },
//   {
//     key: "4",
//     serial: "004",
//     productname: "USB-C Docking Station",
//     customername: "Daniel Wilson",
//     date: "2024-02-12",
//     ammount: "$129.99",
//     status: "Processing",
//     pic: "https://via.placeholder.com/50",
//   },
//   {
//     key: "5",
//     serial: "005",
//     productname: "4K Monitor",
//     customername: "Sophia Martinez",
//     date: "2024-02-10",
//     ammount: "$299.99",
//     status: "Delivered",
//     pic: "https://via.placeholder.com/50",
//   },
// ];
import React, { useState } from "react";
import { Table, Avatar, ConfigProvider } from "antd";
import { IoEye } from "react-icons/io5";
import OrderDetailsModal from "./OrderDetailsModal";

function OrderDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order

  const showModal = (record) => {
    setSelectedOrder(record); // Set selected order data
    setIsModalOpen(true); // Open modal
  };

  const dataSource = rawData.map((item) => ({
    ...item,
    serial: `#${item.serial}`,
  }));

  const columns = [
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
    },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar shape="square" size="default" src={record.pic} />
          <span>{record.productname}</span>
        </div>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "customername",
      key: "customername",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Ammount",
      dataIndex: "ammount",
      key: "ammount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <p
          className={
            record.status === "Delivered"
              ? "text-green-400"
              : record.status === "Pending"
              ? "text-[#bef310]"
              : record.status === "Processing"
              ? "text-red-400"
              : "text-sky-400"
          }
        >
          {record.status}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a
          href="#"
          className="hover:text-[#a11d26]"
          onClick={(e) => {
            e.preventDefault();
            showModal(record); // Pass row data
          }}
        >
          <IoEye size={24} />
        </a>
      ),
    },
  ];

  return (
    <>
      <div className="px-3 py-4">
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
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 1 }}
            />
          </div>
        </ConfigProvider>
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          data={selectedOrder} // Pass selected order to modal
        />
      )}
    </>
  );
}

export default OrderDetails;

const rawData = [
  {
    key: "1",
    serial: "001",
    productname: "Wireless Mouse",
    customername: "Michael Johnson",
    date: "2024-02-20",
    ammount: "$25.99",
    status: "Delivered",
    pic: "https://via.placeholder.com/50",
  },
  {
    key: "2",
    serial: "002",
    productname: "Mechanical Keyboard",
    customername: "John Smith",
    date: "2024-02-18",
    ammount: "$79.99",
    status: "Pending",
    pic: "https://via.placeholder.com/50",
  },
  {
    key: "3",
    serial: "003",
    productname: "Gaming Headset",
    customername: "Emily Brown",
    date: "2024-02-15",
    ammount: "$49.99",
    status: "Shipped",
    pic: "https://via.placeholder.com/50",
  },
  {
    key: "4",
    serial: "004",
    productname: "USB-C Docking Station",
    customername: "Daniel Wilson",
    date: "2024-02-12",
    ammount: "$129.99",
    status: "Processing",
    pic: "https://via.placeholder.com/50",
  },
  {
    key: "5",
    serial: "005",
    productname: "4K Monitor",
    customername: "Sophia Martinez",
    date: "2024-02-10",
    ammount: "$299.99",
    status: "Delivered",
    pic: "https://via.placeholder.com/50",
  },
];
