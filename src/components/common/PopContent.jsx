// // src/components/FaqPopover.js
// import React, { useState } from "react";
// import { Popover, Button, Modal, Flex, Input } from "antd";
// import { DeleteFilled, EditFilled } from "@ant-design/icons";
// import { HiDotsVertical } from "react-icons/hi";
// import ButtonEDU from "./ButtonEDU";

// const FaqPopover = ({ isOpen, onToggle }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(""); // "edit" or "delete"

//   const showModal = (type) => {
//     setModalType(type);
//     setIsModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       {/* Popover */}
//       <Popover
//         content={
//           <div className="flex flex-col items-center gap-2">
//             <Button
//               icon={<EditFilled />}
//               type="text"
//               onClick={() => showModal("edit")}
//             />
//             <Button
//               icon={<DeleteFilled />}
//               type="text"
//               danger
//               onClick={() => showModal("delete")}
//             />
//           </div>
//         }
//         trigger="click"
//         open={isOpen}
//         onOpenChange={onToggle}
//       >
//         <HiDotsVertical size={20} className="cursor-pointer" />
//       </Popover>

//       {/* Modal */}
//       <Modal
//         title={modalType === "edit" ? "Edit FAQ" : "Delete FAQ"}
//         open={isModalOpen}
//         onCancel={handleCancel}
//         centered
//         footer={false}
//       >
//         {modalType === "edit" ? (
//           <Edit submit={handleCancel} />
//         ) : (
//           <Delete onDelete={handleCancel} />
//         )}
//       </Modal>
//     </>
//   );
// };

// export default FaqPopover;

// // Delete Component
// const Delete = ({ onDelete }) => {
//   return (
//     <Flex
//       vertical
//       justify="space-between"
//       className="w-[100%] h-[100%] mb-3 mt-3"
//       gap={20}
//     >
//       <Flex align="center" justify="center">
//         Are you sure you want to delete this FAQ?
//       </Flex>

//       <div className="flex gap-4 justify-center">
//         <ButtonEDU actionType="cancel" onClick={() => console.log("cancel")} />
//         <ButtonEDU actionType="delete" onClick={() => console.log("delete")} />
//       </div>
//     </Flex>
//   );
// };

// // Edit Component
// export const Edit = ({ submit }) => {
//   return (
//     <Flex
//       vertical
//       justify="space-between"
//       className="w-[100%] h-[100%] mb-3"
//       gap={20}
//     >
//       <Flex vertical gap={10}>
//         <p>
//           Question <span className="text-red-600 text-[18px] ml-1">*</span>
//         </p>
//         <Input placeholder="Question" className="h-12" />
//       </Flex>

//       <Flex vertical gap={10}>
//         <p>
//           Answer <span className="text-red-600 text-[18px] ml-1">*</span>
//         </p>
//         <Input
//           placeholder="Answer"
//           className="h-28 flex items-start justify-start"
//         />
//       </Flex>

//       <div className="flex gap-4 justify-end">
//         <ButtonEDU actionType="cancel" onClick={submit} />
//         <ButtonEDU actionType="save" onClick={submit} />
//       </div>
//     </Flex>
//   );
// };

import React, { useState } from "react";
import { Popover, Button } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { HiDotsVertical } from "react-icons/hi";

const FaqPopover = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      content={
        <div className="flex flex-col items-center  gap-2">
          <Button
            icon={<EditFilled />}
            type="text"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          />
          <Button
            icon={<DeleteFilled />}
            type="text"
            danger
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          />
        </div>
      }
      trigger="hover"
      placement="bottom"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <HiDotsVertical size={20} className="cursor-pointer" />
    </Popover>
  );
};

export default FaqPopover;
