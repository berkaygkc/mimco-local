const fs = require('fs');
const db = require('../../sqlite/sqlite-db');
const calculateJsonInvoice = require('../../helpers/invoiceHelpers/calculateInvoice');
const checkAliasInvoice = require('../../helpers/invoiceHelpers/checkAliasInvoice');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const updateRecordProcess = async (job, done) => {

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
    const customer_tax = invoiceJson.Parties[0].Identities[0].Value;
    const payableAmount = invoiceJson.Monetary.PayableAmount;
    const invoiceProfile = invoiceJson.SystemInvTypeCode == 1 ? 'e-Fatura' : 'e-Arşiv Fatura';
    const invoiceTemplate = invoiceJson.XSLTCode;
    const invoiceString = JSON.stringify(invoiceJson);
    const jsonPath = __basedir + '/files/jsons/' + erpId + '-' + uuid + '.json';
    //db.query('select * from invoices where erpId = ?', [erpId])
    prisma.invoices.findFirst({
        where:{
            erpId: erpId
        }
    })    
    .then(result => {
            const deleted = fs.unlinkSync(result.json_path);
            //db.insert('update invoices set erpRefDocNumber = ? , issue_date = ? , issue_time = ?, customer_name = ?, payable_amount = ?, currency_code = ?, json = ?, invoice_type = ?, uuid = ?, invoice_profile = ?, customer_tax = ?, is_sended = 0, status_code = \'\', status_description =  \'\' where erpId = ? ', [ERPRefDocNumber, issueDate, issueTime, customerName, payableAmount, currencyCode, jsonPath, invoiceType, uuid, invoiceProfile, customer_tax, erpId])
            prisma.invoices.update({
                where:{
                    erpId: erpId
                },
                data:{
                    erpRefDocNumber: ERPRefDocNumber,
                    invoice_profile: invoiceProfile,
                    invoice_type: invoiceType,
                    invoice_serie_id: 1,
                    invoice_template_id: invoiceTemplate,
                    issue_date: issueDate,
                    issue_time: issueTime,
                    customer_name: customerName,
                    customer_tax: customer_tax,
                    payable_amount: payableAmount,
                    currency_code: currencyCode,
                    json_path: jsonPath,
                    is_sended: false,
                    status_code: null,
                    status_description: null
                }
            })
                .then(result => {
                    fs.writeFile(jsonPath, invoiceString, (err) => {
                        if (err) done(new Error(err));
                        done(null, result);
                    })
                })
                .catch(err => {
                    console.log(err);
                    done(new Error(err));
                })
        })
        .catch(err => {
            console.log(err);
            done(new Error(err));
        })
}

module.exports = updateRecordProcess;