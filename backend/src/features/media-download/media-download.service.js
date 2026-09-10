const { streamMedia } = require('../../shared/utils/ytdlpRunner');

/**
 * Initiates the download process for the media.
 * @param {string} url - The media URL.
 * @param {string} formatId - The format ID to download.
 * @param {string} type - 'video' or 'audio'.
 * @returns {import('child_process').ChildProcessWithoutNullStreams} The spawned child process.
 */
function download(url, formatId, type) {
  return streamMedia(url, formatId, type);
}

module.exports = {
  download
};
