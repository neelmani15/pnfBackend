const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cron = require('node-cron');

dotenv.config();

const app = express();
const customerRouter = express.Router();
const Port = process.env.PORT || 5000;
let UsermobileNumber=null

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, welcome to PNF Loan Backend!');
});

app.use('/customer', customerRouter);

app.get('/cdloans',async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        // console.log(req)
        const sheetId = process.env.TIGERSHEET_CDLOANS_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';;
        const cdloansRecords = await getcdloansRecords(url, headers, sheetId,criteria);
        res.send({data:cdloansRecords})

    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

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

app.get('/emi',async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_EMI_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';
        
        const emiRecords = await getemiRecords(url, headers, sheetId,criteria);
        res.send({data:emiRecords})
    }
    catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
})

async function getemiRecords(url, headers, sheetId,criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    };
  
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data.data;
  }


app.get('/tyreloans',async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_TYRELOANS_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';;
        // console.log(req);
        const cdloansRecords = await gettyreloansRecords(url, headers, sheetId,criteria);
        res.send({data:cdloansRecords})
    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/receiveToken',async (req, res) => {
    const { notificationData } = req.body;
    console.log("Notification Data",notificationData);
    // await sendNotification(notificationData);
    scheduleNotification(notificationData);
    // cron.schedule('0-59 * * * *',async()=>{
    //     await sendNotification(notificationData);
    // })
    res.send('Send Notification successfully');
});

function scheduleNotification(notificationData) {
    // Set the interval for next execution (e.g., every 1 hour)
    const interval = 30 * 1000; // 1 hour in milliseconds

    // Use setTimeout to schedule next execution after the interval
    setInterval(async () => {
        await sendNotification(notificationData);
    });
}

const sendNotification=async (notificationData) => {
    try {
        const fcmUrl = process.env.FCM_URL;
        const fcmServerKey = process.env.FCM_SERVER_KEY; 
        
        // const notificationData = {
        //     "to": "ekSiho_dS1yJch3Odt3Dd_:APA91bH6wuj_LipfDk2pvB_CVN4zpnRqjZyzLzjrY6s6U-qz7HgYx5QXlLoKJoEBa06MNS_QO_rzmcFBYKIB6UbG1u22EgLJVMtK8Ts0x2h-5PeAcqdOr2oRmrQIaTM2pJec1PczrlFR",
        //     "notification": {
        //         "body": "This is an FCM notification message!",
        //         "title": "Upcoming EMI Status"
        //     },
        //     "data": {
        //         "data_new": "Test Data"
        //     }
        // }
        
        
        const response = await axios.post(fcmUrl, notificationData, {
            headers: {
                'Authorization': `Bearer ${process.env.FCM_SERVER_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        
        // res.send({ success: true, response: response.data });
    } catch (err) {
        console.error('Error sending FCM notification:', err.message);
        // res.status(500).send('Internal Server Error');
    }
};

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

customerRouter.get('/',async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_CUSTOMER_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';;
        const cdloansRecords = await getcustomerRecords(url, headers, sheetId,criteria);
        res.send({data:cdloansRecords})

    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
})

async function getcustomerRecords(url, headers, sheetId,criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    //   'sort':JSON.stringify([{"property":"column_85","direction":"desc"}])
    };
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data.data;
}

customerRouter.get('/trucks',async (req,res)=>{
    try{
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_TRUCK_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';;
        const truckRecords = await gettruckRecords(url, headers, sheetId,criteria);
        res.send({data:truckRecords})

    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
})

async function gettruckRecords(url, headers, sheetId,criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    //   'sort':JSON.stringify([{"property":"column_85","direction":"desc"}])
    };
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data.data;
}

app.post("/tyre",async (req,res)=>{
    try{
        const url=process.env.TIGERSHEET_API_CREATE_URL;
        const headers={
            'Authorization':process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        const sheetId = process.env.TIGERSHEET_TYRE_LOAN_SHEET_ID;
        // Extract data from the request body
        const { 
            numberOfTires, 
            selectedBrand, 
            loanAmount,
            mobilenumber,
            FullName, 
            PanNumber, 
            AlternateMobileNumber,
            martialStatus,
            numchildren,
            houseType,
            truckNumber,
            source,
            date,
            NoOfTrucks,
            cnfPanNumber,
            driverSalary
        } = req.body;

        // const sourceValue = source ? source : 'null';
        // const sourceValue = "ASHPAK"

        // const sourceJsonValue = source
        //     ? JSON.stringify({
        //         "reference_column_id": 236,
        //         "value": source
        //     })
        //     : JSON.stringify({});


        // console.log("Source",source);
        // console.log("Source Value",sourceValue);

        // const data = JSON.stringify({
        //     "30541":{"value":numberOfTires },
        //     "30542":{"value":selectedBrand},
        //     "30543":{"value":loanAmount },
        //     "31495":{"value":mobilenumber},
        //     "31820":{"value":FullName},
        //     "31821":{"value":PanNumber},
        //     "31822":{"value":AlternateMobileNumber},
        //     "31854":{"value":martialStatus},
        //     "31855":{"value":numchildren},
        //     "31856":{"value":houseType},
        //     "31857":{"value":truckNumber},
        //     "31858":{"value":date},
        //     "31859":{"value":source},
        //     "32063":{"value":NoOfTrucks},
        //     "32122":{"value":cnfPanNumber}
        // });

        // const sourceJsonValue = JSON.stringify({
        //     "reference_column_id": 236,
        //     "value": sourceValue
        // });

        const dataField = {
            "791":{"value":FullName},
            "790":{"value":date},
            "805":{"value":loanAmount },            
            // "807":sourceJsonValue,
            // "807":{"value":"{\"reference_column_id\":236,\"value\":\"PARMANAND\"}"},
            // "807": {"value": `{"reference_column_id":236,"value":"${source}"}`},
            "806":{"value":numberOfTires },
            "792":{"value":PanNumber},
            "793":{"value":mobilenumber},
            "794":{"value":AlternateMobileNumber},
            "795":{"value":NoOfTrucks},
            "800":{"value":martialStatus},
            "801":{"value":numchildren},
            "802":{"value":houseType},
            "803":{"value":truckNumber},
            "855":{"value":selectedBrand},
            "810":{"value":cnfPanNumber},
            "804":{"value":driverSalary}
        };

        if (source !== null) {
            dataField["807"] = {"value": JSON.stringify({
                "reference_column_id": 236,
                "value": source
            })};
        } else {
            dataField["807"] = {"value": null};
        }

        const data = JSON.stringify(dataField);

        // const data = JSON.stringify({
        //     "791":{"value":FullName},
        //     "790":{"value":date},
        //     "805":{"value":loanAmount },            
        //     "807":sourceJsonValue,
        //     // "807":{"value":"{\"reference_column_id\":236,\"value\":\"PARMANAND\"}"},
        //     // "807": {"value": `{"reference_column_id":236,"value":"${source}"}`},
        //     "806":{"value":numberOfTires },
        //     "792":{"value":PanNumber},
        //     "793":{"value":mobilenumber},
        //     "794":{"value":AlternateMobileNumber},
        //     "795":{"value":NoOfTrucks},
        //     "800":{"value":martialStatus},
        //     "801":{"value":numchildren},
        //     "802":{"value":houseType},
        //     "803":{"value":truckNumber},
        //     "855":{"value":selectedBrand},
        //     "810":{"value":cnfPanNumber},
        //     "804":{"value":driverSalary}
        // });

        // console.log('Source:', source);

        const tyreData= await getTyreData(url,headers,sheetId,data);

        res.send({data:tyreData})
        
    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

async function getTyreData(url,headers,sheetId,data){
    const payload={
        'sheet_id':sheetId,
        'data':data
    }
    const response = await axios.post(url, payload, { headers });
    // console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data.data;
}

app.get('/customerKyc', async (req, res) => {
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
  });
  
async function getCustomerKycRecords(url, headers, sheetId, criteria) {
    const payload = {
        'sheet_id': sheetId,
        'criteria': criteria,
    };
  
    const response = await axios.post(url, payload, { headers });
    console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data.data;
  }

app.get('/vehicles', async (req, res) => {
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
  });
  
async function getVehicleRecords(url, headers, sheetId, criteria) {
    const payload = {
      'sheet_id': sheetId,
      'criteria': criteria,
    };
  
    const response = await axios.post(url, payload, { headers });
    console.log('All Records from Tigersheet Backend for Vehicles', response.data);
  
    return response.data.data;
}

app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`);
});
