const axios = require('axios');

async function getVehicleRecords(url, headers, sheetId, criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    };
  
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend for Vehicles', response.data);
  
    return response.data.data;
}

module.exports = getVehicleRecords;