const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const Emiroutes = require('./routes/Emiroutes');
const CDLoanroutes = require('./routes/CDLoanroutes.js');
const TyreLoanRoutes= require('./routes/TyreLoanroutes.js');
const CustomerRoutes = require('./routes/Customerroutes.js');
const VehicleRoutes = require('./routes/Vehicleroutes.js');
const CustomerKYCRoutes = require('./routes/CustomerKYCroutes.js');
const TestLoanRoutes = require('./routes/TestLoanroutes.js');
const TyreDataRoutes = require('./routes/TyreDataroutes.js');
const emiTomorrowPN = require('./utils/TomorrowEMIDuePN.js');
const BrandData = require('./routes/Brandroute.js')
dotenv.config();

const app = express();
const Port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    // emiTomorrowPN();
    res.send('Hello, welcome to PNF Loan Backend!');
});

app.use('/customer', CustomerRoutes);
app.use('/cdloans',CDLoanroutes);
app.use('/emi',Emiroutes);
app.use('/tyreloans',TyreLoanRoutes);
app.use('/customerKyc',CustomerKYCRoutes );
app.use('/vehicles',VehicleRoutes);
app.use('/testloans',TestLoanRoutes);
app.use('/tyre',TyreDataRoutes);
app.use('/brand', BrandData);
app.get('/api/cron', (req, res) => {
    emiTomorrowPN();
    res.send("Cron job")
});

// cron.schedule('* * * * *', async () => {
//     try {
//         const response = await axios.get('http://localhost:4000/api/cron'); // Correct URL format
//         console.log('Cron job executed successfully:', response.data);
//     } catch (error) {
//         console.error('Error executing cron job:', error);
//     }
// });

app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`);
});
