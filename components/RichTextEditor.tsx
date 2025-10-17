'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'ابدأ الكتابة...',
  minHeight = '400px',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issue for Next.js
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Only H2 and H3 (H1 is page title)
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg max-w-none focus:outline-none p-4 text-foreground',
          'prose-headings:text-foreground prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4',
          'prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3',
          'prose-p:text-base prose-p:leading-relaxed prose-p:mb-4',
          'prose-ul:list-disc prose-ul:mr-6 prose-ul:mb-4',
          'prose-ol:list-decimal prose-ol:mr-6 prose-ol:mb-4',
          'prose-li:mb-2',
          'prose-a:text-primary prose-a:underline',
        ),
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when prop changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-card', className)}>
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap items-center gap-1 rtl:flex-row-reverse">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-9 w-9 p-0"
            title="تراجع"
          >
            <Icon name="Undo" className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-9 w-9 p-0"
            title="إعادة"
          >
            <Icon name="Redo" className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-9 w-9 p-0"
            title="عريض"
          >
            <Icon name="Bold" className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-9 w-9 p-0"
            title="مائل"
          >
            <Icon name="Italic" className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-9 w-9 p-0"
            title="قائمة نقطية"
          >
            <Icon name="List" className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-9 w-9 p-0"
            title="قائمة مرقمة"
          >
            <Icon name="ListOrdered" className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Link */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              const url = window.prompt('أدخل الرابط:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className="h-9 w-9 p-0"
            title="إضافة رابط"
          >
            <Icon name="Link" className="h-4 w-4" />
          </Button>
          {editor.isActive('link') && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="h-9 w-9 p-0"
              title="إزالة الرابط"
            >
              <Icon name="Unlink" className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-9 px-3"
            title="عنوان رئيسي (H2)"
          >
            <span className="font-bold text-sm">H2</span>
          </Button>
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-9 px-3"
            title="عنوان فرعي (H3)"
          >
            <span className="font-semibold text-sm">H3</span>
          </Button>
          <Button
            type="button"
            variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className="h-9 w-9 p-0"
            title="فقرة عادية"
          >
            <Icon name="Pilcrow" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-background" />
    </div>
  );
}

