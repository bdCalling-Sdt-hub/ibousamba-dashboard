import React, { useState, useEffect } from "react";
import { Button, Collapse, ConfigProvider, Modal, message } from "antd";
import AddFaqModal from "./AddFaqModal";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useFaqQuery,
  useDeleteFaqMutation,
} from "../../../redux/apiSlices/faqSlice";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";

function Faq() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null); // Store the FAQ being edited
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Control the visibility of delete modal
  const [deleteFaqId, setDeleteFaqId] = useState(null); // Store the FAQ ID to be deleted
  const { data, isLoading, isError, refetch } = useFaqQuery();
  const [faqs, setFaqs] = useState([]);
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  // Set the FAQ data once it's fetched
  useEffect(() => {
    if (data?.data) {
      setFaqs(data.data);
    } else {
      <Error />;
    }
  }, [data]);

  // Handle adding or updating FAQ
  const handleAddFaq = async (faq) => {
    try {
      if (selectedFaq) {
        // If selectedFaq exists, update the FAQ
        const response = await updateFaq({
          id: selectedFaq._id,
          data: {
            title: faq.title,
            description: faq.description,
          },
        }).unwrap();

        console.log("Update FAQ Success:", response);

        // Update FAQ in state
        setFaqs((prevFaqs) =>
          prevFaqs.map((f) =>
            f._id === selectedFaq._id ? { ...f, ...response.data } : f
          )
        );
      } else {
        // Create a new FAQ
        const response = await createFaq({
          title: faq.title,
          description: faq.description,
        }).unwrap();

        console.log("Create FAQ Success:", response);

        // Add new FAQ to state
        if (response.data) {
          setFaqs((prevFaqs) => [...prevFaqs, response.data]);
        } else if (response) {
          // Handle case where response structure might be different
          setFaqs((prevFaqs) => [...prevFaqs, response]);
        }
      }

      // Refresh the data to ensure we have the latest from the server
      refetch();
    } catch (error) {
      console.error(
        selectedFaq ? "Update FAQ Error:" : "Create FAQ Error:",
        error
      );
    } finally {
      // Close modal and reset selected FAQ regardless of success/failure
      setIsModalOpen(false);
      setSelectedFaq(null);
    }
  };

  // Handle opening delete confirmation modal
  const handleDeleteFaq = (faqId) => {
    setDeleteFaqId(faqId);
    setDeleteModalVisible(true); // Show the delete confirmation modal
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      const response = await deleteFaq(deleteFaqId).unwrap();
      console.log("Deleting FAQ with id:", deleteFaqId);
      console.log(response);
      // Remove the deleted FAQ from state
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== deleteFaqId));

      // Optionally refetch to ensure state matches server
      refetch();

      message.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Delete FAQ Error:", error);
      message.error("Failed to delete FAQ");
    } finally {
      setDeleteModalVisible(false); // Hide the delete confirmation modal
      setDeleteFaqId(null); // Reset the delete FAQ ID
    }
  };

  // Handle canceling the delete action
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteFaqId(null); // Reset the delete FAQ ID
  };

  // Handle editing FAQ
  const handleEditFaq = (faqId) => {
    const faqToEdit = faqs.find((faq) => faq._id === faqId);
    if (faqToEdit) {
      setSelectedFaq(faqToEdit);
      setIsModalOpen(true);
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFaq(null);
  };

  // Loading state for the entire component
  if (isLoading) return <Loading />;

  // Error state
  console.log(isError);
  if (isError) return <Error msg={"Error"} />;

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultHoverBorderColor: "none",
              defaultActiveBg: "#3a3936",
              defaultActiveColor: "#d99e1e",
              defaultHoverBg: "#3a3936",
              defaultHoverColor: "#d99e1e",
            },
            Modal: {
              contentBg: "#f4e1b9",
              headerBg: "#f4e1b9",
            },
          },
        }}
      >
        <div className="w-full flex justify-end my-5">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="text-samba text-sm h-9 rounded-lg border-none bg-sambaSD px-5"
            disabled={isCreating || isUpdating || isDeleting}
          >
            Add FAQ
          </Button>
        </div>
        <div className="w-full flex flex-col gap-2">
          {/* Render FAQs with Collapse */}
          {faqs && faqs.length > 0 ? (
            faqs.map((faq) => (
              <div
                key={faq._id}
                className="w-full flex items-start justify-between gap-2"
              >
                <Collapse
                  className="bg-[#1b1b1b] w-full"
                  expandIconPosition="end"
                  items={[
                    {
                      key: faq._id,
                      label: <p>{faq.title}</p>,
                      children: <p className="text-black">{faq.description}</p>,
                    },
                  ]}
                />
                <div className="flex flex-col items-center justify-between h-12">
                  <button
                    onClick={() => handleEditFaq(faq._id)}
                    disabled={isUpdating || isDeleting}
                  >
                    <FiEdit size={25} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq._id)}
                    disabled={isDeleting}
                  >
                    <MdDeleteForever size={25} className="text-white" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No FAQs available</div>
            // <Error msg="Request Time Out" />
          )}

          {/* FAQ Modal */}
          <AddFaqModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleAddFaq}
            faq={selectedFaq}
          />

          {/* Custom Delete Confirmation Modal */}
          <Modal
            title="Confirm Deletion"
            visible={deleteModalVisible}
            onCancel={cancelDelete} // Clicking "Cancel" will close the modal without deleting
            footer={[
              <Button key="cancel" onClick={cancelDelete}>
                Cancel
              </Button>,
              <Button
                key="delete"
                type="primary"
                danger
                onClick={confirmDelete} // Clicking "Delete" will delete the FAQ
                loading={isDeleting} // Shows loading spinner on "Delete" button while deleting
              >
                Delete
              </Button>,
            ]}
          >
            <p className="text-black">
              Are you sure you want to delete this FAQ?
            </p>
          </Modal>
        </div>
      </ConfigProvider>
    </>
  );
}

export default Faq;
