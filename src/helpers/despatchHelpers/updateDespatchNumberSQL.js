const {
    mssql,
    sql
} = require('../../mssql/mssql-pool');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const updateDespatchNumberSQL = (erpId, dspNo) => {
    return new Promise((resolve, reject) => {
        prisma.sqlQueries.findFirst({
                select: {
                    update_despatch_number_sql: true
                }
            })
            .then(result => {
                const sqlQuery = result.update_despatch_number_sql;
                if (sqlQuery) {
                    mssql()
                        .then(request => {
                            request
                                .input('erpId', sql.VarChar, erpId)
                                .input('dspNo', sql.VarChar, dspNo)
                                .query(sqlQuery)
                                .then(result => {
                                    resolve({status: true});
                                })
                                .catch(err => {
                                    reject({status:false, message:err});
                                })
                        })
                        .catch(err => {
                            reject({status:false, message:err});
                        })
                } else {
                    resolve({status:false, message:'SQL Query not found!'});
                }
            })
            .catch(err => {
                reject({status:false, message:err});
            })
    })
}

module.exports = updateDespatchNumberSQL;