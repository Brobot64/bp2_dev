import dynamic from 'next/dynamic';
import React, { useState } from 'react';
// import ReactQuill from 'react-quill';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading ...</p>
});
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value = "", onChange }) => {
  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className='quill-editor-container'>
      <ReactQuill 
        value={value} 
        className='h-full max-h-full'
        onChange={handleChange} 
        theme="snow" // Quill theme, 'snow' is the default
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'], // text formatting
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }], // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }], // indent/outdent
            [{ 'direction': 'rtl' }], // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // custom font sizes
            [{ 'color': [] }, { 'background': [] }], // text and background color
            [{ 'align': [] }], // alignment
            ['link', 'image', 'video'], // link and media
            ['clean'] // remove formatting
          ]
        }}
      />
    </div>
  );
};

export default QuillEditor;
