// const axios = require('axios');
// const admin = require('firebase-admin');
// var serviceAccount = require('../pnffrontend-firebase-adminsdk-wbif2-daf8b85b61.json');
// const dotenv = require('dotenv');

// dotenv.config();

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const firestore = admin.firestore()
// const messaging = admin.messaging();

// async function getemiduetomorrow() {
//   console.log("function is calling");
//     const today = new Date();
//     today.setDate(today.getDate()+1);
//     const year = today.getFullYear();
//     const month = today.getMonth() + 1;
//     const day = today.getDate();


//     const tomorrowDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;


//     // console.log("Tomorrow's date:", String(tomorrowDateString));
//     const url1 =`https://pnf-backend.vercel.app/emi?criteria=sheet_${process.env.TIGERSHEET_EMI_SHEET_ID}.column_${process.env.TIGERSHEET_EMI_COLUMN_ID}=%22${tomorrowDateString}%22`
//     const res = await axios.get(url1);
//     const tomorrowemidue= res.data.data;
//     //console.log(tomorrowemidue)


//     const allMobileNumbersWithEmi = [];
//     for (const emi of tomorrowemidue) {
//         const customername = emi['customer'];
//         // console.log("Customer Name:", customername);
//         const url2 = `https://pnf-backend.vercel.app/customer?criteria=sheet_${process.env.TIGERSHEET_CUSTOMER_SHEET_ID}.column_${process.env.TIGERSHEET_CUSTOMER_COLUMN_ID}=%22${customername}%22`;
//         const res1 = await axios.get(url2);
//         const customerdetails = res1.data.data;
//         console.log("Customer Details:", customerdetails);


//         // Extract mobile numbers from customerdetails
//         const mobileNumbers = customerdetails.map(customer => {
//             return {
//                 mobileNumber: customer['mobile number'],
//                 tomorrowEmiDue: emi
//             };
//         });
//         // Add customer details to the array
//         allMobileNumbersWithEmi.push(...mobileNumbers);
//     }
//     // console.log(allMobileNumbersWithEmi);
//     return allMobileNumbersWithEmi;
// }

// async function sendMulticastMessage(messageData, tokens) {
//     try {
//       const message = {
//         // notification: messageData, // Custom data for the message
//         notification:{
//             title:messageData.title,
//             body:messageData.body
//         },
//         // tokens: tokens, // Array of FCM tokens to send the message to
//         token: tokens, // Array of FCM tokens to send the message to
//         android: {
//             notification: {
//               // Set priority to high for prompt delivery
//               priority: 'high',
//             },
//           },
//           data:{
//             screen:messageData.loanid
//           }
//       };
  
//     //   const response = await messaging.sendMulticast(message);
//       const response = await messaging.send(message);
//     console.log('Successfully sent message:', response);
//       return response;
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error; 
//     }
//   }
// async function emiTomorrowPN() {
//     try {
//         const emitomorrowdue = await getemiduetomorrow();
//         console.log(emitomorrowdue);
//         const snapshot = await firestore.collection('customer').get();
//       //   console.log(snapshot);
//         const tokens = new Map();
  
//         // Store unique mobile numbers in a Set
//         const processedMobiles = new Set();
  
//         snapshot.forEach(doc => {
//             const mobile = doc.id.slice(-10); // Assuming doc.id contains the full mobile number
//             const token = doc.data().token;
//             tokens.set(mobile, token);
//         });
  
//         for (const emi of emitomorrowdue) {
//             const mobile1 = emi.mobileNumber.slice(-10);
            
//             // Check if mobile number has already been processed
//             if (processedMobiles.has(mobile1)) {
//                 console.log(`Notification already sent for mobile number: ${mobile1}`);
//                 continue; // Skip processing if notification has already been sent
//             }
  
//             if (tokens.has(mobile1)) {
//                 const tokenToNotify = tokens.get(mobile1);
//                 const notificationData = {
//                     title: `Upcoming EMI for Loan ${emi.tomorrowEmiDue['loan id']}`,
//                     body: `Tomorrow is the last date for EMI Amount ₹ ${emi.tomorrowEmiDue['amount']}.`,
//                     loanid: `${emi.tomorrowEmiDue['loan id']}`
//                 };
//                 await sendMulticastMessage(notificationData, tokenToNotify);
                
//                 // Add processed mobile number to Set
//                 processedMobiles.add(mobile1);
//             }
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
//   }
// //  emiTomorrowPN()
//   module.exports = emiTomorrowPN;
// const axios = require('axios');
// const admin = require('firebase-admin');
// const serviceAccount = require('../pnffrontend-firebase-adminsdk-wbif2-daf8b85b61.json');
// const dotenv = require('dotenv');

// dotenv.config();

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const firestore = admin.firestore();
// const messaging = admin.messaging();

// async function getEmiDueTomorrow() {
//     console.log("Function is calling");
//     const today = new Date();
//     today.setDate(today.getDate() + 1);
//     const year = today.getFullYear();
//     const month = today.getMonth() + 1;
//     const day = today.getDate();

//     const tomorrowDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

//     const url1 = `https://pnf-backend.vercel.app/emi?criteria=sheet_${process.env.TIGERSHEET_EMI_SHEET_ID}.column_${process.env.TIGERSHEET_EMI_COLUMN_ID}=%22${tomorrowDateString}%22`;
//     const { data } = await axios.get(url1);
//     const tomorrowEmiDue = data.data;
//     console.log(res.data)

//     // Fetch customer details in parallel
//     const customerRequests = tomorrowEmiDue.map(async (emi) => {
//         const customerName = emi['customer'];
//         const url2 = `https://pnf-backend.vercel.app/customer?criteria=sheet_${process.env.TIGERSHEET_CUSTOMER_SHEET_ID}.column_${process.env.TIGERSHEET_CUSTOMER_COLUMN_ID}=%22${customerName}%22`;
//         const { data: customerData } = await axios.get(url2);
//         return customerData.data.map(customer => ({
//             mobileNumber: customer['mobile number'],
//             tomorrowEmiDue: emi
//         }));
//     });

//     const allMobileNumbersWithEmi = (await Promise.all(customerRequests)).flat();
//     return allMobileNumbersWithEmi;
// }

// async function sendMulticastMessage(messageData, tokens) {
//     try {
//         const message = {
//             notification: {
//                 title: messageData.title,
//                 body: messageData.body
//             },
//             token: tokens,
//             android: {
//                 notification: {
//                     priority: 'high'
//                 }
//             },
//             data: {
//                 screen: messageData.loanid
//             }
//         };

//         const response = await messaging.send(message);
//         console.log('Successfully sent message:', response);
//         return response;
//     } catch (error) {
//         console.error('Error sending message:', error);
//         throw error;
//     }
// }

// async function emiTomorrowPN() {
//     try {
//         const emiDueTomorrow = await getEmiDueTomorrow();
//         console.log(emiDueTomorrow);

//         const snapshot = await firestore.collection('customer').get();
//         const tokens = new Map();

//         snapshot.forEach(doc => {
//             const mobile = doc.id.slice(-10); // Assuming doc.id contains the full mobile number
//             const token = doc.data().token;
//             tokens.set(mobile, token);
//         });

//         // Use a Set to keep track of processed mobile numbers
//         const processedMobiles = new Set();

//         // Send notifications in parallel
//         const notificationRequests = emiDueTomorrow.map(async (emi) => {
//             const mobile1 = emi.mobileNumber.slice(-10);

//             if (processedMobiles.has(mobile1)) {
//                 console.log(`Notification already sent for mobile number: ${mobile1}`);
//                 return; // Skip if notification has already been sent
//             }

//             if (tokens.has(mobile1)) {
//                 const tokenToNotify = tokens.get(mobile1);
//                 const notificationData = {
//                     title: `Upcoming EMI for Loan ${emi.tomorrowEmiDue['loan id']}`,
//                     body: `Tomorrow is the last date for EMI Amount ₹ ${emi.tomorrowEmiDue['amount']}.`,
//                     loanid: `${emi.tomorrowEmiDue['loan id']}`
//                 };

//                 await sendMulticastMessage(notificationData, tokenToNotify);
//                 processedMobiles.add(mobile1); // Mark mobile number as processed
//             }
//         });

//         await Promise.all(notificationRequests);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// module.exports = emiTomorrowPN;
const axios = require('axios');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('../pnffrontend-firebase-adminsdk-wbif2-daf8b85b61.json');

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const messaging = admin.messaging();

async function getEmiDueTomorrow() {
    console.log("Fetching EMI due tomorrow...");
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const tomorrowDateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    const url1 = `https://pnf-backend.vercel.app/emi?criteria=sheet_${process.env.TIGERSHEET_EMI_SHEET_ID}.column_${process.env.TIGERSHEET_EMI_COLUMN_ID}=%22${tomorrowDateString}%22`;

    const { data } = await axios.get(url1);
    const tomorrowEmiDue = data.data;

    const customerRequests = tomorrowEmiDue.map(async (emi) => {
        const customerName = emi['customer'];
        const url2 = `https://pnf-backend.vercel.app/customer?criteria=sheet_${process.env.TIGERSHEET_CUSTOMER_SHEET_ID}.column_${process.env.TIGERSHEET_CUSTOMER_COLUMN_ID}=%22${customerName}%22`;
        const { data: customerData } = await axios.get(url2);
        return customerData.data.map(customer => ({
            mobileNumber: customer['mobile number'],
            tomorrowEmiDue: emi,
        }));
    });

    return (await Promise.all(customerRequests)).flat();
}

async function sendMulticastMessage(messageData, token) {
    try {
        const message = {
            notification: {
                title: messageData.title,
                body: messageData.body,
            },
            token,
            android: {
                notification: {
                    priority: 'high',
                },
            },
            data: {
                screen: messageData.loanid,
            },
        };

        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

async function emiTomorrowPN() {
    try {
        const emiDueTomorrow = await getEmiDueTomorrow();
        console.log("Fetched EMI data:", emiDueTomorrow);

        const snapshot = await firestore.collection('customer').get();
        const tokens = new Map();

        snapshot.forEach(doc => {
            const mobile = doc.id.slice(-10); // Assuming doc.id contains the full mobile number
            const token = doc.data().token;
            tokens.set(mobile, token);
        });

        const processedMobiles = new Set();

        const notificationRequests = emiDueTomorrow.map(async (emi) => {
            const mobile1 = emi.mobileNumber.slice(-10);

            if (processedMobiles.has(mobile1)) {
                console.log(`Notification already sent for mobile number: ${mobile1}`);
                return;
            }

            if (tokens.has(mobile1)) {
                const tokenToNotify = tokens.get(mobile1);
                const notificationData = {
                    title: `Upcoming EMI for Loan ${emi.tomorrowEmiDue['loan id']}`,
                    body: `Tomorrow is the last date for EMI Amount ₹${emi.tomorrowEmiDue['amount']}.`,
                    loanid: `${emi.tomorrowEmiDue['loan id']}`,
                };

                await sendMulticastMessage(notificationData, tokenToNotify);
                processedMobiles.add(mobile1);
            }
        });

        await Promise.all(notificationRequests);
        console.log('All notifications sent successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = emiTomorrowPN;

