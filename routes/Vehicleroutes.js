const express = require('express');
const VehicleList = require('../middleware/VehicleMiddleware.js');

const router = express()

router.route('/').get(VehicleList);

module.exports=router;