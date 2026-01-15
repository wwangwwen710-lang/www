
import React, { useState, useEffect, useCallback } from 'react';
import { AspectRatio, ImageSize, GeneratedImage } from './types';
import { generateWallpaper } from './services/geminiService';
import SettingsPanel from './components/SettingsPanel';
import FullScreenModal from './components/FullScreenModal';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [referenceImage, setReferenceImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch {
      setHasKey(false);
    }
  };

  const handleOpenKeySelector = async () => {
    await (window as any).aistudio.openSelectKey();
    // Assume success as per instructions
    setHasKey(true);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setImages([]); // Clear old results

    const generationTasks = Array.from({ length: 4 }).map(async (_, i) => {
      try {
        const url = await generateWallpaper(
          prompt,
          { aspectRatio, imageSize },
          referenceImage?.base64
        );
        return {
          id: `${Date.now()}-${i}`,
          url,
          prompt,
          base64: url
        };
      } catch (err: any) {
        console.error("Generation failed:", err);
        throw err;
      }
    });

    try {
      const results = await Promise.all(generationTasks);
      setImages(results);
      setReferenceImage(null); // Clear reference image after generation
    } catch (err: any) {
      setError("Failed to generate some wallpapers. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemix = (image: GeneratedImage) => {
    setReferenceImage(image);
    setSelectedImage(null);
    setPrompt(image.prompt);
    // Auto-scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight">VibePaper AI</h1>
          <p className="text-gray-400 text-lg">Create premium AI wallpapers using Gemini 3 Pro. High quality generation requires a paid API key.</p>
        </div>
        <div className="w-full space-y-4">
          <button 
            onClick={handleOpenKeySelector}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-xl"
          >
            Connect API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-sm text-blue-400 hover:underline"
          >
            Learn about billing & API keys
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 max-w-lg mx-auto px-5 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">VibePaper AI</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Powered by Gemini 3 Pro</p>
        </div>
        <button 
          onClick={() => (window as any).aistudio.openSelectKey()}
          className="p-2 bg-white/5 rounded-full border border-white/10"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Input */}
      <div className="sticky top-4 z-40">
        <form onSubmit={handleGenerate} className="relative group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vibe (e.g. rainy cyberpunk lo-fi)"
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl py-5 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
          />
          <button 
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`absolute right-2 top-2 bottom-2 aspect-square rounded-2xl flex items-center justify-center transition-all ${
              isGenerating || !prompt.trim() 
                ? 'bg-gray-800 text-gray-600' 
                : 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg shadow-white/5'
            }`}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        {referenceImage && (
          <div className="mt-2 flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 p-2 rounded-xl">
             <img src={referenceImage.url} className="w-8 h-8 rounded-lg object-cover" />
             <span className="text-xs text-blue-300 font-medium">Remixing this vibe...</span>
             <button onClick={() => setReferenceImage(null)} className="ml-auto text-blue-300 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
        )}
      </div>

      <SettingsPanel 
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        imageSize={imageSize}
        setImageSize={setImageSize}
      />

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          {images.length > 0 ? "Your Wallpapers" : isGenerating ? "Generating Magic..." : "Ready to Create"}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {isGenerating && images.length === 0 && Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className={`rounded-2xl bg-white/5 animate-pulse border border-white/5 flex flex-col items-center justify-center p-8 space-y-4`}
              style={{ aspectRatio: aspectRatio.replace(':', '/') }}
            >
               <div className="w-8 h-8 bg-white/10 rounded-full"></div>
            </div>
          ))}

          {images.map((img) => (
            <div 
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 active:scale-[0.98] transition-all"
            >
              <img 
                src={img.url} 
                alt={img.prompt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ aspectRatio: aspectRatio.replace(':', '/') }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-[10px] text-white/80 line-clamp-1">{img.prompt}</p>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-lg">Your creations will appear here</p>
          </div>
        )}
      </div>

      <FullScreenModal 
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onRemix={handleRemix}
      />

      {isGenerating && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold animate-bounce">
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            Crafting Wallpapers...
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
