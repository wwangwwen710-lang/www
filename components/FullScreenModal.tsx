
import React from 'react';
import { GeneratedImage } from '../types';

interface FullScreenModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onRemix: (image: GeneratedImage) => void;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ image, onClose, onRemix }) => {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `vibepaper-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 z-10">
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center flex-1 mx-4">
          <p className="text-xs text-white/50 truncate max-w-[200px]">{image.prompt}</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <img 
          src={image.url} 
          alt="Full screen preview" 
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
        />
      </div>

      <div className="p-6 space-y-3 pb-10">
        <button 
          onClick={handleDownload}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Wallpaper
        </button>
        <button 
          onClick={() => onRemix(image)}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Remix this Vibe
        </button>
      </div>
    </div>
  );
};

export default FullScreenModal;
