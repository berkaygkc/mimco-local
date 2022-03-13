const builders = require('../../builders/index');
const {createRecord} = require('../queue/createRecordQueue');

const insertSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    builders.invoiceJsonBuilder(erpId)
    .then(result => {
        createRecord(result);
        done(null, result);
    })
    .catch(err => {
        done(new Error(JSON.stringify(err)));
    })
}

module.exports = insertSQLProcess;