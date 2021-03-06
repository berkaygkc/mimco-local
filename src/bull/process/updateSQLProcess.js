const builders = require('../../builders/index');
const {updateRecord} = require('../queue/updateRecordQueue');
const db = require('../../sqlite/sqlite-db');
const { createRecord } = require('../queue/createRecordQueue');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const updateSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    //db.query('select * from invoices where erpId = ?', [erpId])
    prisma.invoices.findFirst({
        where:{
            erpId: String(erpId)
        }
    })
    .then(result => {
        if(result){
            if(result.is_sended && (result.status_code == 100 || result.status_code == 103 || result.status_code == 105)) {
                done(null, {erpId, message: 'Gönderilmiş fatura!'});
            } else {
                builders.invoiceJsonBuilder(erpId)
                .then(result => {
                    updateRecord(result);
                    done(null, {note: 'updated' ,result});
                })
                .catch(err => {
                    done(new Error(err));
                })
            }
        } else {
            builders.invoiceJsonBuilder(erpId)
            .then(result => {
                createRecord(result);
                done(null, {note: 'created' ,result});
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

module.exports = updateSQLProcess;