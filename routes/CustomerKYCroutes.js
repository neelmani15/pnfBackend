const express = require('express');
const CustomerKYCList = require('../middleware/CustomerKYCMiddleware.js');

const router = express()

router.route('/').get(CustomerKYCList);

module.exports=router;