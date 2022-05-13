const eDoc = require('./index');
const resolveToken = require('../../../middlewares/mimsoft/resolveToken');
const db = require('../../../sqlite/sqlite-db');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const checkStatus = (dspId) => {
    return new Promise(async (resolve, reject) => {
        const token = await resolveToken();
        prisma.despatches.findFirst({
                where: {
                    id: Number(dspId)
                }
            })
            .then(result => {
                const uuid = result.uuid;
                eDoc.eDespatch.checkStatus(uuid, token)
                    .then(result => {
                        resolve(result);
                    })

            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = checkStatus;