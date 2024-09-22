// src/components/EmailEditor.tsx
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface EmailEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ content, onContentChange }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (newContent: string) => {
    onContentChange(newContent);
  };

  return (
    <Editor
      apiKey="uyjpr2fgrvy7f3rzfo2b73epyuuqon84ulr1txxwfziq9mj4" // Replace with your actual API key from TinyMCE
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  );
};

export default EmailEditor;



