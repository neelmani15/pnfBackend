const express = require('express');
const EMIList = require('../middleware/EmiMiddleware');

const router = express()

router.route('/').get(EMIList);

module.exports=router;