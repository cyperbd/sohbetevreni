import React, { useRef, useEffect } from 'react';

interface VideoPreviewProps {
  stream: MediaStream;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="fixed bottom-24 right-4 w-48 h-36 bg-black rounded-lg shadow-2xl overflow-hidden z-50 border-2 border-neon-cyan/50">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
    </div>
  );
};
