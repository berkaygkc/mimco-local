const builders = require('../../builders/index');
const {updateRecord} = require('../queue/updateRecordQueue');
const db = require('../../sqlite/sqlite-db');
const { createRecord } = require('../queue/createRecordQueue');
const {
    PrismaClient
} = require('@prisma/client');
const updateDespatchNumberSQL = require('../../helpers/despatchHelpers/updateDespatchNumberSQL');

const prisma = new PrismaClient();

const updateDespatchNumberProcess = async (job, done) => {
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
            updateDespatchNumberSQL(result.erpId, result.invoice_number)
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

module.exports = updateDespatchNumberProcess;