const { download } = require('./media-download.service');
const { validateUrl } = require('../../shared/utils/urlValidator');

/**
 * Handles the media download streaming request.
 */
function handleDownload(req, res, next) {
  try {
    const { url, formatId, type } = req.query;

    const validation = validateUrl(url);
    if (!validation.valid) {
      const err = new Error(validation.error);
      err.statusCode = 400;
      return next(err);
    }

    if (!formatId || typeof formatId !== 'string') {
      const err = new Error('formatId is required and must be a string.');
      err.statusCode = 400;
      return next(err);
    }

    if (type !== 'video' && type !== 'audio') {
      const err = new Error('type must be either "video" or "audio".');
      err.statusCode = 400;
      return next(err);
    }

    // Set headers
    const sanitizedFilename = `download_${Date.now()}.${type === 'video' ? 'mp4' : 'm4a'}`;
    const contentType = type === 'video' ? 'video/mp4' : 'audio/mp4';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);

    // Start streaming
    const child = download(validation.url, formatId, type);

    // Timeout (10 minutes)
    const timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
    }, 10 * 60 * 1000);

    // Pipe stdout to response
    child.stdout.pipe(res);

    let stderrData = '';
    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      if (code !== 0) {
        console.error(`yt-dlp stream error (code ${code}):`, stderrData);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Streaming failed.' });
        } else {
          // Response has already started, we just end it.
          res.end();
        }
      }
    });

    child.on('error', (err) => {
      clearTimeout(timeoutId);
      console.error('Child process error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to start download process.' });
      }
    });

    // If client disconnects, kill the process
    req.on('close', () => {
      child.kill('SIGTERM');
      clearTimeout(timeoutId);
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleDownload
};
