const express = require('express');
const TyreLoanList = require('../middleware/TyreLoanMiddleware.js');

const router = express()

router.route('/').get(TyreLoanList);

module.exports=router;