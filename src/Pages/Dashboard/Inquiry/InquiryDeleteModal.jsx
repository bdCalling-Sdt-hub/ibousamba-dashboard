import React from "react";
import { Modal, Button, ConfigProvider } from "antd";

const InquiryDeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: "#f4e1b9",
            headerBg: "#f4e1b9",
          },
        },
      }}
    >
      <Modal
        title="Confirm Deletion"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={onConfirm}
            loading={loading} // Show loading state when deleting
          >
            Delete
          </Button>,
        ]}
      >
        <p className="text-black">
          Are you sure you want to delete this inquiry? This action cannot be
          undone.
        </p>
      </Modal>
    </ConfigProvider>
  );
};

export default InquiryDeleteModal;
