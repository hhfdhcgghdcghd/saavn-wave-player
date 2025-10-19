import { useEffect, useRef } from 'react';

export const CastButton = () => {
  const castButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (castButtonRef.current && window.cast?.framework) {
      const castButton = document.createElement('google-cast-launcher');
      castButtonRef.current.appendChild(castButton);
    }
  }, []);

  return (
    <div 
      ref={castButtonRef} 
      className="flex items-center justify-center"
      style={{ 
        width: '24px', 
        height: '24px',
        cursor: 'pointer'
      }}
    />
  );
};
