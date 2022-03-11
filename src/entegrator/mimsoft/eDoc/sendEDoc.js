const eInvoice = require('./eInvoice/sendEInvoice');
const eArchive = require('./eArchive/sendEArchive');
const resolveToken = require('../../../middlewares/mimsoft/resolveToken');
const db = require('../../../sqlite/sqlite-db');

const sendEDoc = (invId) => {
    return new Promise(async (resolve, reject) => {
        const token = await resolveToken();
        db
        .query('select * from invoices where id = ?', [invId])
        .then(result => {
            const xml = result[0].xml_path.replace('\\', '/');
            switch(result[0].invoice_profile) {
                case 'e-Fatura':
                    eInvoice(xml, token)
                    .then(result => {
                        resolve(result);
                    })
                    break;
                case 'e-Arşiv Fatura':
                    eArchive(xml, token)
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

module.exports = sendEDoc;