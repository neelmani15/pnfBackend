const express = require('express');
const customer = require('../middleware/CustomerMiddleware.js');

const router = express()

router.route('/').get(customer.CustomerList);
router.route('/trucks').get(customer.CustomerTruckList);

module.exports=router;