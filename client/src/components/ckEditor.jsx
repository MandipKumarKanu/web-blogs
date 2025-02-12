import { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

// Import all the needed plugins. Make sure your build/setup provides these.
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
  Link, // <-- Added Link plugin for adding/editing hyperlinks.
  // ... You can import additional plugins here.
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./ck.css";

export const CKEditorComp = ({ content, setContent, disableCK }) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setData(content);
    }
  }, [content]);

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
        "link",
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
    ],
    balloonToolbar: ["bold", "italic", "|", "bulletedList", "numberedList"],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    initialData: "",
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
    <div>
      <div className="main-container rounded-md">
        <div
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div>
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
                    setContent && setContent(data);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
