const express = require('express');
const TestLoanList = require('../middleware/TestLoanMiddleware.js');

const router = express()

router.route('/').get(TestLoanList);

module.exports=router;