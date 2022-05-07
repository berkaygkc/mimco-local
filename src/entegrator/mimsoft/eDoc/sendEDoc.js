const eDoc = require('./index');
const resolveToken = require('../../../middlewares/mimsoft/resolveToken');
const db = require('../../../sqlite/sqlite-db');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const sendEDoc = (invId) => {
    return new Promise(async (resolve, reject) => {
        const token = await resolveToken();
        //db.query('select * from invoices where id = ?', [invId])
        prisma.invoices.findFirst({
                where: {
                    id: Number(invId)
                }
            })
            .then(result => {
                const xml = result.xml_path.replace('\\', '/');
                switch (result.invoice_profile) {
                    case 'e-Fatura':
                        eDoc.eInvoice.sendInvoice(xml, token)
                            .then(result => {
                                resolve(result);
                            })
                        break;
                    case 'İhracat Faturası':
                        eDoc.eInvoice.sendInvoice(xml, token)
                            .then(result => {
                                resolve(result);
                            })
                        break;
                    case 'e-Arşiv Fatura':
                        eDoc.eArchive.sendInvoice(xml, token)
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