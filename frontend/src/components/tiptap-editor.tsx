'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';

interface TiptapEditorProps {
  name: string;
  placeholder?: string;
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const TiptapEditor = ({
  name,
  placeholder = 'Write your description...',
  initialContent = '',
  onChange,
}: TiptapEditorProps) => {
  const { control, setValue, trigger } = useFormContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
      }),
    ],
    content: initialContent || `<p>${placeholder}</p>`,
    editorProps: {
      attributes: {
        class:
          'min-h-[150px] border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ring',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const cleanContent = content.replace(/<p><\/p>/g, '').trim();

      setValue(name, cleanContent, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Trigger validation
      trigger(name);
      onChange?.(cleanContent);
    },
  });

  // Render toolbar buttons
  const renderToolbarButton = (
    icon: React.ReactNode,
    action: () => void,
    isActive: boolean
  ) => (
    <button
      type='button'
      onClick={action}
      className={`p-1 rounded ${isActive ? 'bg-gray-200' : ''}`}
    >
      {icon}
    </button>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <div>
          <div className='flex items-center gap-2 mb-2'>
            {editor && (
              <>
                {renderToolbarButton(
                  <Bold size={16} />,
                  () => editor.chain().focus().toggleBold().run(),
                  editor.isActive('bold')
                )}
                {renderToolbarButton(
                  <Italic size={16} />,
                  () => editor.chain().focus().toggleItalic().run(),
                  editor.isActive('italic')
                )}
                {renderToolbarButton(
                  <List size={16} />,
                  () => editor.chain().focus().toggleBulletList().run(),
                  editor.isActive('bulletList')
                )}
                {renderToolbarButton(
                  <ListOrdered size={16} />,
                  () => editor.chain().focus().toggleOrderedList().run(),
                  editor.isActive('orderedList')
                )}
              </>
            )}
          </div>

          <EditorContent editor={editor} />
        </div>
      )}
    />
  );
};
