const getcdloansRecords = require('../controller/CDLoanController.js');
const BrandData = async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = 59567494;
        // Get criteria from request query parameters
        const selectValue = req.query.selectedBrand || ''
        const criteria = `sheet_${sheetId}.column_1451="${selectValue}"`;
        const customersRecords = await getcdloansRecords(url, headers, sheetId, criteria);
        //console.log(customersRecords);
        res.send({ data: customersRecords });
  
    } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
  };
  module.exports = BrandData;