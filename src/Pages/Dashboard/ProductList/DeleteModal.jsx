import React from "react";
import { Modal, Button, ConfigProvider } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function DeleteModal({ isOpen, onClose, onConfirm }) {
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
        visible={isOpen}
        onCancel={onClose}
        footer={[
          <div className="w-full flex items-center justify-center gap-2">
            <Button key="cancel" onClick={onClose}>
              Cancel
            </Button>

            <Button key="delete" type="primary" danger onClick={onConfirm}>
              Delete
            </Button>
          </div>,
        ]}
        closable={false}
        icon={<ExclamationCircleOutlined />}
      >
        <div className="w-full flex items-center justify-center">
          <p className="text-sm text-black my-2">
            Are you sure you want to delete this item?
          </p>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default DeleteModal;
