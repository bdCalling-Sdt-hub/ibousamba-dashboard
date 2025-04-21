import React from "react";
import { Modal, Descriptions } from "antd";

const InquiryDetailsModal = ({ isModalOpen, setIsModalOpen, inquiryData }) => {
  return (
    <Modal
      title="Inquiry Details"
      open={isModalOpen}
      width={800}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      {inquiryData ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Full Name">
            {inquiryData.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {inquiryData.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            +{inquiryData.countryCode} {inquiryData.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Inquiry Topics">
            {inquiryData.options?.join(", ") || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <div className="w-full max-h-20 overflow-auto">
              {inquiryData.description}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(inquiryData.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No inquiry details available.</p>
      )}
    </Modal>
  );
};

export default InquiryDetailsModal;
