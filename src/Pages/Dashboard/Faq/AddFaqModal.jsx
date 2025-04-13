// import React, { useState, useEffect } from "react";
// import { Modal, Form, Input, Button } from "antd";

// function AddFaqModal({ isOpen, onClose, onSave, faq }) {
//   const [form] = Form.useForm();

//   // When the modal opens for editing, populate the form with the selected FAQ data
//   useEffect(() => {
//     if (faq) {
//       form.setFieldsValue({
//         question: faq.title,
//         answer: faq.description,
//       });
//     } else {
//       form.resetFields();
//     }
//   }, [faq, form, isOpen]);

//   const handleSave = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         onSave({
//           title: values.question,
//           description: values.answer,
//         }); // Send mapped FAQ data to parent
//         form.resetFields(); // Reset fields after save
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

//   return (
//     <Modal
//       title={faq ? "Edit FAQ" : "Add FAQ"} // Change title based on edit or add
//       closable={true}
//       open={isOpen} // Changed from visible to open
//       onCancel={onClose}
//       footer={[
//         <Button
//           key="cancel"
//           onClick={onClose}
//           className="bg-gray-500 text-white hover:bg-gray-600"
//         >
//           Cancel
//         </Button>,
//         <Button
//           key="save"
//           type="primary"
//           onClick={handleSave}
//           className="bg-blue-500 text-white hover:bg-blue-600"
//         >
//           Save
//         </Button>,
//       ]}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         name="addFaqForm"
//         initialValues={{
//           question: "",
//           answer: "",
//         }}
//       >
//         <Form.Item
//           label="FAQ Question"
//           name="question"
//           rules={[
//             { required: true, message: "Please enter the FAQ question!" },
//           ]}
//         >
//           <Input placeholder="Enter the FAQ question" />
//         </Form.Item>

//         <Form.Item
//           label="FAQ Answer"
//           name="answer"
//           rules={[{ required: true, message: "Please enter the FAQ answer!" }]}
//         >
//           <Input.TextArea placeholder="Enter the FAQ answer" rows={4} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// }

// export default AddFaqModal;

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";

function AddFaqModal({ isOpen, onClose, onSave, faq }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false); // Add loading state

  // When the modal opens for editing, populate the form with the selected FAQ data
  useEffect(() => {
    if (faq) {
      form.setFieldsValue({
        question: faq.title,
        answer: faq.description,
      });
    } else {
      form.resetFields();
    }
  }, [faq, form, isOpen]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setSaving(true); // Start loading
        onSave({
          title: values.question,
          description: values.answer,
        })
          .then(() => {
            message.success(
              faq ? "FAQ updated successfully!" : "FAQ added successfully!"
            );
            form.resetFields();
            onClose();
          })
          .catch((error) => {
            console.error("Save failed:", error);
            message.error("Failed to save FAQ. Please try again.");
          })
          .finally(() => {
            setSaving(false); // Stop loading
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={faq ? "Edit FAQ" : "Add FAQ"}
      closable={true}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          className="bg-gray-500 text-white hover:bg-gray-600"
          disabled={saving} // Disable cancel while saving
        >
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={saving} // Show loading spinner
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="addFaqForm"
        initialValues={{
          question: "",
          answer: "",
        }}
      >
        <Form.Item
          label="FAQ Question"
          name="question"
          rules={[
            { required: true, message: "Please enter the FAQ question!" },
          ]}
        >
          <Input placeholder="Enter the FAQ question" />
        </Form.Item>

        <Form.Item
          label="FAQ Answer"
          name="answer"
          rules={[{ required: true, message: "Please enter the FAQ answer!" }]}
        >
          <Input.TextArea placeholder="Enter the FAQ answer" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddFaqModal;
