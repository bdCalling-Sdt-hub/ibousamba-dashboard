import React from "react";
import { Modal, ConfigProvider, Table } from "antd";
import { SlCalender } from "react-icons/sl";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import man from "../../../assets/quiloco/man.png";
import paycard from "../../../assets/quiloco/icons/paycard.png";
import { render } from "react-dom";
function OrderDetailsModal({ isModalOpen, setIsModalOpen, data }) {
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: "#353536",
            headerBg: "#353536",
            titleColor: "#ffffff",
            titleFontSize: 24,
          },
          Form: {
            labelColor: "#ffffff",
          },
          Table: {},
        },
      }}
    >
      <Modal
        title="View Details"
        open={isModalOpen}
        centered
        onOk={handleOk}
        width={1000}
        height={500}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex justify-between mt-4 ">
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center text-white">
              <h3>
                Orders ID: {data?.serial}
                {console.log(data)}
              </h3>
              <div
                className={`${
                  data.status === "Processing"
                    ? "bg-amber-400"
                    : data.status === "Pending"
                    ? "bg-red-400"
                    : data.status === "Delivered"
                    ? "bg-green-400"
                    : "bg-sky-400"
                } w-fit px-3 py-1 rounded-sm text-white`}
              >
                {data?.status}
              </div>
            </div>
            <div className="flex gap-4 items-center text-white">
              <SlCalender />
              Feb 16,2022 - Feb 20,2022
            </div>
          </div>

          <div className="flex gap-4 items-start ">
            <div>
              <img src={man} alt="" width={50} className="border rounded-lg" />
            </div>

            <div>
              <h4 className="text-[20px] font-semibold text-green-400">
                Customer
              </h4>
              <p className="text-[16px] text-white font-medium">
                Full name: {data?.customername}
              </p>
              <p className="text-[16px] text-white font-medium">
                Email: {"Samuel@gmail.com"}
              </p>
              <p className="text-[16px] text-white font-medium">
                Phone: {"+91 904 231 1212"}
              </p>
            </div>
          </div>
        </div>
        <PaymentInfo />
        <OrderDeitailsTable data={data} />
      </Modal>
    </ConfigProvider>
  );
}

export default OrderDetailsModal;

const PaymentInfo = (data) => {
  return (
    <div className="flex flex-col gap-2 my-3 ">
      <h5 className="text-lime-700 font-bold">Payment Info</h5>
      <div className="flex gap-3">
        <img src={paycard} />
        <p>Master Card **** **** 6557</p>
      </div>
      {/* <div>
        <p>Master Card **** **** 6557</p>
        <p>Master Card **** **** 6557</p>
      </div> */}
    </div>
  );
};

const OrderDeitailsTable = (data) => {
  return (
    <div className="">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#353536",
              headerSplitColor: "none",
              headerColor: "white",
              borderColor: "#A3A3A3",
              colorBgContainer: "#353536",
              rowHoverBg: "#4a4a4a",
              colorText: "white",
              headerBorderRadius: "none",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          showHeader={false}
        />
      </ConfigProvider>
      <div className="flex justify-end  w-full my-4 ">
        <p className="text-amber-400 mr-28">
          Total<span className="font-sans ml-20">$ {8554}</span>
        </p>
      </div>
    </div>
  );
};
const dataSource = [
  {
    key: "1",
    productname: "Wireless Mouse",
    serial: "#001",
    quantity: 10,
    ammount: "$25.99",
  },
  {
    key: "2",
    productname: "Mechanical Keyboard",
    serial: "#002",
    quantity: 5,
    ammount: "$79.99",
  },
  // Add more rows as needed
];
const columns = [
  {
    title: "",
    dataIndex: "box",
    key: "box",
    render: () => {
      return <MdCheckBoxOutlineBlank size={25} />;
    },
  },
  {
    title: "Product Name",
    dataIndex: "productname",
    key: "productname",
  },
  {
    title: "Serial",
    dataIndex: "serial",
    key: "serial",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },

  {
    title: "Ammount",
    dataIndex: "ammount",
    key: "ammount",
  },
];
