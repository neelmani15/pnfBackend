const express = require('express');
const CDLoanList = require('../middleware/CDLoanMiddleware.js');

const router = express()

router.route('/').get(CDLoanList);

module.exports=router;