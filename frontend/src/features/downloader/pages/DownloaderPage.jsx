import React, { useState } from 'react';
import LinkInput from '../components/LinkInput';
import PreviewCard from '../components/PreviewCard';
import FormatList from '../components/FormatList';
import { fetchMediaInfo } from '../services/downloaderApi';
import { sessionCacheGet, sessionCacheSet } from '../../../shared/utils/sessionCache';

// Simple hash for cache key
const hashUrl = (url) => {
  let hash = 0, i, chr;
  if (url.length === 0) return hash;
  for (i = 0; i < url.length; i++) {
    chr   = url.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString();
};

export default function DownloaderPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaInfo, setMediaInfo] = useState(null);

  const handleUrlSubmit = async (url) => {
    setLoading(true);
    setError('');
    setMediaInfo(null);

    const cacheKey = `media_info_${hashUrl(url)}`;
    const cached = sessionCacheGet(cacheKey);

    if (cached) {
      setMediaInfo({ ...cached, url });
      setLoading(false);
      return;
    }

    try {
      const data = await fetchMediaInfo(url);
      sessionCacheSet(cacheKey, data);
      setMediaInfo({ ...data, url });
    } catch (err) {
      setError(err.message || 'An unknown error occurred while fetching media info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 sm:text-5xl tracking-tight mb-3">
            Video Downloader
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Download videos and audio from your favorite platforms in high quality.
          </p>
        </div>

        <div className="mb-10">
          <LinkInput onSubmit={handleUrlSubmit} isLoading={loading} />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-red-300">Error</h3>
              <p className="text-sm mt-1 text-red-200/80">{error}</p>
            </div>
          </div>
        )}

        {mediaInfo && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PreviewCard mediaInfo={mediaInfo} />
            <FormatList mediaInfo={mediaInfo} />
          </div>
        )}
      </div>
    </div>
  );
}
