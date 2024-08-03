const express = require('express');
const customer = require('../middleware/CustomerMiddleware.js');

const router = express()

router.route('/').get(customer.CustomerList);
router.route('/trucks').get(customer.CustomerTruckList);
router.route('/validate').post(customer.CustomerValidation)

module.exports=router;