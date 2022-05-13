const { mssql, sql } = require('../../../../mssql/mssql-pool');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const othersBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        prisma.sqlQueries.findFirst({
            select: {
                despatch_shipment_other_sql: true
            }
        })
        .then(result => {
            const sqlQuery = result.despatch_shipment_other_sql;
            if(sqlQuery) {
                mssql()
                .then(request => {
                    request
                    .input('erpId', sql.VarChar, erpId)
                    .query(sqlQuery)
                    .then(result => {
                        const object = result.recordset;
                        resolve(object);
                    })
                    .catch(err => {
                        reject(err);
                    })
                })
                .catch(err => {
                    reject(err);
                })
            }
            else {
                resolve({});
            }
           
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = othersBuilder;