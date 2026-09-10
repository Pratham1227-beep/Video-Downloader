import React from 'react';
import { getDownloadUrl } from '../services/downloaderApi';

export default function FormatList({ mediaInfo }) {
  if (!mediaInfo) return null;
  const { url, video = [], audio = [] } = mediaInfo;

  const renderFormatRow = (format, type) => (
    <div key={`${type}-${format.id}`} className="flex items-center justify-between py-3 px-4 hover:bg-gray-800/50 smooth-transition border-b border-gray-800 last:border-0">
      <div className="flex flex-col">
        <span className="font-medium text-gray-200">{format.quality}</span>
        <span className="text-xs text-gray-500 uppercase">
          {format.ext} • {format.approxSizeMB ? `${format.approxSizeMB} MB` : '~'}
        </span>
      </div>
      <a
        href={getDownloadUrl(url, format.id, type)}
        download
        className="bg-gray-800 hover:bg-gray-700 text-indigo-400 hover:text-indigo-300 border border-gray-700 hover:border-indigo-500/50 font-medium py-1.5 px-4 rounded-lg smooth-transition flex items-center gap-1.5 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </a>
    </div>
  );

  return (
    <div className="space-y-6 mt-8">
      {/* Video Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gray-800/50 py-3 px-5 border-b border-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold text-gray-100">Video</h3>
          <span className="text-xs text-gray-500 ml-1">({video.length} formats)</span>
        </div>
        <div className="divide-y divide-gray-800">
          {video.length > 0 ? (
            video.map(f => renderFormatRow(f, 'video'))
          ) : (
            <div className="py-6 text-center text-gray-500 text-sm">No video formats available</div>
          )}
        </div>
      </div>

      {/* Audio Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gray-800/50 py-3 px-5 border-b border-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h3 className="font-semibold text-gray-100">Audio</h3>
          <span className="text-xs text-gray-500 ml-1">({audio.length} formats)</span>
        </div>
        <div className="divide-y divide-gray-800">
          {audio.length > 0 ? (
            audio.map(f => renderFormatRow(f, 'audio'))
          ) : (
            <div className="py-6 text-center text-gray-500 text-sm">No audio formats available</div>
          )}
        </div>
      </div>
    </div>
  );
}
