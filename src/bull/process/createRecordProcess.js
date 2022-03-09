const fs = require('fs');
const db = require('../../sqlite/sqlite-db');
const calculateJsonInvoice = require('../../helpers/invoiceHelpers/calculateInvoice');
const checkAliasInvoice = require('../../helpers/invoiceHelpers/checkAliasInvoice');


const createRecordProcess = async (job, done) => {

    let invoiceJson;
    invoiceJson = await calculateJsonInvoice(job.data.data);
    invoiceJson = await checkAliasInvoice(invoiceJson);
    const erpId = invoiceJson.ID;
    const uuid = invoiceJson.UUID;
    const ERPRefDocNumber = invoiceJson.ERPRefDocNumber;
    const issueDate = invoiceJson.IssueDate;
    const issueTime = invoiceJson.IssueTime;
    const invoiceType = invoiceJson.InvoiceType;
    const currencyCode = invoiceJson.CurrencyCode;
    const customerName = invoiceJson.Parties[0].Name;
    const payableAmount = invoiceJson.Monetary.PayableAmount;
    const invoiceString = JSON.stringify(invoiceJson);
    const jsonPath = __basedir+'/files/jsons/'+erpId+'-'+uuid+'.json';
    db
    .insert('insert into invoices (erpId, erpRefDocNumber, issue_date, issue_time,'+
        ' customer_name, payable_amount, currency_code, json, invoice_type, uuid) values(?,?,?,?,?,?,?,?,?,?)'
        ,[erpId,ERPRefDocNumber, issueDate, issueTime, customerName, payableAmount, currencyCode, jsonPath, invoiceType, uuid])
    .then(result => {
        fs.writeFile( jsonPath , invoiceString, (err) => {
            if(err) done(new Error(err));
            done(null, result); 
        })
    })
    .catch(err => {
        console.log(err);
        done(new Error(err));
    })    
    
    
}

module.exports = createRecordProcess;