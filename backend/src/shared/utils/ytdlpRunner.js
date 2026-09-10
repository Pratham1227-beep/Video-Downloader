const { spawn } = require('child_process');

/**
 * Gets media information using yt-dlp.
 * @param {string} url - The URL of the media.
 * @returns {Promise<Object>} Parsed JSON object of media info.
 */
function getMediaInfo(url) {
  return new Promise((resolve, reject) => {
    const ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';
    const child = spawn(ytdlpPath, ['-j', '--no-warnings', url]);

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    // Timeout of 60 seconds
    const timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('yt-dlp timeout while fetching media info'));
    }, 60000);

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      if (code !== 0) {
        return reject(new Error(`yt-dlp error (code ${code}): ${stderrData}`));
      }
      
      try {
        const parsed = JSON.parse(stdoutData);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Failed to parse yt-dlp JSON output'));
      }
    });

    child.on('error', (err) => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to start yt-dlp process: ${err.message}`));
    });
  });
}

/**
 * Spawns a yt-dlp process to stream media directly to stdout.
 * @param {string} url - The media URL.
 * @param {string} formatId - The format ID(s) to download.
 * @param {string} type - 'video' or 'audio'.
 * @returns {import('child_process').ChildProcessWithoutNullStreams} The spawned child process.
 */
function streamMedia(url, formatId, type) {
  const ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';
  let args = ['-f', formatId];

  if (type === 'video') {
    args.push('--merge-output-format', 'mp4', '-o', '-', url);
  } else {
    // For audio, just download the specified format to stdout
    args.push('-o', '-', url);
  }

  return spawn(ytdlpPath, args);
}

module.exports = {
  getMediaInfo,
  streamMedia
};
