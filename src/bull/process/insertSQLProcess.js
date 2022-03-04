const res = require('express/lib/response');
const invoiceBuilder = require('../../builders/mainInvoiceObject')

const insertSQLProcess = async (job, done) => {
    console.log(job.data)
    const erpId = job.data.data;
    invoiceBuilder(erpId)
    .then(result => {
        console.log('worker sonuc : ',result);
        done(null, result);
    })
    
    /*mssql()
    .then(request => {
        request
        .input('erpId', sql.VarChar(), erpId)
        .query('select * from Invoice_Trigger where ERPID like @erpId')
        .then(async (result) => { 
            console.log('sonuç , ',result);*/
    
        /*})
        .catch(err => {
            console.log('err ',err);
            done(new Error(err));
        })
    })
    .catch(err => {
        console.log('err ',err);
        done(new Error(err));
    })*/
}

module.exports = insertSQLProcess;