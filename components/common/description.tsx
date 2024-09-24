'use client';
import React, { useState } from 'react';

function Description({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="">
        <p
          className={`description text-sm md:text-[20px] leading-none ${isExpanded ? 'expand' : ''}`}
        >
          {isExpanded ? text : text.slice(0, 450) + '...'}
        </p>
        <button onClick={toggleReadMore} className="inline text-sm font-normal text-gray-400 italic">
          &nbsp;[ &nbsp;{isExpanded ? 'read less' : 'read more'} &nbsp;]
        </button>
      </div>
    </>
  );
}

export default Description;
