import React from "react";
import { Modal, ConfigProvider } from "antd";

function ContactDetailsModal({ isModalOpen, setIsModalOpen, inquiryData }) {
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
            contentBg: "#232323",
            headerBg: "#232323",
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
        open={isModalOpen}
        onOk={handleOk}
        width={500}
        height={1000}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="w-full flex flex-col items-center my-8">
          <h1 className="w-full mb-8 flex items-center justify-center text-white text-2xl font-sans">
            Inquiry Details
          </h1>
          {inquiryData ? (
            <div className="text-white w-full">
              <div className="flex mb-2">
                <div className="w-32 font-bold flex justify-between mr-6">
                  <span>Serial</span>
                  <span>:</span>
                </div>
                <div>{inquiryData.serial}</div>
              </div>
              <div className="flex mb-2">
                <div className="w-32 font-bold flex justify-between mr-6">
                  <span>Fuull Name</span>
                  <span>:</span>
                </div>
                <div>{inquiryData.fullName}</div>
              </div>
              <div className="flex mb-2">
                <div className="w-32 font-bold flex justify-between mr-6">
                  <span>Email</span>
                  <span>:</span>
                </div>
                <div>{inquiryData.userEmail}</div>
              </div>
              <div className="flex mb-2">
                <div className="w-32 font-bold flex justify-between mr-6">
                  {" "}
                  <span>Inquiry Topics</span>
                  <span>:</span>
                </div>
                <div>{inquiryData.inquiryTopics}</div>
              </div>
              <div className="flex mb-2">
                <div className="w-32 font-bold flex justify-between mr-6">
                  {" "}
                  <span>Phone Number</span>
                  <span>:</span>
                </div>
                <div>{inquiryData.phoneNumber}</div>
              </div>
              <div className="flex mb-2 ">
                <div className="min-w-32 font-bold flex justify-between mr-6">
                  <span>Your Inquiry</span>
                  <span>:</span>
                </div>
                <div className=" min-w-20 h-auto text-wrap">
                  {inquiryData.yourInquiry}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white">No inquiry data selected</p>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default ContactDetailsModal;
