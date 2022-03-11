const builders = require('../../builders/index');
const db = require('../../sqlite/sqlite-db');
const fs = require('fs');
const {updateInvoiceStatus} = require('../queue/updateInvoiceStatusQueue');
const sendEDoc = require('../../entegrator/mimsoft/eDoc/sendEDoc');

const sendInvoiceProcess = async (job, done) => {
    const invId = job.data.invId;
    updateInvoiceStatus(invId, 100);
    db
    .query('select * from invoices where id = ?', [invId])
    .then(async (result) => {
        const xmlPath =  __basedir + '/files/xmls/' + result[0].uuid + '.xml';
        const xml = await builders.invoiceXMLBuilder(result[0].json, { type: 'send' })
        fs.writeFile( xmlPath , xml, (err) => {
            if(err) {
                updateInvoiceStatus(invId, 101, err);
                done(new Error(err));
            }
            db
            .insert('update invoices set xml_path = ? where id = ?', [xmlPath, invId])
            .then(result => {
                sendEDoc(invId)
                .then(result => {
                    if(result.resultCode == 201){
                        updateInvoiceStatus(invId, 103);
                        done(null, result);
                    } else {
                        updateInvoiceStatus(invId, 102, result);
                        done(null, result);
                    }
                })
                .catch(err => {
                    updateInvoiceStatus(invId, 101, err);
                    console.log(err);
                    done(new Error(err));
                })
            })
            .catch(err => {
                updateInvoiceStatus(invId, 101, err);
                done(new Error(err));
            })
           
        })
    })
    .catch(err => {
        updateInvoiceStatus(invId, 101, err);
        done(new Error(err));
    })
}

module.exports = sendInvoiceProcess;