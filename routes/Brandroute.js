const express = require('express');
const BrandData = require('../middleware/BrandMiddleware')
const router = express()

router.route('/').get(BrandData);

module.exports=router;