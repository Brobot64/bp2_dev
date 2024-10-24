'use client';
import React, { useState } from 'react';

function Description({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 450;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };



  const [isHovered, setIsHovered] = useState(false);

  const borderColor = JSON.stringify(localStorage.getItem('borderColor'))

  // Split the description text into paragraphs and format them as HTML
  const formattedDescription = text
    .split('\r\n\r\n')
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');

  return (
    <div className="">
      <div
        className={`description text-sm md:text-[20px] leading-none transition-all duration-300 ease-in-out ${isExpanded ? 'expand' : ''}`}
        dangerouslySetInnerHTML={{
          __html: isExpanded || text.length <= maxLength
            ? formattedDescription
            : formattedDescription.slice(0, maxLength) + '...',
        }}
      />
      {text.length > maxLength && (
        <button 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={toggleReadMore} 
          className={`inline text-sm font-normal text-white hover:text-[${borderColor.replace(/"/g, '')}] transition duration-300`}
          style={{
            color: isHovered ? `${borderColor.replace(/"/g, '')}` : "white"//"#DD47F7"
          }}
        >
          &nbsp;[ &nbsp;{isExpanded ? 'read less' : 'read more'} &nbsp;]
        </button>
      )}
    </div>
  );
};


export default Description;
