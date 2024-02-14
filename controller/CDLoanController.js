const axios = require('axios');

async function getcdloansRecords(url, headers, sheetId,criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    //   'sort':JSON.stringify([{"property":"column_70","direction":"desc"}])
    };
  
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend', response.data);

    return response.data.data;
  }

  module.exports =getcdloansRecords;