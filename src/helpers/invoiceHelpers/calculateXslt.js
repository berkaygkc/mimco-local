const db = require('../../sqlite/sqlite-db');

module.exports = (systemInvoiceTypeCode) => {
    return new Promise((resolve, reject) => {
        db
        .query('select * from invoice_xslt where type = ? and is_default = 1 limit 1', [systemInvoiceTypeCode])
        .then(result => {
            resolve(result[0].id);
        })
        .catch(err => {
            reject(err);
        })
    })
}