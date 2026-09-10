export async function fetchMediaInfo(url) {
  const response = await fetch('/api/media/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch media info';
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch (e) {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export function getDownloadUrl(url, formatId, type) {
  const encodedUrl = encodeURIComponent(url);
  const encodedFormatId = encodeURIComponent(formatId);
  return `/api/media/download?url=${encodedUrl}&formatId=${encodedFormatId}&type=${type}`;
}
