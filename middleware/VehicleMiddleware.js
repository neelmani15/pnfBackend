const getVehicleRecords = require('../controller/VehicleController.js');

const VehicleList = async (req, res) => {
    try {
      const url = process.env.TIGERSHEET_API_URL;
      const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      const sheetId = process.env.TIGERSHEET_VEHICLE_SHEET_ID;
      const criteria = req.query.criteria || '';
  
      const vehicleRecords = await getVehicleRecords(url, headers, sheetId, criteria);
      res.send({ data: vehicleRecords });
  
    } catch (err) {
      console.error('Error in fetching data:', err.message);
      res.status(500).send('Internal Server Error');
    }
  }

  module.exports=VehicleList;