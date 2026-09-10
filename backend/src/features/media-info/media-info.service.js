const crypto = require('crypto');
const cache = require('../../shared/cache/inMemoryCache');
const { getMediaInfo } = require('../../shared/utils/ytdlpRunner');

/**
 * Generates a SHA-256 hash for the URL to use as cache key.
 * @param {string} url 
 * @returns {string} Hash string
 */
function hashUrl(url) {
  return crypto.createHash('sha256').update(url).digest('hex');
}

/**
 * Transforms raw yt-dlp JSON into a standardized format.
 * @param {Object} raw - Raw JSON from yt-dlp.
 * @returns {Object} Cleaned media info object.
 */
function transformMediaInfo(raw) {
  const formats = raw.formats || [];

  // Arrays to hold processed formats
  const videoFormats = [];
  const audioFormats = [];

  // Find the best audio format for multiplexing when needed
  const availableAudioFormats = formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
  availableAudioFormats.sort((a, b) => (b.abr || b.tbr || 0) - (a.abr || a.tbr || 0));
  const bestAudioFormat = availableAudioFormats.length > 0 ? availableAudioFormats[0] : null;

  // --- Process Video Formats ---
  // Only video tracks (might have audio included)
  const videoOnlyOrMixed = formats.filter(f => f.vcodec !== 'none');
  
  // Group by resolution (height)
  const resolutionGroups = {};
  for (const f of videoOnlyOrMixed) {
    const h = f.height || 0;
    if (!resolutionGroups[h]) resolutionGroups[h] = [];
    resolutionGroups[h].push(f);
  }

  const sortedHeights = Object.keys(resolutionGroups).map(Number).sort((a, b) => b - a);

  for (const h of sortedHeights) {
    const group = resolutionGroups[h];
    
    // Look for pre-muxed (has both video and audio)
    const premuxed = group.find(f => f.acodec !== 'none');
    
    if (premuxed) {
      const approxMB = premuxed.filesize 
        ? (premuxed.filesize / (1024 * 1024))
        : (premuxed.filesize_approx ? (premuxed.filesize_approx / (1024 * 1024)) : null);

      videoFormats.push({
        id: String(premuxed.format_id),
        quality: premuxed.height ? `${premuxed.height}p` : 'Unknown',
        ext: premuxed.ext || 'mp4',
        approxSizeMB: approxMB ? Number(approxMB.toFixed(1)) : null
      });
    } else {
      // Pick best video-only format in this resolution
      // Combine with best audio format id
      group.sort((a, b) => (b.vbr || b.tbr || 0) - (a.vbr || a.tbr || 0));
      const bestVideo = group[0];
      
      const formatId = bestAudioFormat ? `${bestVideo.format_id}+${bestAudioFormat.format_id}` : String(bestVideo.format_id);
      
      const videoBytes = bestVideo.filesize || bestVideo.filesize_approx || 0;
      const audioBytes = bestAudioFormat ? (bestAudioFormat.filesize || bestAudioFormat.filesize_approx || 0) : 0;
      // Only show combined size if the video portion has real size data
      const approxMB = videoBytes > 0 ? ((videoBytes + audioBytes) / (1024 * 1024)) : null;

      videoFormats.push({
        id: formatId,
        quality: bestVideo.height ? `${bestVideo.height}p` : 'Unknown',
        ext: 'mp4', // we force merge-output-format mp4 later
        approxSizeMB: approxMB ? Number(approxMB.toFixed(1)) : null
      });
    }
  }

  // --- Process Audio Formats ---
  // Dedupe by approximate bitrate
  const audioMap = new Map(); // kbps -> format
  for (const f of availableAudioFormats) {
    const kbps = Math.round(f.abr || f.tbr || 0);
    if (!audioMap.has(kbps)) {
      audioMap.set(kbps, f);
    }
  }

  const sortedAudio = Array.from(audioMap.values())
    .sort((a, b) => (b.abr || b.tbr || 0) - (a.abr || a.tbr || 0));

  for (const f of sortedAudio) {
    const kbps = Math.round(f.abr || f.tbr || 0);
    const approxBytes = f.filesize || f.filesize_approx || 0;
    const approxMB = approxBytes > 0 ? (approxBytes / (1024 * 1024)) : null;

    audioFormats.push({
      id: String(f.format_id),
      quality: kbps > 0 ? `${kbps}kbps` : 'Unknown',
      ext: f.ext || 'm4a',
      approxSizeMB: approxMB ? Number(approxMB.toFixed(1)) : null
    });
  }

  return {
    title: raw.title || 'Untitled',
    thumbnail: raw.thumbnail || null,
    duration: raw.duration || null,
    uploader: raw.uploader || raw.channel || 'Unknown',
    video: videoFormats,
    audio: audioFormats
  };
}

/**
 * Fetches media info, using cache if available.
 * @param {string} url - The media URL.
 * @returns {Promise<Object>} Cleaned media info.
 */
async function getInfo(url) {
  const cacheKey = hashUrl(url);
  const cached = cache.get(cacheKey);

  if (cached) {
    console.log(`Cache hit for ${url}`);
    return cached;
  }

  console.log(`Cache miss for ${url}. Fetching info...`);
  const rawData = await getMediaInfo(url);
  const cleanedData = transformMediaInfo(rawData);

  cache.set(cacheKey, cleanedData);
  return cleanedData;
}

module.exports = {
  getInfo
};
