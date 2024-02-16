const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const admin = require('firebase-admin');
const Emiroutes = require('./routes/Emiroutes');
const CDLoanroutes = require('./routes/CDLoanroutes.js');
var serviceAccount = require("./pnffrontend-firebase-adminsdk-wbif2-daf8b85b61.json");
const TyreLoanRoutes= require('./routes/TyreLoanroutes.js');
const CustomerRoutes = require('./routes/Customerroutes.js');
const VehicleRoutes = require('./routes/Vehicleroutes.js');
const CustomerKYCRoutes = require('./routes/CustomerKYCroutes.js');
const TestLoanRoutes = require('./routes/TestLoanroutes.js');
const TyreDataRoutes = require('./routes/TyreDataroutes.js');

dotenv.config();

const app = express();
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
    // main();
    res.send('Hello, welcome to PNF Loan Backend!');
});

app.use('/customer', CustomerRoutes);
app.use('/cdloans',CDLoanroutes);
app.use('/emi',Emiroutes);
app.use('/tyreloans',TyreLoanRoutes);
app.use('/customerKyc',CustomerKYCRoutes );
app.use('/vehicles',VehicleRoutes);
app.use('/testloans',TestLoanRoutes);
app.use('tyre',TyreDataRoutes);

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
    // console.log(tomorrowemidue)


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
        // notification: messageData, // Custom data for the message
        notification:{
            title:messageData.title,
            body:messageData.body
        },
        // tokens: tokens, // Array of FCM tokens to send the message to
        token: tokens, // Array of FCM tokens to send the message to
        android: {
            notification: {
              // Set priority to high for prompt delivery
              priority: 'high',
            },
          },
          data:{
            screen:messageData.loanid
          }
      };
  
    //   const response = await messaging.sendMulticast(message);
      const response = await messaging.send(message);
    //   console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; 
    }
  }
// async function main() {
//     try {
//        const emitomorrowdue = await getemiduetomorrow();
//        console.log(emitomorrowdue);
//       // Retrieve tokens from Firestore
//       const snapshot = await firestore.collection('customer').get();
//       const tokens = [];
//       const mobileNumberFirestore = []
  
//       snapshot.forEach(doc => {
//         const mobile =doc.id
//         const token = doc.data().token;
//         tokens.push(token);
//         mobileNumberFirestore.push(mobile);
//       });
//       console.log(mobileNumberFirestore);
//       const mobileNumbersToNotify = [];
//       for (const emi of emitomorrowdue) {
//           const modifiedMobileNumber = emi.mobileNumber.slice(-10);
//           if (mobileNumberFirestore.indexOf(modifiedMobileNumber) !== -1) {
//               mobileNumbersToNotify.push(modifiedMobileNumber);
//               console.log(mobileNumbersToNotify);
              
//                 // Extract tokens for mobile numbers to notify
//                 const tokensToNotify = mobileNumbersToNotify.map(mobileNumber => {
//                     const index = mobileNumberFirestore.indexOf(mobileNumber);
//                     return tokens[index];
//                 });
//                 console.log(tokensToNotify);
//               // Construct notification data for tomorrow's upcoming EMIs
//               const notificationData = {
//                 title: `Upcoming EMI for Loan ${emi.tomorrowEmiDue['loan id']}`,
//                 body: `Tomorrow is the last date for EMI Amount ₹ ${emi.tomorrowEmiDue['amount']}.`
//               };
        
//             //   console.log(tokensToSend);
          
//               // Send multicast message
//               await sendMulticastMessage(notificationData, tokensToNotify);
//           }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
// }

async function main() {
  try {
      const emitomorrowdue = await getemiduetomorrow();
      console.log(emitomorrowdue);
      const snapshot = await firestore.collection('customer').get();
    //   console.log(snapshot);
      const tokens = new Map();

      // Store unique mobile numbers in a Set
      const processedMobiles = new Set();

      snapshot.forEach(doc => {
          const mobile = doc.id.slice(-10); // Assuming doc.id contains the full mobile number
          const token = doc.data().token;
          tokens.set(mobile, token);
      });

      for (const emi of emitomorrowdue) {
          const mobile1 = emi.mobileNumber.slice(-10);
          
          // Check if mobile number has already been processed
          if (processedMobiles.has(mobile1)) {
              console.log(`Notification already sent for mobile number: ${mobile}`);
              continue; // Skip processing if notification has already been sent
          }

          if (tokens.has(mobile1)) {
              const tokenToNotify = tokens.get(mobile1);
              const notificationData = {
                  title: `Upcoming EMI for Loan ${emi.tomorrowEmiDue['loan id']}`,
                  body: `Tomorrow is the last date for EMI Amount ₹ ${emi.tomorrowEmiDue['amount']}.`,
                  loanid: `${emi.tomorrowEmiDue['loan id']}`
              };
              await sendMulticastMessage(notificationData, tokenToNotify);
              
              // Add processed mobile number to Set
              processedMobiles.add(mobile1);
          }
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

// app.get('/api/cron',main);

// cron.schedule('57 13 * * *', main); 
// main()
  // Call the main function
// setInterval(main,30000);

app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`);
});
