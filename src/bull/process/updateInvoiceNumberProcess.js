const builders = require('../../builders/index');
const {updateRecord} = require('../queue/updateRecordQueue');
const db = require('../../sqlite/sqlite-db');
const { createRecord } = require('../queue/createRecordQueue');
const {
    PrismaClient
} = require('@prisma/client');
const updateInvoiceNumberSQL = require('../../helpers/invoiceHelpers/updateInvoiceNumberSQL');

const prisma = new PrismaClient();

const updateInvoiceNumberProcess = async (job, done) => {
    const invId = job.data.data;
    prisma.invoices.findFirst({
        where:{
            id: Number(invId)
        },
        select: {
            invoice_number: true,
            erpId: true
        }
    })
    .then(result => {
        if(result.invoice_number){
            updateInvoiceNumberSQL(result.erpId, result.invoice_number)
            .then(result => {
                if(result.status){
                    done(null, result);
                } else {
                    done(new Error(JSON.stringify(result.message)));
                }
            })
            .catch(err => {
                done(new Error(JSON.stringify(err)));
            })
        }
    })
    .catch(err => {
        done(new Error(err));
    })
   
}

module.exports = updateInvoiceNumberProcess;