const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const admin = require('firebase-admin');
var serviceAccount = require("./pnffrontend-firebase-adminsdk-wbif2-daf8b85b61.json");

dotenv.config();

const app = express();
const customerRouter = express.Router();
const Port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let tokens =[]
const firestore = admin.firestore()
const messaging = admin.messaging();

app.get('/', (req, res) => {
    main();
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
            driverSalary,
            loanType,
            monthlyEMIOutflow
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
            "804":{"value":driverSalary},
            "1208":{"value":loanType},
            "798":{"value":monthlyEMIOutflow}
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

async function getemiduetomorrow() {
    const today = new Date();
    today.setDate(today.getDate()+1);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();


    const tomorrowDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;


    // console.log("Tomorrow's date:", String(tomorrowDateString));
    const url1 =`${process.env.BACKEND_URL}/emi?criteria=sheet_${process.env.TIGERSHEET_EMI_SHEET_ID}.column_${process.env.TIGERSHEET_EMI_COLUMN_ID}=%22${tomorrowDateString}%22`
    const res = await axios.get(url1);
    const tomorrowemidue= res.data.data;


    const allMobileNumbersWithEmi = [];
    for (const emi of tomorrowemidue) {
        const customername = emi['customer'];
        // console.log("Customer Name:", customername);


        const url2 = `${process.env.BACKEND_URL}/customer?criteria=sheet_${process.env.TIGERSHEET_CUSTOMER_SHEET_ID}.column_${process.env.TIGERSHEET_CUSTOMER_COLUMN_ID}=%22${customername}%22`;
        const res1 = await axios.get(url2);
        const customerdetails = res1.data.data;
        // console.log("Customer Details:", customerdetails);


        // Extract mobile numbers from customerdetails
        const mobileNumbers = customerdetails.map(customer => {
            return {
                mobileNumber: customer['mobile number'],
                tomorrowEmiDue: emi
            };
        });
        // Add customer details to the array
        allMobileNumbersWithEmi.push(...mobileNumbers);
    }
    // console.log(allMobileNumbersWithEmi);
    return allMobileNumbersWithEmi;
}
// getemiduetomorrow()

async function sendMulticastMessage(messageData, tokens) {
    try {
      const message = {
        notification: messageData, // Custom data for the message
        tokens: tokens, // Array of FCM tokens to send the message to
        android: {
            notification: {
              // Set priority to high for prompt delivery
              priority: 'high',
            },
          },
      };
  
      const response = await messaging.sendMulticast(message);
    //   console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; 
    }
  }
async function main() {
    try {
       const emitomorrowdue = await getemiduetomorrow();
    //    console.log(emitomorrowdue);
      // Retrieve tokens from Firestore
      const snapshot = await firestore.collection('customer').get();
      const tokens = [];
      const mobileNumberFirestore = []
  
      snapshot.forEach(doc => {
        const mobile =doc.id
        const token = doc.data().token;
        tokens.push(token);
        mobileNumberFirestore.push(mobile);
      });
      console.log(mobileNumberFirestore);
      const mobileNumbersToNotify = [];
      for (const emi of emitomorrowdue) {
          const modifiedMobileNumber = emi.mobileNumber.slice(-10);
          if (mobileNumberFirestore.indexOf(modifiedMobileNumber) !== -1) {
              mobileNumbersToNotify.push(modifiedMobileNumber);
              console.log(mobileNumbersToNotify);
              
                // Extract tokens for mobile numbers to notify
                const tokensToNotify = mobileNumbersToNotify.map(mobileNumber => {
                    const index = mobileNumberFirestore.indexOf(mobileNumber);
                    return tokens[index];
                });
                console.log(tokensToNotify);
              // Construct notification data for tomorrow's upcoming EMIs
              const notificationData = {
                title: `Upcoming EMI for Loan ${emi.tomorrowEmiDue['loan id']}`,
                body: `Tomorrow is the last date for EMI Amount ₹ ${emi.tomorrowEmiDue['amount']}.`
              };
        
            //   console.log(tokensToSend);
          
              // Send multicast message
              await sendMulticastMessage(notificationData, tokensToNotify);
          }
      }
    } catch (error) {
      console.error('Error:', error);
    }
}
// app.get('/api/cron',main);
// cron.schedule('57 13 * * *', main); 
main()
  // Call the main function
// setInterval(main,30000);

app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`);
});
