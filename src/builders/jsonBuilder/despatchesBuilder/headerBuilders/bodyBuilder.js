
const { mssql, sql } = require('../../../../mssql/mssql-pool');
const notesBuilder = require('./notesBuilder');
const orderBuilder = require('./orderBuilder');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();


const bodyBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        prisma.sqlQueries.findFirst({
            select: {
                despatch_sql: true
            }
        })
        .then((result) => {
            const sqlQuery = result.despatch_sql;
            mssql()
            .then((request) => {
                request
                .input('erpId', sql.VarChar, erpId)
                .query(sqlQuery)
                .then(async (result) => {
                    const object = result.recordset[0]
                    if(object) {
                        const notesObject = await notesBuilder(erpId);
                        const orderObject = await orderBuilder(erpId);
                        object['Notes'] = notesObject;
                        object['Order'] = orderObject;
                        resolve(object);
                    } else {
                        reject({status:false, message:'İrsaliye bulunamıyor!'})
                    }
                })
                .catch(err => {
                    console.log('err ', err);
                    reject(err);
                })
            })
            .catch(err => {
                console.log('err ', err);
                reject(err);
            })
        })
        .catch(err => {
            console.log('err ', err);
            reject(err);
        })
    })
    
}

module.exports = bodyBuilder;