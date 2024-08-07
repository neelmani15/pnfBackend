const axios = require('axios');

async function getTyreData(url,headers,sheetId,data){
    const payload={
        'sheet_id':sheetId,
        'data':data
    }
    const response = await axios.post(url, payload, { headers });
    console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data;
}

module.exports = getTyreData;