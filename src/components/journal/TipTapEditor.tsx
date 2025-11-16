"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { NodeSelection } from "prosemirror-state";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  Heading1,
  Heading2,
  Code,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState, useEffect } from "react";
import { mediaService } from "@/lib/api/services/media";
import { notifications } from "@/lib/notifications";

// Custom Image extension with resize support
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageResize"),
        props: {
          handleDOMEvents: {
            mousedown(view, event) {
              const target = event.target as HTMLElement;
              if (target.tagName === "IMG") {
                const pos = view.posAtDOM(target, 0);
                if (pos !== null && pos !== undefined) {
                  const node = view.state.doc.nodeAt(pos);
                  if (node) {
                    const { tr } = view.state;
                    const selection = NodeSelection.create(view.state.doc, pos);
                    tr.setSelection(selection);
                    view.dispatch(tr);
                  }
                }
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});

interface TipTapEditorProps {
  content: any;
  onChange: (content: any) => void;
  placeholder?: string;
  error?: boolean;
  entryId?: string;
}

export const TipTapEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
  error,
  entryId,
}: TipTapEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImagePos, setSelectedImagePos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [resizing, setResizing] = useState<{
    element: HTMLImageElement;
    startX: number;
    startWidth: number;
  } | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ResizableImage.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none min-h-[500px] p-4 focus:outline-none",
          "bg-background text-foreground",
          error && "border-destructive"
        ),
      },
    },
  });

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && editor) {
        setUploading(true);
        try {
          const imageUrl = await mediaService.upload(file, entryId);
          editor.chain().focus().setImage({ src: imageUrl }).run();
          notifications.success("Image uploaded successfully");
        } catch (error) {
          console.error("Failed to upload image:", error);
          notifications.error("Failed to upload image. Please try again.");
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    },
    [editor, entryId]
  );

  const addLink = useCallback(() => {
    if (editor) {
      const url = window.prompt("Enter URL:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  }, [editor]);

  const removeImage = useCallback(async () => {
    if (editor) {
      const { state } = editor;
      const { selection } = state;
      const node = state.doc.nodeAt(selection.from);

      if (node && node.type.name === "image") {
        const imageUrl = node.attrs.src as string;

        const mediaIdMatch = imageUrl.match(/\/media\/([^\/]+)/);
        if (mediaIdMatch) {
          const mediaId = mediaIdMatch[1].replace(/\.\w+$/, "");

          try {
            await mediaService.delete(mediaId);
          } catch (error) {
            console.error("Failed to delete image from server:", error);
          }
        }
      }

      editor.chain().focus().deleteSelection().run();
    }
  }, [editor]);

  // Track selected image position for delete button
  useEffect(() => {
    if (!editor) return;

    const updateImagePosition = () => {
      if (editor.isActive("image")) {
        const { state } = editor;
        const { selection } = state;
        const node = state.doc.nodeAt(selection.from);

        if (node && node.type.name === "image") {
          const domNode = editor.view.nodeDOM(selection.from) as HTMLElement;
          if (domNode) {
            const rect = domNode.getBoundingClientRect();
            const editorRect = editor.view.dom.getBoundingClientRect();

            setSelectedImagePos({
              top: rect.top - editorRect.top,
              left: rect.right - editorRect.left,
            });
            return;
          }
        }
      }
      setSelectedImagePos(null);
    };

    editor.on("selectionUpdate", updateImagePosition);
    editor.on("update", updateImagePosition);
    updateImagePosition();

    return () => {
      editor.off("selectionUpdate", updateImagePosition);
      editor.off("update", updateImagePosition);
    };
  }, [editor]);

  // Handle image resize
  useEffect(() => {
    if (!editor) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const delta = e.clientX - resizing.startX;
        const newWidth = Math.max(100, resizing.startWidth + delta);

        resizing.element.style.width = `${newWidth}px`;
        resizing.element.style.height = "auto";
        return;
      }

      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        const rect = img.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const isNearRightEdge = offsetX > rect.width - 20;

        img.style.cursor = isNearRightEdge ? "ew-resize" : "default";
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;

        const rect = img.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const isNearRightEdge = offsetX > rect.width - 20;

        if (isNearRightEdge) {
          setResizing({
            element: img,
            startX: e.clientX,
            startWidth: img.width || img.naturalWidth,
          });
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleMouseUp = () => {
      if (!resizing) return;

      const width = parseInt(resizing.element.style.width);
      const pos = editor.view.posAtDOM(resizing.element, 0);

      if (pos !== null && pos !== undefined && !isNaN(width)) {
        const { state, view } = editor;
        const node = state.doc.nodeAt(pos);

        if (node && node.type.name === "image") {
          const tr = state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            width,
          });
          view.dispatch(tr);

          setTimeout(() => {
            const json = editor.getJSON();
            onChange(json);
          }, 100);
        }
      }

      setResizing(null);
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("mousemove", handleMouseMove);
    editorElement.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [editor, resizing]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden bg-background relative",
        error && "border-destructive"
      )}
    >
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-accent")}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-accent"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 1 }) && "bg-accent"
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 2 }) && "bg-accent"
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") && "bg-accent"
          )}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList") && "bg-accent"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("blockquote") && "bg-accent"
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("codeBlock") && "bg-accent"
          )}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border my-auto mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-accent")}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          disabled={uploading}
          className="h-8 w-8 p-0"
          title="Add image"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-px h-6 bg-border my-auto mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />

      {editor.isActive("image") && selectedImagePos && (
        <div
          className="absolute z-10"
          style={{
            top: `${selectedImagePos.top + 8}px`,
            left: `${selectedImagePos.left - 8}px`,
          }}
        >
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={removeImage}
            className="h-8 w-8 shadow-lg"
            title="Delete image"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
