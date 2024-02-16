const express = require('express');
const TyreData = require('../middleware/TyreDataMiddleware.js');

const router = express()

router.route('/').post(TyreData);

module.exports=router;