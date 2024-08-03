let customer = require('../controller/CustomerController.js');
const CustomerList = async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_CUSTOMER_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';;
        const cdloansRecords = await customer.getcustomerRecords(url, headers, sheetId,criteria);
        res.send({data:cdloansRecords})

    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
}
const CustomerTruckList = async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_TRUCK_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';;
        const truckRecords = await customer.gettruckRecords(url, headers, sheetId,criteria);
        console.log(truckRecords)
        res.send({data:truckRecords})

    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
}
const CustomerValidation = async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_CUSTOMER_SHEET_ID;
        
        // Get and clean the verifyValue from request query parameters
        const cleanedValue = req.query.verifyValue || '';
        //console.log('Original Value:', cleanedValue);
        
        // Function to format the mobile number with +91 prefix if needed
        const formatMobileNumber = (number) => {
            let cleanedNumber = number.replace(/\D/g, ''); // Remove any non-digit characters
            
            if (cleanedNumber.length === 10) {
                cleanedNumber = `+91${cleanedNumber}`;
            } else if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
                cleanedNumber = `+${cleanedNumber}`;
            } else if (!cleanedNumber.startsWith('+91')) {
                cleanedNumber = `+91${cleanedNumber}`;
            }

            return cleanedNumber;
        };
        const fetchTruckRecords = async (value) => {
            const criteria = `sheet_${sheetId}.column_87="${value}"`;
            return await customer.gettruckRecords(url, headers, sheetId, criteria);
        };
        let truckRecords = await fetchTruckRecords(cleanedValue);
        if (!truckRecords || truckRecords.length === 0) {
            const formattedValue = formatMobileNumber(cleanedValue);
            //console.log('Formatted Value:', formattedValue);
            truckRecords = await fetchTruckRecords(formattedValue);
        }
        if (!truckRecords || truckRecords.length === 0) {   
            return res.status(404).send({ error: 'Mobile number is not valid' });
        }
        res.send({
            status: 'success',
            //data: truckRecords
          });
        
    } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {CustomerList,CustomerTruckList, CustomerValidation};