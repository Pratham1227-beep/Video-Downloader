const { validateUrl } = require('../../shared/utils/urlValidator');
const mediaInfoService = require('./media-info.service');

/**
 * Handles requests to get media information.
 */
async function handleGetInfo(req, res, next) {
  try {
    const { url } = req.body;
    
    const validation = validateUrl(url);
    if (!validation.valid) {
      const err = new Error(validation.error);
      err.statusCode = 400;
      throw err;
    }

    const info = await mediaInfoService.getInfo(validation.url);
    res.json(info);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleGetInfo
};
