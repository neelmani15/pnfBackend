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
            // "807":{"value":"{\"reference_column_id\":7,\"value\":\"SHARMILA\"}"},
            "807": {"value": `{"reference_column_id":"${sourcerefid}","value":"${source}"}`},
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

        // if (source !== null) {
        //     dataField["807"] = {"value": JSON.stringify({
        //         "reference_column_id": 236,
        //         "value": source
        //     })};
        // } else {
        //     dataField["807"] = {"value": null};
        // }

        const data = JSON.stringify(dataField);

        // const data = JSON.stringify({
        //     "791":{"value":FullName},
        //     "790":{"value":date},
        //     "805":{"value":loanAmount },            
        //     "807":sourceJsonValue,
        //     // "807":{"value":"{\"reference_column_id\":236,\"value\":\"PARMANAND\"}"},
            // "807": {"value": `{"reference_column_id":236,"value":"${source}"}`},
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
}

module.exports = TyreData;