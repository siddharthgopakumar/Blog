import EditorJS, { EditorConfig, ToolConstructable } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";

import "../../scss/style.scss";
import "./index.scss";

const editorConfig: EditorConfig = {
  readOnly: false,
  holder: "editorjs",
  placeholder: "Let's start with your story...",
  tools: {
    header: {
      class: Header as unknown as ToolConstructable,
      inlineToolbar: ["marker", "link"],
      config: {
        placeholder: "Title",
      },
      shortcut: "CMD+SHIFT+H",
    },
    marker: {
      class: Marker,
      shortcut: "CMD+SHIFT+M",
    },
  },
  data: {
    blocks: [
      {
        type: "header",
        data: {
          level: 1,
        },
      },
      {
        type: "paragraph",
        id: "first",
        data: {
        },
      },
    ],
  },
};

var editor = new EditorJS(editorConfig);
