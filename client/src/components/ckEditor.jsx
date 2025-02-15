import { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autosave,
  BalloonToolbar,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Highlight,
  Italic,
  List,
  ListProperties,
  Paragraph,
  SelectAll,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  TodoList,
  Underline,
  Undo,
  Table,
  TableToolbar,
  TableCaption,
  TableCellProperties,
  TableProperties,
  TableColumnResize,
  Link,
  AutoLink, // <-- Import AutoLink
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./ck.css";

export const CKEditorComp = ({ content, setContent, disableCK }) => {
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "selectAll",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "|",
        "specialCharacters",
        "highlight",
        "|",
        "link", // Keep Link for editing links
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "insertTable",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Autosave,
      BalloonToolbar,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Highlight,
      Italic,
      List,
      ListProperties,
      Paragraph,
      SelectAll,
      SpecialCharacters,
      Strikethrough,
      Subscript,
      Superscript,
      TodoList,
      Underline,
      Undo,
      Table,
      TableToolbar,
      TableCaption,
      TableCellProperties,
      TableProperties,
      TableColumnResize,
      Link,
      AutoLink, // <-- Add AutoLink here
    ],
    balloonToolbar: ["bold", "italic", "|", "bulletedList", "numberedList"],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    initialData: content,
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
        "tableProperties",
        "toggleTableCaption",
      ],
      tableToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    placeholder: "Type or paste your content here!",
  };

  return (
    <div className="main-container rounded-md">
      <div className="editor-container editor-container_classic-editor">
        <div className="editor-container__editor">
          {isLayoutReady && (
            <CKEditor
              editor={ClassicEditor}
              data={content}
              config={editorConfig}
              disabled={disableCK}
              onReady={(editor) => {
                editorRef.current = editor;
              }}
              onChange={(_, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
