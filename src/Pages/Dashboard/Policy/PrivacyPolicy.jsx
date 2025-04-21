import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { message } from "antd";
import {
  usePolicyQuery,
  useUpdatePolicyMutation,
} from "../../../redux/apiSlices/policySlice";

function PrivacyPolicy() {
  const editor = useRef(null);
  const [content, setContent] = useState("Loading...");

  // Fetch privacy policy content
  const { data, isLoading, error } = usePolicyQuery("privacyPolicy");

  // Mutation hook for updating the policy
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();

  // Update state when data is fetched
  useEffect(() => {
    if (data?.data?.content) {
      setContent(data.data.content);
    }
  }, [data]);

  // Handle editor content change
  const handleUpdate = (newContent) => {
    setContent(newContent);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!content.trim()) {
      message.warning("Privacy policy content cannot be empty.");
      return;
    }

    // console.log(content);

    try {
      const result = await updatePolicy({
        privacyPolicy: content,
        policy: "privacyPolicy",
      }).unwrap();
      // console.log(result);
      message.success("Privacy policy updated successfully!");
    } catch (err) {
      message.error(
        err?.data?.message ||
          "Failed to update privacy policy. Please try again."
      );
      console.error("Update error:", err);
    }
  };

  return (
    <div className="px-3 py-4">
      {isLoading ? (
        <p>Loading privacy policy...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load policy. Please try again.</p>
      ) : (
        <>
          <JoditEditor
            ref={editor}
            value={content}
            onBlur={(newContent) => handleUpdate(newContent)}
            config={{
              theme: "dark",
              style: { background: "#000", color: "#ccc" },
              showCharsCounter: false,
              showWordsCounter: false,
              toolbarAdaptive: true,
              toolbarSticky: true,
              enableDragAndDropFileToEditor: true,
              allowResizeX: false,
              allowResizeY: false,
              statusbar: false,
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

export default PrivacyPolicy;
