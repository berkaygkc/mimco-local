const eDoc = require('./index');
const resolveToken = require('../../../middlewares/mimsoft/resolveToken');
const db = require('../../../sqlite/sqlite-db');

const checkStatus = (invId) => {
    return new Promise(async (resolve, reject) => {
        const token = await resolveToken();
        db
        .query('select * from invoices where id = ?', [invId])
        .then(result => {
            const uuid = result[0].uuid;
            switch(result[0].invoice_profile) {
                case 'e-Fatura':
                    eDoc.eInvoice.checkStatus(uuid, token)
                    .then(result => {
                        resolve(result);
                    })
                    break;
                case 'e-Arşiv Fatura':
                    eDoc.eArchive.checkStatus(uuid, token)
                    .then(result => {
                        resolve(result);
                    })
                    break;
                default:
                    reject('Fatura Bulunamadı!');
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = checkStatus;