const express = require('express');
const { handleGetInfo } = require('./media-info.controller');

const router = express.Router();

router.post('/', handleGetInfo);

module.exports = router;
