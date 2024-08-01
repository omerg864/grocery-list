import React from 'react';


interface MemoizedImageProps {
    src: string;
    alt: string;
    className: string;
}
const MemoizedImage = React.memo(({ src, alt, className }: MemoizedImageProps) => {
  return <img className={className} src={src} alt={alt} />;
});

export default MemoizedImage;