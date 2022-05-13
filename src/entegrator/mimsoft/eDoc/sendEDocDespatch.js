const eDoc = require('./index');
const resolveToken = require('../../../middlewares/mimsoft/resolveToken');
const db = require('../../../sqlite/sqlite-db');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const sendEDoc = (dspId) => {
    return new Promise(async (resolve, reject) => {
        const token = await resolveToken();
        //db.query('select * from invoices where id = ?', [invId])
        prisma.despatches.findFirst({
                where: {
                    id: Number(dspId)
                }
            })
            .then(result => {
                const xml = result.xml_path.replace('\\', '/');
                eDoc.eDespatch.sendDespatch(xml, token)
                    .then(result => {
                        resolve(result);
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = sendEDoc;