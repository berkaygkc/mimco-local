const builders = require('../../builders/index');
const {
    createRecord
} = require('../queue/createXMLQueue');
const fs = require('fs');

const insertSQLProcess = async (job, done) => {
    console.log(job.data);
    const jsonPath = job.data.data;
    builders.invoiceXMLBuilder(jsonPath)
        .then(result => {
            const xmlPath = __basedir + '/files/xmls/' +job.data.erpId+'-'+ job.data.uuid + '.xml';
            fs.writeFile(xmlPath, result, (err) => {
                if (err) done(new Error(err));
                done(null, result);
            })
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = insertSQLProcess;