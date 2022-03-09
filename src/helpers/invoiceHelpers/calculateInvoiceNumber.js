const db = require('../../sqlite/sqlite-db');
const addZero = require('add-zero');

module.exports = (systemInvoiceTypeCode) => {
    return new Promise((resolve, reject) => {
        db
            .query('select * from company_series where type = ?', [systemInvoiceTypeCode])
            .then(result => {
                const seri = result[0].serie + '2022';
                const sira = addZero(result[0].serial + 1, 9);
                const invoiceId = seri + sira;
                db.insert('update company_series set serial = ? where type = ?', [result[0].serial + 1, systemInvoiceTypeCode])
                    .then(result => {
                        resolve(invoiceId);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}