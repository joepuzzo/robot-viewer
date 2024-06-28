import React, { useState, useEffect } from 'react';

export const ResizablePopup = ({ children }) => {
  const [height, setHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newHeight = window.innerHeight - e.clientY;
      setHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="resizable-popup" style={{ height: `${height}px` }}>
      <div className="resizable-handler" onMouseDown={handleMouseDown}></div>
      {children}
    </div>
  );
};
