const getTestLoanRecords = require('../controller/TestLoanController.js');

const TestLoanList = async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_TESTLOAN_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';
        
        const TestLoanRecords = await getTestLoanRecords(url, headers, sheetId,criteria);
        res.send({data:TestLoanRecords})
    }
    catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports=TestLoanList;