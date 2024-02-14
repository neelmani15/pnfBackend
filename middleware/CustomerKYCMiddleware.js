const getCustomerKycRecords = require('../controller/CustomerKYCController.js');

const CustomerKYCList = async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_CUSTOMER_KYC_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';
        const customerKycRecords = await getCustomerKycRecords(url, headers, sheetId, criteria);
        res.send({ data: customerKycRecords });
    } catch (err) {
        console.error('Error in fetching customerKyc data:', err.message);
        res.status(500).send('Internal Server Error');
    }
  }

  module.exports = CustomerKYCList;