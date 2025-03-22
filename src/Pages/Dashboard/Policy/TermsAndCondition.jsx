import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { message } from "antd";
import {
  usePolicyQuery,
  useUpdatePolicyMutation,
} from "../../../redux/apiSlices/policySlice";

function TermsAndCondition() {
  const editor = useRef(null);
  const [content, setContent] = useState("Loading...");

  const { data, isLoading, error } = usePolicyQuery("termsOfService");
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();

  // Update state when data is fetched
  useEffect(() => {
    if (data?.data?.content) {
      setContent(data.data.content);
    }
  }, [data]);

  const handleUpdate = (newContent) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      message.warning("Terms and Conditions content cannot be empty.");
      return;
    }

    try {
      await updatePolicy({
        termsOfService: content,
        policy: "termsOfService",
      }).unwrap();
      message.success("Terms and Conditions updated successfully!");
    } catch (err) {
      message.error(
        err?.data?.message ||
          "Failed to update Terms and Conditions. Please try again."
      );
      console.error("Update error:", err);
    }
  };

  return (
    <div className="px-3 py-4">
      {isLoading ? (
        <p>Loading Terms and Conditions...</p>
      ) : error ? (
        <p className="text-red-500">
          Failed to load Terms and Conditions. Please try again.
        </p>
      ) : (
        <>
          <JoditEditor
            ref={editor}
            value={content}
            onBlur={(newContent) => handleUpdate(newContent)}
            config={{
              theme: "dark",
              style: { background: "#000", color: "#ccc" },
              statusbar: false,
              showCharsCounter: false,
              showWordsCounter: false,
              toolbarAdaptive: true,
              toolbarSticky: true,
              enableDragAndDropFileToEditor: true,
              allowResizeX: false,
              allowResizeY: false,
              buttons: [
                "source",
                "|",
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "font",
                "fontsize",
                "brush",
                "paragraph",
                "|",
                "image",
                "table",
                "link",
                "|",
                "left",
                "center",
                "right",
                "justify",
                "|",
                "undo",
                "redo",
                "|",
                "hr",
                "eraser",
                "fullsize",
              ],
              useSearch: false,
              spellcheck: false,
              iframe: false,
            }}
          />
          <button
            className="w-full bg-samba hover:bg-samba/90 text-white text-[24px] rounded-lg h-12 my-4"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </>
      )}
    </div>
  );
}

export default TermsAndCondition;
