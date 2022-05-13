const builders = require('../../builders/index');
const {createRecordDespatch} = require('../queue/createRecordDespatchQueue');

const insertDespatchSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    builders.despatchJSONBuilder(erpId)
    .then(result => {
        createRecordDespatch(result);
        done(null, result);
    })
    .catch(err => {
        done(new Error(JSON.stringify(err)));
    })
}

module.exports = insertDespatchSQLProcess;