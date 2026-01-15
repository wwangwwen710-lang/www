
import React from 'react';
import { AspectRatio, ImageSize } from '../types';

interface SettingsPanelProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
}

const ASPECT_RATIOS: AspectRatio[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];
const IMAGE_SIZES: ImageSize[] = ["1K", "2K", "4K"];

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  aspectRatio,
  setAspectRatio,
  imageSize,
  setImageSize
}) => {
  return (
    <div className="space-y-6 bg-white/5 p-4 rounded-2xl border border-white/10 mt-6">
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Aspect Ratio</label>
        <div className="grid grid-cols-4 gap-2">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar}
              onClick={() => setAspectRatio(ar)}
              className={`py-2 text-xs rounded-lg transition-all border ${
                aspectRatio === ar 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              {ar}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Quality (Resolution)</label>
        <div className="grid grid-cols-3 gap-2">
          {IMAGE_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setImageSize(size)}
              className={`py-2 text-xs rounded-lg transition-all border ${
                imageSize === size 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
