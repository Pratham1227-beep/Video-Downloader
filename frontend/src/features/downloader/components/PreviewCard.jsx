import React from 'react';

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return 'Unknown duration';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PreviewCard({ mediaInfo }) {
  if (!mediaInfo) return null;

  const { title, thumbnail, duration, uploader } = mediaInfo;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 shadow-lg">
      <div className="sm:w-64 flex-shrink-0 relative overflow-hidden rounded-xl bg-gray-800 aspect-video flex items-center justify-center">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title || "Video thumbnail"} 
            className="object-cover w-full h-full"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
            {formatDuration(duration)}
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow justify-center">
        <h2 className="text-xl font-semibold text-gray-100 line-clamp-2 mb-2">
          {title || 'Unknown Title'}
        </h2>
        {uploader && (
          <div className="flex items-center text-gray-400 text-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
             {uploader}
          </div>
        )}
      </div>
    </div>
  );
}
