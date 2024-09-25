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
        height: 300,
        menubar: false,
        // plugins: [
        //   'advlist autolink lists link image charmap print preview anchor',
        //   'searchreplace visualblocks code fullscreen',
        //   'insertdatetime media table paste imagetools wordcount'
        // ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'insertfile undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help | \ link image',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px, }',
      }}
    />
  );
};

export default EmailEditor;



