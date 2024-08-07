const getTyreData = require('../controller/TryeDataController.js');

const TyreData = async (req,res)=>{
    try{
        const url=process.env.TIGERSHEET_API_CREATE_URL;
        const headers={
            'Authorization':process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        const sheetId = process.env.TIGERSHEET_TYRE_LOAN_SHEET_ID;
        // Extract data from the request body
        //console.log(req.body)
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
            sourcerefid,
            date,
            NoOfTrucks,
            cnfPanNumber,
            driverSalary,
            loanType,
            monthlyEMIOutflow,
            selectedProduct,
            oldornew,
            numberOfYearsInBusiness,
            dob
        } = req.body;
        const dataField = {
            "201":{"value":FullName},
            "200":{"value":date},
            "215":{"value":loanAmount },            
            // "807":sourceJsonValue,
            // "807":{"value":"{\"reference_column_id\":7,\"value\":\"SHARMILA\"}"},
            "217": {"value": `{"reference_column_id":"${sourcerefid}","value":"${source}"}`},
            "216":{"value":numberOfTires },
            "202":{"value":PanNumber},
            "203":{"value":mobilenumber},
            "204":{"value":AlternateMobileNumber},
            "205":{"value":NoOfTrucks},
            "210":{"value":martialStatus},
            "211":{"value":numchildren},
            "212":{"value":houseType},
            "213":{"value":truckNumber},
            "839":{"value":selectedBrand},
            "234":{"value":cnfPanNumber},
            "214":{"value":driverSalary},
            "1412":{"value":loanType},
            "208":{"value":monthlyEMIOutflow},
            "1453":{"value": selectedProduct},
            "243": {"value": oldornew},
            "206": {"value": numberOfYearsInBusiness},
            "1421": {"value": dob},
        };

    

        const data = JSON.stringify(dataField);
        const tyreData= await getTyreData(url,headers,sheetId,data);
        console.log(tyreData)
        res.status(200).send({ data: tyreData });
        
    }catch(err){
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = TyreData;