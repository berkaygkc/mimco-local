const db = require('../../sqlite/sqlite-db');
const addZero = require('add-zero');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (documentSerieCode) => {
    return new Promise((resolve, reject) => {
        prisma.documentSeries.findFirst({
                where: {
                    id: Number(documentSerieCode)
                }
            })
            .then(result => {
                const seri = result.serie + '2022';
                const sira = addZero(result.serial + 1, 9);
                const invoiceId = seri + sira;
                const serieId = result.id;
                prisma.documentSeries.update({
                        where: {
                            id: serieId
                        },
                        data: {
                            serial: result.serial + 1
                        }
                    })
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