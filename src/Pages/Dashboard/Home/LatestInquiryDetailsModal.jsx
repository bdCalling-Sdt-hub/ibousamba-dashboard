import React from "react";
import { Modal, Descriptions } from "antd";

const LatestInquiryDetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  inquiryData,
}) => {
  return (
    <Modal
      title="Inquiry Details"
      open={isModalOpen}
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
            {inquiryData.description}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {inquiryData.status ? "Active" : "Inactive"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(inquiryData.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(inquiryData.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No inquiry details available.</p>
      )}
    </Modal>
  );
};

export default LatestInquiryDetailsModal;
