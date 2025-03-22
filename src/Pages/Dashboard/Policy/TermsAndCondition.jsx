import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";

function TermsAndCondition() {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const handleUpdate = (newContent) => {
    setContent(newContent);
  };

  return (
    <div className="px-3 py-4">
      <JoditEditor
        ref={editor}
        value={content}
        onBlur={handleUpdate} // Changed from onChange to onBlur
        config={{
          theme: "dark",
          style: {
            background: "#000",
            color: "#ccc",
          },
          statusbar: false,
          showCharsCounter: false,
          showWordsCounter: false,
          toolbarAdaptive: true,
          toolbarSticky: true,
          enableDragAndDropFileToEditor: true,
          allowResizeX: false,
          allowResizeY: false,
          // Reduce button count to improve performance
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
          // Add these performance settings
          useSearch: false,
          spellcheck: false,
          iframe: false,
        }}
      />
      <button
        className="w-full bg-samba hover:bg-samba/90 text-white text-[24px] rounded-lg h-12 my-4"
        onClick={() => console.log(content)}
      >
        Save
      </button>
    </div>
  );
}

export default TermsAndCondition;
