import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../../../shared/components/ui/Spinner';

export default function LinkInput({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const timeoutRef = useRef(null);

  const validateUrl = (value) => {
    if (!value) return false;
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setError('');
    onSubmit(url);
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (validateUrl(pastedText)) {
      setUrl(pastedText);
      setError('');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onSubmit(pastedText);
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError('');
          }}
          onPaste={handlePaste}
          placeholder="Paste video link here..."
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-32 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 smooth-transition text-lg shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="absolute right-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-2 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed smooth-transition shadow-md flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              <span>Wait</span>
            </>
          ) : (
            <span>Fetch</span>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 ml-4">{error}</p>}
    </form>
  );
}
