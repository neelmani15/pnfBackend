const axios = require('axios');

async function gettyreloansRecords(url, headers, sheetId,criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    //   'sort':JSON.stringify([{"property":"column_85","direction":"desc"}])
    };
  
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data.data;
}

module.exports = gettyreloansRecords;