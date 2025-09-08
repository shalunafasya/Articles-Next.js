"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import type { Editor as TinyMCEEditor } from "tinymce";

// import TinyMCE core & assets (self-hosted)
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";

// Plugins
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/code";
import "tinymce/plugins/wordcount";

export default function TextEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const logContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

return (
    <Editor
      init={{
        height: 400,
        menubar: false,
        plugins: [
          "advlist autolink lists link image",
          "charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount"
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help"
      }}
    />
  );

}
