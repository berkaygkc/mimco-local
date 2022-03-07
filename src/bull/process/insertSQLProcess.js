const builders = require('../../builders/index');
const {createRecord} = require('../queue/createRecordQueue');

const insertSQLProcess = async (job, done) => {
    console.log(job.data)
    const erpId = job.data.data;
    builders.invoiceJsonBuilder(erpId)
    .then(result => {
        console.log('worker sonuc : ',result);
        createRecord(result);
        done(null, result);
    })
    .catch(err => {
        done(new Error(err));
    })
}

module.exports = insertSQLProcess;