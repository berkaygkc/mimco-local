const fs = require('fs');
const calculateAliasDespatch = require('../../helpers/despatchHelpers/checkAliasDespatch')
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();


const createRecordProcess = async (job, done) => {

    let despatchJSON;
    despatchJSON = await calculateAliasDespatch(job.data.data);
    //despatchJSON = await checkAliasdespatch(despatchJSON);
    const erpId = despatchJSON.ID;
    const uuid = despatchJSON.UUID;
    const ERPRefDocNumber = despatchJSON.ERPRefDocNumber;
    const issueDate = despatchJSON.IssueDate;
    const issueTime = despatchJSON.IssueTime;
    const customerName = despatchJSON.Parties[0].Name;
    const customer_tax = despatchJSON.Parties[0].Identities[0].Value;
    const despatchTemplate = despatchJSON.XSLTCode;
	const despatchSerie = despatchJSON.DocumentSerieCode;
    let needChange = false;
    if(!(despatchJSON.Shipment.Drivers && despatchJSON.Shipment.Drivers.length > 0)) {
        needChange = true;
    }
    if(!despatchJSON.Shipment.PlateID){
        needChange = true;
    }
    if(!(despatchJSON.Shipment.Others.SevkIssueDate && despatchJSON.Shipment.Others.SevkIssueTime)) {
        needChange = true;
    }
    const despatchString = JSON.stringify(despatchJSON);
    const jsonPath = __basedir + '/files/jsons/' + erpId + '-' + uuid + '.json';
    prisma.despatches.create({
            data: {
                erpId,
                erpRefDocNumber: ERPRefDocNumber,
                uuid: uuid,
                despatch_serie_id: despatchSerie,
                despatch_template_id: despatchTemplate,
                issue_date: issueDate,
                issue_time: issueTime,
                customer_name: customerName,
                customer_tax: customer_tax,
                json_path: jsonPath,
                need_change: needChange
            }
        })
        .then(result => {
            fs.writeFile(jsonPath, despatchString, (err) => {
                if (err) done(new Error(err));
                done(null, result);
            })
        })
        .catch(err => {
            console.log(err);
            done(new Error(err));
        })


}

module.exports = createRecordProcess;