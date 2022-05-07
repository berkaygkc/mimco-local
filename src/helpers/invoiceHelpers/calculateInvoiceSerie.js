const db = require('../../sqlite/sqlite-db');
const addZero = require('add-zero');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (systemInvoiceTypeCode) => {
    return new Promise((resolve, reject) => {
        prisma.documentSeries.findFirst({
                where: {
                    type: systemInvoiceTypeCode,
                    default: true
                }
            })
            .then(result => {
                resolve(result.id)
            })
            .catch(err => {
                reject(err);
            })
    })
}