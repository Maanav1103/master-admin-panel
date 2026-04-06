"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cmsPageSchema, CMSPageSchemaType } from "@/utils/schemas";
import Breadcrumb from "@/components/custom-elements/Breadcrumb";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Check, Link, Code, Eye } from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, ImagePlus,
  Heading1, Heading2, Heading3,
} from "lucide-react";

const toSlug = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

const inputBase =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";

export function CMSPageLayout() {
  const [linkPopover, setLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState("");
  const [mounted, setMounted] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CMSPageSchemaType>({
    defaultValues: {
      title: "", slug: "", content: "",
      metaTag: "", metaTitle: "", metaDescription: "",
      isPublished: false,
    },
    resolver: yupResolver(cmsPageSchema),
  });

  const isPublished = watch("isPublished");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your content here..." }),
    ],
    editorProps: {
      attributes: {
        class: "prose-content max-w-none min-h-[280px] px-4 py-3 text-gray-800 outline-none",
      },
    },
    onUpdate({ editor }) {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("title", e.target.value, { shouldValidate: true });
    setValue("slug", toSlug(e.target.value), { shouldValidate: true });
  };

  const insertLink = () => {
    if (!linkUrl || !editor) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setLinkPopover(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
      setValue("content", editor.getHTML(), { shouldValidate: true });
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const toggleMode = () => {
    if (!htmlMode) {
      // Visual → HTML: pull editor HTML into textarea
      const html = editor?.getHTML() ?? "";
      setRawHtml(html);
    } else {
      // HTML → Visual: push textarea HTML into editor
      editor?.commands.setContent(rawHtml, { emitUpdate: false });
      setValue("content", rawHtml, { shouldValidate: true });
    }
    setHtmlMode((v) => !v);
  };

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawHtml(e.target.value);
    setValue("content", e.target.value, { shouldValidate: true });
  };

  const handleCancel = () => {
    reset();
    editor?.commands.clearContent();
    setRawHtml("");
    setHtmlMode(false);
  };

  const onSubmit = async (values: CMSPageSchemaType) => {
    try {
      setLoading(true);
      console.log(values);
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toolbarBtn = "p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors";
  const activeBtn = "p-1.5 rounded bg-gray-200 text-gray-900";

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="CMS Page" />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="xl:col-span-2 space-y-5">

            {/* Page Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Page Info</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Page Name</label>
                <input
                  type="text"
                  placeholder="Enter page name"
                  {...register("title")}
                  onChange={handleTitle}
                  className={inputBase}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Page Slug</label>
                <div className="flex items-center rounded-lg border border-gray-300 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <input
                    type="text"
                    placeholder="auto-generated"
                    {...register("slug")}
                    className="flex-1 bg-transparent px-2 py-2 text-sm text-gray-800 placeholder:text-gray-300 outline-none"
                  />
                </div>
                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            {/* Text Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Content</h3>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 border border-gray-200 rounded-lg p-2 bg-gray-50">

                {!htmlMode && (
                  <>
                    {/* Headings */}
                    <button type="button" title="Heading 1" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 1 }).run(); }} className={editor?.isActive("heading", { level: 1 }) ? activeBtn : toolbarBtn}><Heading1 className="w-4 h-4" /></button>
                    <button type="button" title="Heading 2" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 2 }).run(); }} className={editor?.isActive("heading", { level: 2 }) ? activeBtn : toolbarBtn}><Heading2 className="w-4 h-4" /></button>
                    <button type="button" title="Heading 3" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 3 }).run(); }} className={editor?.isActive("heading", { level: 3 }) ? activeBtn : toolbarBtn}><Heading3 className="w-4 h-4" /></button>

                    <span className="w-px h-5 bg-gray-300 mx-1" />

                    {/* Formatting */}
                    <button type="button" title="Bold" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }} className={editor?.isActive("bold") ? activeBtn : toolbarBtn}><Bold className="w-4 h-4" /></button>
                    <button type="button" title="Italic" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }} className={editor?.isActive("italic") ? activeBtn : toolbarBtn}><Italic className="w-4 h-4" /></button>
                    <button type="button" title="Underline" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }} className={editor?.isActive("underline") ? activeBtn : toolbarBtn}><UnderlineIcon className="w-4 h-4" /></button>

                    <span className="w-px h-5 bg-gray-300 mx-1" />

                    {/* Alignment */}
                    <button type="button" title="Align Left" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign("left").run(); }} className={editor?.isActive({ textAlign: "left" }) ? activeBtn : toolbarBtn}><AlignLeft className="w-4 h-4" /></button>
                    <button type="button" title="Align Center" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign("center").run(); }} className={editor?.isActive({ textAlign: "center" }) ? activeBtn : toolbarBtn}><AlignCenter className="w-4 h-4" /></button>
                    <button type="button" title="Align Right" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign("right").run(); }} className={editor?.isActive({ textAlign: "right" }) ? activeBtn : toolbarBtn}><AlignRight className="w-4 h-4" /></button>

                    <span className="w-px h-5 bg-gray-300 mx-1" />

                    {/* Lists */}
                    <button type="button" title="Bullet List" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run(); }} className={editor?.isActive("bulletList") ? activeBtn : toolbarBtn}><List className="w-4 h-4" /></button>
                    <button type="button" title="Ordered List" onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); }} className={editor?.isActive("orderedList") ? activeBtn : toolbarBtn}><ListOrdered className="w-4 h-4" /></button>

                    <span className="w-px h-5 bg-gray-300 mx-1" />

                    {/* Image */}
                    <button type="button" title="Insert Image" onMouseDown={(e) => { e.preventDefault(); imageInputRef.current?.click(); }} className={toolbarBtn}><ImagePlus className="w-4 h-4" /></button>
                    <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImage} />

                    {/* Link */}
                    <div className="relative">
                      <button type="button" title="Insert Link" onMouseDown={(e) => { e.preventDefault(); setLinkPopover((v) => !v); }} className={editor?.isActive("link") ? activeBtn : toolbarBtn}>
                        <Link className="w-4 h-4" />
                      </button>
                      {linkPopover && (
                        <div className="absolute top-9 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-72 flex items-center gap-2">
                          <input
                            autoFocus
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && insertLink()}
                            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
                          />
                          <button type="button" onClick={insertLink} className="p-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"><Check className="w-4 h-4" /></button>
                          <button type="button" onClick={() => { setLinkPopover(false); setLinkUrl(""); }} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Mode toggle — always visible, pushed to right */}
                <button
                  type="button"
                  onClick={toggleMode}
                  title={htmlMode ? "Switch to Visual" : "Switch to HTML"}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  {htmlMode ? <><Eye className="w-3.5 h-3.5" /> Visual</> : <><Code className="w-3.5 h-3.5" /> HTML</>}
                </button>
              </div>

              {/* Editor area */}
              {htmlMode ? (
                <textarea
                  value={rawHtml}
                  onChange={handleRawHtmlChange}
                  spellCheck={false}
                  placeholder={"<h1>Title</h1>\n<p>Your content...</p>"}
                  className={`w-full min-h-[280px] rounded-lg border px-4 py-3 font-mono text-xs text-gray-800 bg-gray-50 outline-none resize-y transition-all ${
                    errors.content ? "border-red-400" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  }`}
                />
              ) : (
                <div className={`rounded-lg border transition-all ${errors.content ? "border-red-400" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"}`}>
                  <EditorContent editor={editor} />
                </div>
              )}
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Publish Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Publish</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="publish-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                  {isPublished ? "Published" : "Inactive"}
                </Label>
                <Switch id="publish-toggle" checked={isPublished} onCheckedChange={(v) => setValue("isPublished", v)} />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {isPublished ? "This page is live and visible to users." : "This page is hidden from users."}
              </p>
            </div>

            {/* Meta Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Meta Details</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Meta Tag</label>
                <input type="text" placeholder="e.g. privacy, legal" {...register("metaTag")} className={inputBase} />
                {errors.metaTag && <p className="text-xs text-red-500">{errors.metaTag.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Meta Title</label>
                <input type="text" placeholder="SEO page title" {...register("metaTitle")} className={inputBase} />
                {errors.metaTitle && <p className="text-xs text-red-500">{errors.metaTitle.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Meta Description</Label>
                <Textarea
                  placeholder="Brief description for search engines..."
                  {...register("metaDescription")}
                  className="mt-1 resize-none text-sm text-gray-800 border-gray-300 focus:border-primary focus:ring-primary"
                  rows={4}
                />
                {errors.metaDescription && <p className="text-xs text-red-500">{errors.metaDescription.message}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button type="button" onClick={handleCancel} className="cursor-pointer flex-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 text-sm transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="cursor-pointer flex-1 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
