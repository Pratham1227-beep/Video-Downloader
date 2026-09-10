const express = require('express');
const { handleDownload } = require('./media-download.controller');

const router = express.Router();

router.get('/', handleDownload);

module.exports = router;
